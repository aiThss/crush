"use server";

import connectDB from "@/lib/mongodb";
import { HoroscopeLog } from "@/lib/models";

export async function fetchAdminLogs(password: string) {
  if (password !== process.env.ADMIN_PASSWORD) {
    return { success: false, error: "Sai mật khẩu rồi bạn iu ơi!" };
  }

  try {
    await connectDB();
    const logs = await HoroscopeLog.find({}).sort({ timestamp: -1 }).limit(100).lean();
    
    // We need to parse MongoDB ObjectIds and Dates to standard types for Server Actions
    const serializedLogs = logs.map(l => ({
      _id: l._id.toString(),
      name: l.name,
      birthdate: l.birthdate,
      result: l.result,
      timestamp: (l.timestamp as Date).toISOString()
    }));
    
    return { success: true, logs: serializedLogs };
  } catch (error: any) {
    return { success: false, error: error.message || "Lỗi csdl" };
  }
}
