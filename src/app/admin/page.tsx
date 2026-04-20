"use client";

import { useState } from "react";
import { Lock, ShieldCheck, RefreshCw, Activity, Music, Dices, Stars, Globe } from "lucide-react";
import { fetchDashboard } from "./actions";
import { motion, AnimatePresence } from "framer-motion";

type Log = {
  _id: string;
  category: string;
  device?: string;
  sessionId?: string;
  ip?: string;
  timestamp: string;
  page?: string;
  mood?: string;
  song?: string;
  artist?: string;
  deciderItem?: string;
  deciderType?: string;
  vote?: string;
  userName?: string;
  birthdate?: string;
  horoscopeResult?: string;
};

type Stats = {
  totalVisits: number;
  totalCosmic: number;
  topMood: string;
  topFood: string;
  totalLogs: number;
};

const CATEGORY_MAP: Record<string, { label: string; icon: string; color: string }> = {
  page_visit:   { label: "Truy cập",     icon: "🌐",  color: "text-primary" },
  music:        { label: "Chọn nhạc",    icon: "🎵",  color: "text-primary" },
  decider:      { label: "Tung xúc xắc", icon: "🎲",  color: "text-foreground" },
  decider_vote: { label: "Vote món",     icon: "👍",  color: "text-accent" },
  cosmic:       { label: "Tử vi AI",     icon: "✨",  color: "text-primary" },
};

const PAGE_MAP: Record<string, string> = {
  home: "🏠 Trang chủ",
  stream: "🎵 Dòng cảm xúc",
  decider: "🎲 Trạm quyết định",
  cosmic: "✨ Cửa sổ vũ trụ",
};

const MOOD_EMOJI: Record<string, string> = {
  buồn: "🌧️", vui: "☀️", "thư giãn": "🍃", "năng lượng": "⚡", "cô đơn": "🌙",
};

function getDetail(log: Log): string {
  switch (log.category) {
    case "page_visit":
      return PAGE_MAP[log.page ?? ""] ?? log.page ?? "—";
    case "music": {
      const emoji = MOOD_EMOJI[log.mood ?? ""] ?? "";
      const mood = log.mood ?? "—";
      const song = log.song ?? "—";
      const artist = log.artist ?? "—";
      return `${emoji} ${mood} → ${song} (${artist})`;
    }
    case "decider":
      return `${log.deciderType === "food" ? "🍜 Ăn" : "🎯 Làm"}: ${log.deciderItem ?? "—"}`;
    case "decider_vote":
      return `${log.vote === "like" ? "👍 Thích" : "👎 Ngán"} ${log.deciderType === "food" ? "món" : "việc"} ${log.deciderItem ?? "—"}`;
    case "cosmic": {
      const preview = (log.horoscopeResult ?? "").slice(0, 60);
      return `${log.userName ?? "—"} (${log.birthdate ?? "—"})${preview ? ` · ${preview}...` : ""}`;
    }
    default:
      return "—";
  }
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (pwd: string) => {
    const res = await fetchDashboard(pwd);
    if (res.success) {
      setLogs(res.logs as Log[]);
      setStats(res.stats as Stats);
      return true;
    }
    setError(res.error ?? "Lỗi không xác định");
    return false;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const ok = await loadData(password);
    if (ok) setIsAuthenticated(true);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(password);
    setRefreshing(false);
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "medium" });

  // ── Login Screen ──────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <form onSubmit={handleLogin} className="glass-card p-8 rounded-3xl w-full max-w-sm flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
            <Lock size={32} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold text-foreground">Trung tâm điều hành</h1>
            <p className="text-foreground/50 text-sm mt-1">Tín hiệu từ vũ trụ</p>
          </div>
          <div className="w-full">
            <input type="password" placeholder="Mật khẩu bí mật..." value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/30 border border-white/50 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-center tracking-widest transition-all shadow-sm"
            />
            {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
          </div>
          <button type="submit" disabled={loading || !password}
            className="w-full bg-primary hover:bg-primary-glow text-white py-3 rounded-2xl transition-all disabled:opacity-50 font-medium shadow-sm">
            {loading ? "Đang xác thực..." : "Vào trung tâm"}
          </button>
        </form>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <ShieldCheck size={28} className="text-primary" />
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Trung tâm điều hành</h1>
              <p className="text-foreground/50 text-xs mt-0.5">Tín hiệu từ vũ trụ · Newest First</p>
            </div>
          </div>
          <button onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-2 glass border border-white/40 hover:border-white/70 text-foreground/70 hover:text-foreground px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm">
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>

        {/* Summary Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Tổng lượt vào", value: stats.totalVisits, icon: <Globe size={18} />, sub: "page visits" },
              { label: "Tử vi AI", value: stats.totalCosmic, icon: <Stars size={18} />, sub: "cosmic requests" },
              { label: "Vibe phổ biến", value: stats.topMood, icon: <Music size={18} />, sub: "tâm trạng nhiều nhất" },
              { label: "Món được chọn", value: stats.topFood, icon: <Dices size={18} />, sub: "top decider" },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-5 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  {s.icon} <span className="text-foreground/60 text-xs">{s.label}</span>
                </div>
                <p className="text-2xl font-serif font-bold text-foreground leading-tight">{s.value}</p>
                <p className="text-foreground/40 text-xs">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Activity Table */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <h2 className="font-serif font-bold text-foreground">Nhật ký hoạt động</h2>
            </div>
            <span className="text-xs text-foreground/40 font-medium">{logs.length} bản ghi gần nhất</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-foreground/40 uppercase tracking-widest border-b border-white/15">
                  <th className="px-5 py-3 font-medium">Thời gian</th>
                  <th className="px-5 py-3 font-medium">Thiết bị</th>
                  <th className="px-5 py-3 font-medium">Session</th>
                  <th className="px-5 py-3 font-medium">Hoạt động</th>
                  <th className="px-5 py-3 font-medium">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {logs.map((log, idx) => {
                    const cat = CATEGORY_MAP[log.category] ?? { label: log.category, icon: "•", color: "text-foreground" };
                    return (
                      <motion.tr key={log._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.01 }}
                        className="border-b border-white/10 hover:bg-white/20 transition-colors text-sm"
                      >
                        <td className="px-5 py-3 text-foreground/50 whitespace-nowrap font-mono text-xs">
                          {formatTime(log.timestamp)}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${log.device === "mobile" ? "bg-accent/20 text-foreground" : "bg-primary/20 text-primary"}`}>
                            {log.device === "mobile" ? "📱 Mobile" : "🖥 Desktop"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-foreground/40 font-mono text-xs">
                          {(log.sessionId ?? "").slice(0, 8) || "—"}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`flex items-center gap-1.5 font-medium ${cat.color}`}>
                            <span>{cat.icon}</span> {cat.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-foreground/70 max-w-xs">
                          <div className="truncate hover:whitespace-normal cursor-default" title={getDetail(log)}>
                            {getDetail(log)}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-foreground/40">
                      <p className="text-4xl mb-3">🌙</p>
                      <p>Vũ trụ đang yên tĩnh. Chưa có tín hiệu nào.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
