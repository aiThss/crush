import mongoose from "mongoose";

// ─── Unified Activity Log ──────────────────────────────────────────────────────
const ActivityLogSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    // "page_visit" | "music" | "decider" | "cosmic" | "decider_vote"
    category: { type: String, required: true },
    device: { type: String, enum: ["mobile", "desktop", "unknown"], default: "unknown" },
    sessionId: { type: String, default: "" },
    ip: { type: String, default: "unknown" },

    // Page visit
    page: { type: String, default: null },

    // Music
    mood: { type: String, default: null },
    song: { type: String, default: null },
    artist: { type: String, default: null },

    // Decider
    deciderItem: { type: String, default: null },
    deciderType: { type: String, default: null }, // "food" | "activity"
    vote: { type: String, default: null },        // "like" | "dislike"

    // Cosmic Guide
    userName: { type: String, default: null },
    birthdate: { type: String, default: null },
    horoscopeResult: { type: String, default: null },
    
    // Admin toggles
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─── Legacy models (kept for backward compat) ─────────────────────────────────
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

const RateLimitSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    count: { type: Number, default: 1 },
    windowStart: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const DeciderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["food", "activity"] },
  },
  { timestamps: true }
);

const FoodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    region: { type: String, required: true, enum: ["bac", "trung", "nam"] },
    category: { type: String, required: true, enum: ["an-chinh", "an-vat"] },
    group: { type: String, required: true },
    desc: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ActivityLog =
  mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);

export const HoroscopeLog =
  mongoose.models.HoroscopeLog || mongoose.model("HoroscopeLog", HoroscopeLogSchema);

export const RateLimit =
  mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);

export const DeciderItem =
  mongoose.models.DeciderItem || mongoose.model("DeciderItem", DeciderItemSchema);

export const FoodItem =
  mongoose.models.FoodItem || mongoose.model("FoodItem", FoodItemSchema);
