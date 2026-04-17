import mongoose from "mongoose";

const HoroscopeLogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birthdate: { type: String, required: true },
    result: { type: String, required: true },
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

export const HoroscopeLog = mongoose.models.HoroscopeLog || mongoose.model("HoroscopeLog", HoroscopeLogSchema);
export const RateLimit = mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);
export const DeciderItem = mongoose.models.DeciderItem || mongoose.model("DeciderItem", DeciderItemSchema);
