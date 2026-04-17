"use client";

import { useState } from "react";
import { Lock, ShieldCheck, Activity, Music, Dices, Stars } from "lucide-react";
import { fetchAdminData } from "./actions";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "access" | "mood" | "decider" | "horoscope";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<{
    horoscopeLogs: { _id: string; name: string; birthdate: string; result: string; ip: string; timestamp: string }[];
    accessLogs: { _id: string; page: string; userAgent: string; ip: string; timestamp: string }[];
    moodLogs: { _id: string; mood: string; songSuggested: string; artist: string; ip: string; timestamp: string }[];
    deciderFeedbacks: { _id: string; item: string; type: string; vote: string; ip: string; timestamp: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("access");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetchAdminData(password);
    if (res.success) {
      setIsAuthenticated(true);
      setData(res as typeof data);
    } else {
      setError(res.error!);
    }
    setLoading(false);
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "medium" });

  const moodEmoji: Record<string, string> = {
    "buồn": "🌧️", "vui": "☀️", "thư giãn": "🍃", "năng lượng": "⚡", "cô đơn": "🌙",
  };
  const pageLabel: Record<string, string> = {
    home: "🏠 Trang chủ", stream: "🎵 Dòng cảm xúc",
    decider: "🎲 Trạm quyết định", cosmic: "✨ Cửa sổ vũ trụ",
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <form onSubmit={handleLogin} className="glass-card p-8 rounded-3xl w-full max-w-sm flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Tín hiệu quản trị</h1>
          <div className="w-full">
            <input
              type="password"
              placeholder="Mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/30 border border-white/50 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-center tracking-widest transition-all shadow-sm"
            />
            {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-primary hover:bg-primary-glow text-white py-3 rounded-2xl transition-all disabled:opacity-50 font-medium shadow-sm"
          >
            {loading ? "Đang xác thực..." : "Vào trung tâm"}
          </button>
        </form>
      </div>
    );
  }

  if (!data) return null;

  const TABS: { key: Tab; label: string; icon: JSX.Element; count: number }[] = [
    { key: "access", label: "Nhật kí truy cập", icon: <Activity size={16} />, count: data.accessLogs.length },
    { key: "mood", label: "Tâm trạng & Nhạc", icon: <Music size={16} />, count: data.moodLogs.length },
    { key: "decider", label: "Vote Decider", icon: <Dices size={16} />, count: data.deciderFeedbacks.length },
    { key: "horoscope", label: "Tử vi AI", icon: <Stars size={16} />, count: data.horoscopeLogs.length },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck size={28} className="text-primary" />
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Trung tâm điều hành</h1>
            <p className="text-foreground/60 text-sm">Tín hiệu từ vũ trụ · Admin</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`glass-card rounded-2xl p-4 flex flex-col gap-2 text-left transition-all ${activeTab === t.key ? "border-primary/60 ring-1 ring-primary/30" : "hover:border-white/60"}`}
            >
              <div className="flex items-center gap-2 text-primary">{t.icon}<span className="text-xs font-medium text-foreground/60">{t.label}</span></div>
              <p className="text-3xl font-serif font-bold text-foreground">{t.count}</p>
            </button>
          ))}
        </div>

        {/* Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card rounded-3xl overflow-x-auto"
          >
            {/* Access Logs */}
            {activeTab === "access" && (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-foreground/50 uppercase tracking-widest border-b border-white/20">
                    <th className="p-4">Thời gian</th>
                    <th className="p-4">Trang</th>
                    <th className="p-4">IP</th>
                    <th className="p-4">Thiết bị</th>
                  </tr>
                </thead>
                <tbody>
                  {data.accessLogs.map((log) => (
                    <tr key={log._id} className="border-b border-white/10 hover:bg-white/20 transition-colors text-sm">
                      <td className="p-4 text-foreground/60 whitespace-nowrap">{formatTime(log.timestamp)}</td>
                      <td className="p-4 font-medium">{pageLabel[log.page] ?? log.page}</td>
                      <td className="p-4 text-foreground/60 font-mono text-xs">{log.ip}</td>
                      <td className="p-4 text-foreground/50 text-xs max-w-[200px] truncate" title={log.userAgent}>{log.userAgent}</td>
                    </tr>
                  ))}
                  {data.accessLogs.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-foreground/40">Chưa có lượt truy cập nào.</td></tr>}
                </tbody>
              </table>
            )}

            {/* Mood Logs */}
            {activeTab === "mood" && (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-foreground/50 uppercase tracking-widest border-b border-white/20">
                    <th className="p-4">Thời gian</th>
                    <th className="p-4">Tâm trạng</th>
                    <th className="p-4">Bài được gợi ý</th>
                    <th className="p-4">Nghệ sĩ</th>
                    <th className="p-4">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {data.moodLogs.map((log) => (
                    <tr key={log._id} className="border-b border-white/10 hover:bg-white/20 transition-colors text-sm">
                      <td className="p-4 text-foreground/60 whitespace-nowrap">{formatTime(log.timestamp)}</td>
                      <td className="p-4 font-medium">{moodEmoji[log.mood] ?? ""} {log.mood}</td>
                      <td className="p-4">{log.songSuggested}</td>
                      <td className="p-4 text-foreground/70">{log.artist}</td>
                      <td className="p-4 text-foreground/50 font-mono text-xs">{log.ip}</td>
                    </tr>
                  ))}
                  {data.moodLogs.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-foreground/40">Chưa có ai chọn tâm trạng.</td></tr>}
                </tbody>
              </table>
            )}

            {/* Decider Feedbacks */}
            {activeTab === "decider" && (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-foreground/50 uppercase tracking-widest border-b border-white/20">
                    <th className="p-4">Thời gian</th>
                    <th className="p-4">Món / Hoạt động</th>
                    <th className="p-4">Loại</th>
                    <th className="p-4">Vote</th>
                    <th className="p-4">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {data.deciderFeedbacks.map((fb) => (
                    <tr key={fb._id} className="border-b border-white/10 hover:bg-white/20 transition-colors text-sm">
                      <td className="p-4 text-foreground/60 whitespace-nowrap">{formatTime(fb.timestamp)}</td>
                      <td className="p-4 font-medium">{fb.item}</td>
                      <td className="p-4 text-foreground/60">{fb.type === "food" ? "🍜 Ăn" : "🎯 Làm"}</td>
                      <td className="p-4">{fb.vote === "like" ? "👍 Thích" : "👎 Ngán"}</td>
                      <td className="p-4 text-foreground/50 font-mono text-xs">{fb.ip}</td>
                    </tr>
                  ))}
                  {data.deciderFeedbacks.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-foreground/40">Chưa có vote nào.</td></tr>}
                </tbody>
              </table>
            )}

            {/* Horoscope Logs */}
            {activeTab === "horoscope" && (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-foreground/50 uppercase tracking-widest border-b border-white/20">
                    <th className="p-4">Thời gian</th>
                    <th className="p-4">Tên</th>
                    <th className="p-4">Ngày sinh</th>
                    <th className="p-4">IP</th>
                    <th className="p-4">Kết quả AI</th>
                  </tr>
                </thead>
                <tbody>
                  {data.horoscopeLogs.map((log) => (
                    <tr key={log._id} className="border-b border-white/10 hover:bg-white/20 transition-colors text-sm">
                      <td className="p-4 text-foreground/60 whitespace-nowrap">{formatTime(log.timestamp)}</td>
                      <td className="p-4 font-medium">{log.name}</td>
                      <td className="p-4 text-foreground/70 whitespace-nowrap">{log.birthdate}</td>
                      <td className="p-4 text-foreground/50 font-mono text-xs">{log.ip}</td>
                      <td className="p-4 text-foreground/70 max-w-xs">
                        <div className="line-clamp-2 hover:line-clamp-none cursor-pointer transition-all">{log.result}</div>
                      </td>
                    </tr>
                  ))}
                  {data.horoscopeLogs.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-foreground/40">Chưa ai hỏi vũ trụ điều gì.</td></tr>}
                </tbody>
              </table>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
