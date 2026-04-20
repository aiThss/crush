"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lock, ShieldCheck, RefreshCw, Globe, Smartphone, Monitor,
  Dices, Stars, ThumbsUp, ThumbsDown, Pin, PinOff,
  Search, Download, Upload, ChevronRight, Activity, Sparkles,
} from "lucide-react";
import { verifyPassword, fetchSystemFrame, fetchDeciderFrame, fetchCosmicFrame } from "./actions";
import { motion, AnimatePresence } from "framer-motion";
import { FOODS } from "@/data/foods";

// ─── Types ────────────────────────────────────────────────────────────────────
type Log = {
  _id: string; category: string; device?: string; sessionId?: string; ip?: string;
  timestamp: string; page?: string; mood?: string; song?: string; artist?: string;
  deciderItem?: string; deciderType?: string; vote?: string;
  userName?: string; birthdate?: string; horoscopeResult?: string;
};

type Tab = "system" | "decider" | "cosmic";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PAGE_MAP: Record<string, string> = {
  home: "🏠 Trang chủ", stream: "🎵 Dòng cảm xúc",
  decider: "🎲 Trạm quyết định", cosmic: "✨ Cửa sổ vũ trụ",
};
const MOOD_EMOJI: Record<string, string> = {
  buồn: "🌧️", vui: "☀️", "thư giãn": "🍃", "năng lượng": "⚡", "cô đơn": "🌙",
};
const fmt = (ts: string) =>
  new Date(ts).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "medium" });

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = "text-primary" }: {
  icon: React.ReactNode; label: string; value: string | number; sub: string; color?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-2">
      <div className={`flex items-center gap-2 text-sm font-medium ${color}`}>
        {icon} <span className="text-foreground/55 text-xs">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground font-mono leading-tight">{value}</p>
      <p className="text-foreground/40 text-xs">{sub}</p>
    </motion.div>
  );
}

function TableWrap({ children, headers }: { children: React.ReactNode; headers: string[] }) {
  return (
    <div className="overflow-x-auto max-h-[480px] overflow-y-auto rounded-2xl">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <tr className="text-xs text-foreground/40 uppercase tracking-widest border-b border-white/15">
            {headers.map(h => <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? "Tìm kiếm..."}
        className="w-full pl-9 pr-4 py-2 bg-white/20 border border-white/30 rounded-full text-sm focus:outline-none focus:border-primary transition-all" />
    </div>
  );
}

// ─── Frame 1: System ─────────────────────────────────────────────────────────
function SystemFrame({ password }: { password: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchSystemFrame(password);
    if (res.success) setData(res);
    setLoading(false);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const filtered = (data?.logs ?? []).filter((l: Log) =>
    !search || PAGE_MAP[l.page ?? ""]?.toLowerCase().includes(search.toLowerCase()) ||
    l.sessionId?.includes(search) || l.ip?.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      {data?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Globe size={16} />} label="Tổng lượt truy cập" value={data.stats.totalVisits} sub="page visits" />
          <StatCard icon={<Activity size={16} />} label="Sessions unique" value={data.stats.uniqueSessions} sub="device sessions" />
          <StatCard icon={<Smartphone size={16} />} label="Mobile" value={data.stats.mobileCount} sub="điện thoại" color="text-accent" />
          <StatCard icon={<Monitor size={16} />} label="Desktop" value={data.stats.desktopCount} sub="máy tính" />
        </div>
      )}

      {/* Device bar */}
      {data?.stats && (data.stats.mobileCount + data.stats.desktopCount) > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs text-foreground/45 uppercase tracking-widest font-medium mb-3">Tỉ lệ thiết bị</p>
          <div className="flex rounded-full overflow-hidden h-3">
            <div className="bg-accent/60 transition-all"
              style={{ width: `${(data.stats.mobileCount / (data.stats.mobileCount + data.stats.desktopCount)) * 100}%` }} />
            <div className="bg-primary/60 flex-1" />
          </div>
          <div className="flex gap-4 mt-2.5 text-xs text-foreground/50">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent/60 inline-block" />📱 Mobile</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary/60 inline-block" />🖥 Desktop</span>
          </div>
        </div>
      )}

      {/* Access log */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/15 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <Globe size={15} className="text-primary" />
            <h3 className="font-bold text-foreground">Nhật ký truy cập</h3>
            <span className="text-xs text-foreground/40">{filtered.length} bản ghi</span>
          </div>
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo page, session..." />
        </div>
        {loading ? (
          <div className="py-16 text-center text-foreground/40"><p className="animate-pulse">Đang tải...</p></div>
        ) : (
          <TableWrap headers={["Thời gian", "Thiết bị", "Session ID", "Trang", "IP"]}>
            {filtered.map((log: Log) => (
              <tr key={log._id} className="border-b border-white/8 hover:bg-white/15 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-foreground/50 whitespace-nowrap">{fmt(log.timestamp)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${log.device === "mobile" ? "bg-accent/20 text-accent" : "bg-primary/15 text-primary"}`}>
                    {log.device === "mobile" ? "📱" : "🖥"} {log.device ?? "?"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-foreground/40">{(log.sessionId ?? "").slice(0, 10) || "—"}</td>
                <td className="px-4 py-3 text-foreground/70">{PAGE_MAP[log.page ?? ""] ?? log.page ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-foreground/30">{log.ip ?? "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="py-12 text-center text-foreground/30">🌙 Chưa có dữ liệu</td></tr>
            )}
          </TableWrap>
        )}
      </div>
    </div>
  );
}

// ─── Frame 2: Decider ─────────────────────────────────────────────────────────
function DeciderFrame({ password }: { password: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showExport, setShowExport] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchDeciderFrame(password);
    if (res.success) setData(res);
    setLoading(false);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const filtered = (data?.logs ?? []).filter((l: Log) =>
    !search || (l.deciderItem ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const json = JSON.stringify(FOODS, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "vibehub-foods.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        JSON.parse(ev.target?.result as string);
        alert("✅ File hợp lệ! Để áp dụng, hãy replace nội dung vào src/data/foods.ts và push lên GitHub.");
      } catch { alert("❌ File JSON không hợp lệ."); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      {data?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Dices size={16} />} label="Tổng lượt quay" value={(data.logs ?? []).filter((l: Log) => l.category === "decider").length} sub="food + activity" />
          <StatCard icon={<ThumbsUp size={16} />} label="Đồng ý" value={data.stats.likeCount} sub="lượt thích" color="text-green-400" />
          <StatCard icon={<ThumbsDown size={16} />} label="Đổi đi!" value={data.stats.dislikeCount} sub="lượt từ chối" color="text-accent" />
          <StatCard icon={<Stars size={16} />} label="Top món" value={data.topFoods?.[0]?._id ?? "—"} sub={`${data.topFoods?.[0]?.count ?? 0} lần`} />
        </div>
      )}

      {/* Top Foods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs text-foreground/45 uppercase tracking-widest font-medium mb-4">🍜 Top 10 món được chọn</p>
          <div className="space-y-2">
            {(data?.topFoods ?? []).map((f: any, i: number) => (
              <div key={f._id} className="flex items-center gap-3">
                <span className="text-xs text-foreground/30 font-mono w-4">{i + 1}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/50 rounded-full transition-all"
                    style={{ width: `${(f.count / (data.topFoods[0]?.count || 1)) * 100}%` }} />
                </div>
                <span className="text-sm text-foreground/70 flex-shrink-0">{f._id}</span>
                <span className="text-xs text-foreground/40 font-mono">{f.count}x</span>
              </div>
            ))}
            {!data?.topFoods?.length && <p className="text-foreground/30 text-sm">Chưa có dữ liệu</p>}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs text-foreground/45 uppercase tracking-widest font-medium mb-4">🎯 Top hoạt động</p>
          <div className="space-y-2">
            {(data?.topActivities ?? []).map((f: any, i: number) => (
              <div key={f._id} className="flex items-center gap-3">
                <span className="text-xs text-foreground/30 font-mono w-4">{i + 1}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent/50 rounded-full transition-all"
                    style={{ width: `${(f.count / (data.topActivities[0]?.count || 1)) * 100}%` }} />
                </div>
                <span className="text-sm text-foreground/70 flex-shrink-0 truncate max-w-[140px]">{f._id}</span>
                <span className="text-xs text-foreground/40 font-mono">{f.count}x</span>
              </div>
            ))}
            {!data?.topActivities?.length && <p className="text-foreground/30 text-sm">Chưa có dữ liệu</p>}
          </div>
        </div>
      </div>

      {/* Import / Export */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-foreground/45 uppercase tracking-widest font-medium">Quản lý dữ liệu món ăn</p>
            <p className="text-sm text-foreground/60 mt-1">{FOODS.length} món đang hoạt động · Static JSON từ <code className="text-xs bg-white/20 px-1 rounded">src/data/foods.ts</code></p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExport}
              className="flex items-center gap-1.5 glass border border-white/30 hover:border-white/60 px-4 py-2 rounded-full text-sm font-medium transition-all">
              <Download size={13} /> Export JSON
            </button>
            <label className="flex items-center gap-1.5 glass border border-white/30 hover:border-white/60 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer">
              <Upload size={13} /> Import JSON
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Food table preview */}
        <div className="mt-4 overflow-x-auto max-h-[320px] overflow-y-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-background/90 backdrop-blur-sm">
              <tr className="text-foreground/40 uppercase tracking-widest border-b border-white/10">
                <th className="px-3 py-2">Tên món</th>
                <th className="px-3 py-2">Vùng</th>
                <th className="px-3 py-2">Nhóm</th>
                <th className="px-3 py-2">Loại</th>
              </tr>
            </thead>
            <tbody>
              {FOODS.map((f, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/10">
                  <td className="px-3 py-2 text-foreground/80 font-medium">{f.name}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${f.region === "bac" ? "bg-green-500/20 text-green-300" : f.region === "trung" ? "bg-blue-500/20 text-blue-300" : "bg-yellow-500/20 text-yellow-300"}`}>
                      {f.region === "bac" ? "🌿 Bắc" : f.region === "trung" ? "🌊 Trung" : "🌴 Nam"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-foreground/50">{f.group}</td>
                  <td className="px-3 py-2 text-foreground/50">{f.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roll log */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/15 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <Dices size={15} className="text-primary" />
            <h3 className="font-bold text-foreground">Nhật ký quay xúc xắc</h3>
            <span className="text-xs text-foreground/40">{filtered.length} bản ghi</span>
          </div>
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm món ăn / hoạt động..." />
        </div>
        {loading ? (
          <div className="py-12 text-center text-foreground/40 animate-pulse">Đang tải...</div>
        ) : (
          <TableWrap headers={["Thời gian", "Loại", "Kết quả", "Vote", "Thiết bị"]}>
            {filtered.map((log: Log) => (
              <tr key={log._id} className="border-b border-white/8 hover:bg-white/15 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-foreground/50 whitespace-nowrap">{fmt(log.timestamp)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs">{log.category === "decider" ? (log.deciderType === "food" ? "🍜 Ăn" : "🎯 Làm") : "Vote"}</span>
                </td>
                <td className="px-4 py-3 text-foreground/80 font-medium">{log.deciderItem ?? "—"}</td>
                <td className="px-4 py-3">
                  {log.vote === "like" ? <span className="text-green-400 text-xs">👍 Thích</span>
                    : log.vote === "dislike" ? <span className="text-accent text-xs">👎 Ngán</span>
                    : <span className="text-foreground/30 text-xs">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs rounded-full px-2 py-0.5 ${log.device === "mobile" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>
                    {log.device === "mobile" ? "📱" : "🖥"} {log.device}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="py-12 text-center text-foreground/30">🌙 Chưa có dữ liệu</td></tr>
            )}
          </TableWrap>
        )}
      </div>
    </div>
  );
}

// ─── Frame 3: Cosmic ──────────────────────────────────────────────────────────
function CosmicFrame({ password }: { password: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pins, setPins] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("admin_pinned_cosmic") ?? "[]");
    }
    return [];
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchCosmicFrame(password);
    if (res.success) setData(res);
    setLoading(false);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const togglePin = (id: string) => {
    setPins(prev => {
      const next = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      localStorage.setItem("admin_pinned_cosmic", JSON.stringify(next));
      return next;
    });
  };

  const logs: Log[] = data?.logs ?? [];
  const pinnedLogs = logs.filter(l => pins.includes(l._id));
  const filtered = logs.filter((l: Log) =>
    !search ||
    (l.userName ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (l.horoscopeResult ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      {data?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard icon={<Sparkles size={16} />} label="Tổng câu hỏi vũ trụ" value={data.stats.total} sub="cosmic requests" color="text-primary" />
          <StatCard icon={<Pin size={16} />} label="Đã ghim" value={pins.length} sub="quẻ độc lạ được lưu" color="text-yellow-400" />
        </div>
      )}

      {/* Pinned section */}
      {pinnedLogs.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-yellow-400/20">
          <p className="text-xs text-yellow-400/70 uppercase tracking-widest font-medium mb-4">📌 Quẻ đã ghim ({pinnedLogs.length})</p>
          <div className="space-y-3">
            {pinnedLogs.map(log => (
              <div key={log._id} className="bg-yellow-400/5 border border-yellow-400/15 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground/80">
                      {log.userName ?? "Ẩn danh"} · {log.birthdate ?? "—"}
                    </p>
                    <p className="text-xs text-foreground/40 mt-0.5">{fmt(log.timestamp)}</p>
                  </div>
                  <button onClick={() => togglePin(log._id)} className="text-yellow-400 hover:text-yellow-300 transition-colors flex-shrink-0">
                    <PinOff size={14} />
                  </button>
                </div>
                <p className="text-sm text-foreground/70 mt-3 leading-relaxed whitespace-pre-wrap">{log.horoscopeResult}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All cosmic logs */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/15 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-primary" />
            <h3 className="font-bold text-foreground">Nhật ký luận quẻ</h3>
            <span className="text-xs text-foreground/40">{filtered.length} bản ghi</span>
          </div>
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tên, nội dung quẻ..." />
        </div>

        {loading ? (
          <div className="py-12 text-center text-foreground/40 animate-pulse">Đang tải...</div>
        ) : (
          <div className="divide-y divide-white/8 max-h-[560px] overflow-y-auto">
            {filtered.map((log: Log) => {
              const isPinned = pins.includes(log._id);
              const isExpanded = expanded === log._id;
              return (
                <div key={log._id} className={`p-5 hover:bg-white/10 transition-colors ${isPinned ? "bg-yellow-400/3" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">
                          {log.userName ?? "Ẩn danh"}
                        </span>
                        {log.birthdate && (
                          <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full text-foreground/50">
                            🎂 {log.birthdate}
                          </span>
                        )}
                        <span className={`text-xs rounded-full px-2 py-0.5 ${log.device === "mobile" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>
                          {log.device === "mobile" ? "📱" : "🖥"} {log.device}
                        </span>
                        <span className="text-xs text-foreground/35 font-mono">{fmt(log.timestamp)}</span>
                      </div>

                      {/* AI response */}
                      <div className="mt-3">
                        <p className={`text-sm text-foreground/70 leading-relaxed ${!isExpanded ? "line-clamp-3" : "whitespace-pre-wrap"}`}>
                          {log.horoscopeResult ?? "—"}
                        </p>
                        {(log.horoscopeResult ?? "").length > 200 && (
                          <button onClick={() => setExpanded(isExpanded ? null : log._id)}
                            className="text-xs text-primary hover:text-primary/70 mt-1 font-medium flex items-center gap-1 transition-colors">
                            {isExpanded ? "Thu lại" : "Xem đầy đủ"}
                            <ChevronRight size={12} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Pin button */}
                    <button onClick={() => togglePin(log._id)}
                      title={isPinned ? "Bỏ ghim" : "Ghim quẻ này"}
                      className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${isPinned ? "text-yellow-400 bg-yellow-400/10" : "text-foreground/25 hover:text-yellow-400 hover:bg-yellow-400/10"}`}>
                      <Pin size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-16 text-center text-foreground/30">
                <p className="text-3xl mb-3">🌙</p>
                <p>Vũ trụ chưa nhận được thắc mắc nào.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
const TABS: { key: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: "system",  label: "Hệ thống",      icon: <Globe size={16} />,    desc: "Traffic & Thiết bị" },
  { key: "decider", label: "Trạm Quyết Định", icon: <Dices size={16} />,  desc: "Món ăn & Vote" },
  { key: "cosmic",  label: "Cửa Sổ Vũ Trụ", icon: <Sparkles size={16} />, desc: "AI & Tử vi" },
];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("system");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const res = await verifyPassword(password);
    if (res.success) setIsAuthenticated(true);
    else setError(res.error ?? "Lỗi xác thực");
    setLoading(false);
  };

  // ── Login ──────────────────────────────────────────────────────────────────
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
              className="w-full bg-white/30 border border-white/50 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-center tracking-widest transition-all shadow-sm" />
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

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Top header */}
      <div className="border-b border-white/10 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} className="text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground leading-none">Trung tâm điều hành</h1>
              <p className="text-foreground/40 text-xs mt-0.5">Tín hiệu từ vũ trụ</p>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)}
            className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors">
            Đăng xuất
          </button>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1 pb-0">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/50 hover:text-foreground/80 hover:border-white/30"
              }`}>
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="hidden md:inline text-xs opacity-60">· {tab.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Frame content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            {activeTab === "system"  && <SystemFrame  password={password} />}
            {activeTab === "decider" && <DeciderFrame password={password} />}
            {activeTab === "cosmic"  && <CosmicFrame  password={password} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
