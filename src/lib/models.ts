import mongoose from "mongoose";

// ─── Horoscope (Cửa Sổ Vũ Trụ) ───────────────────────────────────────────────
const HoroscopeLogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birthdate: { type: String, required: true },
    result: { type: String, required: true },
    ip: { type: String, default: "unknown" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const RateLimitSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    count: { type: Number, default: 1 },
    windowStart: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ─── Decider Items (random suggestions pool) ──────────────────────────────────
const DeciderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["food", "activity"] },
  },
  { timestamps: true }
);

// ─── Access Log (ai truy cập, khi nào) ────────────────────────────────────────
const AccessLogSchema = new mongoose.Schema(
  {
    page: { type: String, required: true }, // "home" | "stream" | "decider" | "cosmic"
    userAgent: { type: String, default: "" },
    ip: { type: String, default: "unknown" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ─── Mood Log (tâm trạng chọn nhạc) ───────────────────────────────────────────
const MoodLogSchema = new mongoose.Schema(
  {
    mood: { type: String, required: true },          // "buồn" | "vui" | ...
    songSuggested: { type: String, required: true }, // tên bài hát
    artist: { type: String, required: true },
    ip: { type: String, default: "unknown" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ─── Decider Feedback (vote món ăn/hoạt động) ─────────────────────────────────
const DeciderFeedbackSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },          // tên món ăn / hoạt động
    type: { type: String, required: true },          // "food" | "activity"
    vote: { type: String, required: true },          // "like" | "dislike"
    ip: { type: String, default: "unknown" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const HoroscopeLog = mongoose.models.HoroscopeLog || mongoose.model("HoroscopeLog", HoroscopeLogSchema);
export const RateLimit = mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);
export const DeciderItem = mongoose.models.DeciderItem || mongoose.model("DeciderItem", DeciderItemSchema);
export const AccessLog = mongoose.models.AccessLog || mongoose.model("AccessLog", AccessLogSchema);
export const MoodLog = mongoose.models.MoodLog || mongoose.model("MoodLog", MoodLogSchema);
export const DeciderFeedback = mongoose.models.DeciderFeedback || mongoose.model("DeciderFeedback", DeciderFeedbackSchema);
