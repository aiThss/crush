"use server";

import dbConnect from "@/lib/mongodb";
import { ActivityLog, FoodItem } from "@/lib/models";
import { FOODS } from "@/data/foods"; // used for seeding

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function checkAuth(password: string) {
  if (password !== ADMIN_PASSWORD) throw new Error("Sai mật khẩu");
}

export async function fetchDashboard(password: string) {
  try {
    checkAuth(password);
    await dbConnect();

    const [logs, totalVisits, totalCosmic, totalFoods] = await Promise.all([
      ActivityLog.find().sort({ timestamp: -1 }).limit(300).lean(),
      ActivityLog.countDocuments({ category: "page_visit" }),
      ActivityLog.countDocuments({ category: "cosmic" }),
      FoodItem.countDocuments(),
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
        totalFoods,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Lỗi kết nối database." };
  }
}

// ─── Foods CRUD ─────────────────────────────────────────────────────────────

export async function getFoodsDB() {
  try {
    await dbConnect();
    let foods = await FoodItem.find().lean();
    
    // Auto-seed if empty
    if (foods.length === 0) {
      await FoodItem.insertMany(FOODS);
      foods = await FoodItem.find().lean();
    }
    return { success: true, data: JSON.parse(JSON.stringify(foods)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addFoodDB(password: string, data: any) {
  try {
    checkAuth(password);
    await dbConnect();
    const newFood = await FoodItem.create(data);
    return { success: true, data: JSON.parse(JSON.stringify(newFood)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateFoodDB(password: string, id: string, data: any) {
  try {
    checkAuth(password);
    await dbConnect();
    const updated = await FoodItem.findByIdAndUpdate(id, data, { new: true }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFoodDB(password: string, id: string) {
  try {
    checkAuth(password);
    await dbConnect();
    await FoodItem.findByIdAndDelete(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function importFoodsDB(password: string, jsonString: string) {
  try {
    checkAuth(password);
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) throw new Error("JSON phải là một mảng []");
    
    await dbConnect();
    await FoodItem.insertMany(parsed);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── Cosmic Log Pinning ─────────────────────────────────────────────────────

export async function togglePinLog(password: string, logId: string, currentPinStatus: boolean) {
  try {
    checkAuth(password);
    await dbConnect();
    await ActivityLog.findByIdAndUpdate(logId, { pinned: !currentPinStatus });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
