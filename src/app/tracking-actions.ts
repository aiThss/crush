"use server";

import { headers } from "next/headers";
import dbConnect from "@/lib/mongodb";
import { AccessLog, MoodLog, DeciderFeedback } from "@/lib/models";

// ─── Log truy cập trang ────────────────────────────────────────────────────────
export async function logAccess(page: string) {
  try {
    await dbConnect();
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const userAgent = headersList.get("user-agent") ?? "";
    await AccessLog.create({ page, ip, userAgent });
  } catch {
    // Silent fail – không nên block UI vì lỗi log
  }
}

// ─── Log tâm trạng chọn nhạc ──────────────────────────────────────────────────
export async function logMood(mood: string, songSuggested: string, artist: string) {
  try {
    await dbConnect();
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    await MoodLog.create({ mood, songSuggested, artist, ip });
  } catch {
    // Silent fail
  }
}

// ─── Ghi nhận vote cho Decider ─────────────────────────────────────────────────
export async function logDeciderVote(item: string, type: string, vote: "like" | "dislike") {
  try {
    await dbConnect();
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    await DeciderFeedback.create({ item, type, vote, ip });
  } catch {
    // Silent fail
  }
}
