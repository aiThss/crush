"use server";

import { headers } from "next/headers";
import { GoogleGenAI } from "@google/genai";
import connectDB from "@/lib/mongodb";
import { HoroscopeLog, RateLimit, DeciderItem } from "@/lib/models";

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

export async function getCosmicGuidance(name: string, birthdate: string) {
  try {
    await connectDB();
    const ip = await getClientIp();
    await checkRateLimit(ip);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Chưa cấu hình GEMINI_API_KEY");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Bạn là một chuyên gia chiêm tinh học hiện đại với gu thẩm mỹ tinh tế. Hãy dùng ngày sinh [${birthdate}] và tên [${name}] để dự đoán: Vibe ngày mới, Tình duyên (nói kiểu ẩn ý, cuốn hút), và một lời khuyên nhỏ. Hãy dùng Tiếng Việt tự nhiên, trẻ trung, sâu sắc. Tránh dùng từ ngữ sáo rỗng. Trả về dưới định dạng text dễ đọc, ngắn gọn và cuốn.`;

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

export async function getRandomDecision(type: "food" | "activity") {
  try {
    await connectDB();
    const items = await DeciderItem.find({ type });
    if (items.length === 0) {
      // Seed some default data if empty
      const defaultFoods = ["Phở Gà", "Bò Né", "Cơm Tấm", "Sushi", "Bún Đậu Mắm Tôm", "Bánh Mì Huynh Hoa", "Salad Ức Gà (healthy xíu)", "Lẩu Thái"];
      const defaultActivities = ["Chạy bộ đón gió", "Cày nốt series Netflix", "Ngủ nướng", "Đi dạo chill chill lúc ráng chiều", "Nghe trọn một album của Lana Del Rey", "Đọc vài trang sách mỏ hỗn"];
      
      const toInsert = defaultFoods.map(f => ({ name: f, type: "food" }))
        .concat(defaultActivities.map(a => ({ name: a, type: "activity" })));
      
      await DeciderItem.insertMany(toInsert);
      
      const newItems = await DeciderItem.find({ type });
      const randomIndex = Math.floor(Math.random() * newItems.length);
      return { success: true, result: newItems[randomIndex].name };
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    return { success: true, result: items[randomIndex].name };
  } catch (error: any) {
    console.error("Random Decision Error:", error);
    return { success: false, error: "Không thể kết nối với The Decider. 😢" };
  }
}
