"use server";

import { headers } from "next/headers";
import { GoogleGenAI } from "@google/genai";
import connectDB from "@/lib/mongodb";
import { HoroscopeLog, RateLimit } from "@/lib/models";

const getClientIp = async () => {
  const forwardedFor = (await headers()).get("x-forwarded-for");
  const realIp = (await headers()).get("x-real-ip");
  
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp.trim();
  }
  
  return "127.0.0.1";
};

const checkRateLimit = async (ip: string) => {
  const now = new Date();
  
  // 1: Check Global Daily Limit (optional, using IP 'global_daily' as tracker)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let globalDaily = await RateLimit.findOne({ ip: 'global_daily', windowStart: { $gte: today } });
  if (!globalDaily) {
    globalDaily = new RateLimit({ ip: 'global_daily', count: 0, windowStart: today });
  }
  
  if (globalDaily.count >= 1000) {
    throw new Error("Hệ thống đã đạt giới hạn 1000 lượt vấn đáp hôm nay. Cậu quay lại vào ngày mai nha! 🌙");
  }

  // 2: Check IP Per Minute Limit
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
  let ipLimit = await RateLimit.findOne({ ip, windowStart: { $gte: oneMinuteAgo } });
  
  if (!ipLimit) {
    ipLimit = new RateLimit({ ip, count: 0, windowStart: now });
  }
  
  if (ipLimit.count >= 5) {
    throw new Error("Cậu đang hỏi vũ trụ quá nhanh! Đợi một xíu rùi thử lại nha. 🔮");
  }

  // Update limits
  globalDaily.count += 1;
  ipLimit.count += 1;
  
  await globalDaily.save();
  await ipLimit.save();
};

export async function getCosmicGuidance(name: string, birthdate: string, question: string) {
  try {
    await connectDB();
    const ip = await getClientIp();
    await checkRateLimit(ip);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Chưa cấu hình GEMINI_API_KEY");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Bạn là một 'Người dẫn lối từ vũ trụ' trong ứng dụng Memory Babyress. Nhiệm vụ của bạn là giải đáp các thắc mắc, lo âu của người dùng theo phong cách 'luận quẻ'.

Danh xưng: Sử dụng 'mình' và 'bạn'.
Phong cách: Nhẹ nhàng, thấu hiểu, có chút huyền bí nhưng vẫn trẻ trung, tinh nghịch.
Nội dung: Đưa ra lời khuyên ngắn gọn nhưng có tính 'chốt hạ' (quyết định thay họ). Không đưa ra lời khuyên quá chung chung kiểu 'hãy cân nhắc'. Nói như thể vũ trụ đã an bài kết quả đó.
Format: Luôn bắt đầu bằng một câu 'Tín hiệu cho thấy...' và kết thúc bằng một lời chúc hoặc một gợi ý hành động nhỏ.

Thông tin người dùng:
- Tên: ${name}
- Ngày sinh: ${birthdate}
- Thắc mắc: ${question || 'Hôm nay nên làm gì, đi đâu, cảm xúc thế nào?'}

Hãy luận quẻ cho riêng người này. Trả lời bằng Tiếng Việt tự nhiên, trẻ trung, sâu sắc. Ngắn gọn, có chiều sâu, không sáo rỗng.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const result = response.text || "Vũ trụ đang nghỉ ngơi, không có tín hiệu phản hồi. Cậu thử lại sau nha! ✨";

    // Save to DB
    const log = new HoroscopeLog({ name, birthdate, result });
    await log.save();

    return { success: true, text: result };
  } catch (error: any) {
    console.error("Cosmic Guidance Error:", error);
    return { success: false, error: error.message || "Vũ trụ đang bận xíu, thử lại sau nha! ✨" };
  }
}

