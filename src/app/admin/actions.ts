"use server";

import { headers } from "next/headers";
import dbConnect from "@/lib/mongodb";
import { HoroscopeLog, AccessLog, MoodLog, DeciderFeedback } from "@/lib/models";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function fetchAdminData(password: string) {
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: "Sai mật khẩu rồi bạn ơi 🌙" };
  }

  try {
    await dbConnect();

    const [horoscopeLogs, accessLogs, moodLogs, deciderFeedbacks] = await Promise.all([
      HoroscopeLog.find().sort({ timestamp: -1 }).limit(100).lean(),
      AccessLog.find().sort({ timestamp: -1 }).limit(200).lean(),
      MoodLog.find().sort({ timestamp: -1 }).limit(100).lean(),
      DeciderFeedback.find().sort({ timestamp: -1 }).limit(100).lean(),
    ]);

    return {
      success: true,
      horoscopeLogs: JSON.parse(JSON.stringify(horoscopeLogs)),
      accessLogs: JSON.parse(JSON.stringify(accessLogs)),
      moodLogs: JSON.parse(JSON.stringify(moodLogs)),
      deciderFeedbacks: JSON.parse(JSON.stringify(deciderFeedbacks)),
    };
  } catch (e) {
    return { success: false, error: "Lỗi kết nối cơ sở dữ liệu." };
  }
}
