"use server";

import { headers } from "next/headers";
import dbConnect from "@/lib/mongodb";
import { ActivityLog } from "@/lib/models";

type ActivityPayload = {
  category: "page_visit" | "music" | "decider" | "decider_vote" | "cosmic";
  device?: "mobile" | "desktop" | "unknown";
  sessionId?: string;
  page?: string;
  // Music
  mood?: string;
  song?: string;
  artist?: string;
  // Decider
  deciderItem?: string;
  deciderType?: string;
  vote?: string;
  // Cosmic
  userName?: string;
  birthdate?: string;
  horoscopeResult?: string;
};

export async function logActivity(payload: ActivityPayload) {
  try {
    await dbConnect();
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    // Rate-limit logging: max 1 activity_log per IP per second
    const oneSecAgo = new Date(Date.now() - 1000);
    const recentCount = await ActivityLog.countDocuments({ ip, timestamp: { $gt: oneSecAgo } });
    if (recentCount >= 5) return; // silent skip

    await ActivityLog.create({
      ip,
      timestamp: new Date(),
      ...payload,
    });
  } catch {
    // Silent fail – never block the UI
  }
}

// ─── Admin fetch ───────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function fetchDashboard(password: string) {
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: "Sai mật khẩu rồi bạn ơi 🌙" };
  }

  try {
    await dbConnect();

    const [logs, totalVisits, totalCosmic] = await Promise.all([
      ActivityLog.find().sort({ timestamp: -1 }).limit(300).lean(),
      ActivityLog.countDocuments({ category: "page_visit" }),
      ActivityLog.countDocuments({ category: "cosmic" }),
    ]);

    // Most selected mood
    const moodAgg = await ActivityLog.aggregate([
      { $match: { category: "music", mood: { $ne: null } } },
      { $group: { _id: "$mood", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const topMood = moodAgg[0] ? `${moodAgg[0]._id} (${moodAgg[0].count} lần)` : "Chưa có";

    // Most picked food
    const foodAgg = await ActivityLog.aggregate([
      { $match: { category: "decider", deciderType: "food" } },
      { $group: { _id: "$deciderItem", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const topFood = foodAgg[0] ? `${foodAgg[0]._id} (${foodAgg[0].count}x)` : "Chưa có";

    return {
      success: true,
      logs: JSON.parse(JSON.stringify(logs)),
      stats: {
        totalVisits,
        totalCosmic,
        topMood,
        topFood,
        totalLogs: logs.length,
      },
    };
  } catch {
    return { success: false, error: "Lỗi kết nối database." };
  }
}
