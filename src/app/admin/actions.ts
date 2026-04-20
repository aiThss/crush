"use server";

import dbConnect from "@/lib/mongodb";
import { ActivityLog } from "@/lib/models";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function checkPwd(password: string) {
  if (password !== ADMIN_PASSWORD) throw new Error("Sai mật khẩu rồi bạn ơi 🌙");
}

// ─── Frame 1: System Overview ─────────────────────────────────────────────────
export async function fetchSystemFrame(password: string) {
  try {
    checkPwd(password);
    await dbConnect();

    const [totalVisits, totalSessions, deviceAgg, logs] = await Promise.all([
      ActivityLog.countDocuments({ category: "page_visit" }),
      ActivityLog.distinct("sessionId"),
      ActivityLog.aggregate([
        { $match: { device: { $in: ["mobile", "desktop"] } } },
        { $group: { _id: "$device", count: { $sum: 1 } } },
      ]),
      ActivityLog.find({ category: "page_visit" })
        .sort({ timestamp: -1 }).limit(100).lean(),
    ]);

    const deviceMap: Record<string, number> = { mobile: 0, desktop: 0 };
    for (const d of deviceAgg) deviceMap[d._id as string] = d.count;

    return {
      success: true,
      stats: {
        totalVisits,
        uniqueSessions: totalSessions.length,
        mobileCount: deviceMap.mobile,
        desktopCount: deviceMap.desktop,
      },
      logs: JSON.parse(JSON.stringify(logs)),
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─── Frame 2: Decider Management ─────────────────────────────────────────────
export async function fetchDeciderFrame(password: string) {
  try {
    checkPwd(password);
    await dbConnect();

    const [logs, topFoodsAgg, topActivitiesAgg, likeAgg, dislikeAgg] = await Promise.all([
      ActivityLog.find({ category: { $in: ["decider", "decider_vote"] } })
        .sort({ timestamp: -1 }).limit(200).lean(),
      ActivityLog.aggregate([
        { $match: { category: "decider", deciderType: "food" } },
        { $group: { _id: "$deciderItem", count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 10 },
      ]),
      ActivityLog.aggregate([
        { $match: { category: "decider", deciderType: "activity" } },
        { $group: { _id: "$deciderItem", count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 5 },
      ]),
      ActivityLog.countDocuments({ category: "decider_vote", vote: "like" }),
      ActivityLog.countDocuments({ category: "decider_vote", vote: "dislike" }),
    ]);

    return {
      success: true,
      stats: { likeCount: likeAgg, dislikeCount: dislikeAgg },
      topFoods: topFoodsAgg,
      topActivities: topActivitiesAgg,
      logs: JSON.parse(JSON.stringify(logs)),
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─── Frame 3: Cosmic / AI Logs ────────────────────────────────────────────────
export async function fetchCosmicFrame(password: string) {
  try {
    checkPwd(password);
    await dbConnect();

    const [logs, total] = await Promise.all([
      ActivityLog.find({ category: "cosmic" })
        .sort({ timestamp: -1 }).limit(100).lean(),
      ActivityLog.countDocuments({ category: "cosmic" }),
    ]);

    return {
      success: true,
      stats: { total },
      logs: JSON.parse(JSON.stringify(logs)),
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─── Pin/Unpin cosmic log ─────────────────────────────────────────────────────
// We store pins in localStorage on client (no extra DB field needed)

// ─── Auth check ───────────────────────────────────────────────────────────────
export async function verifyPassword(password: string) {
  if (password !== ADMIN_PASSWORD) return { success: false, error: "Sai mật khẩu rồi bạn ơi 🌙" };
  return { success: true };
}
