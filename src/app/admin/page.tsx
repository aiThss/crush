"use client";

import { useState, useMemo } from "react";
import { Lock, ShieldCheck, RefreshCw, Activity, Music, Dices, Stars, Globe, LayoutGrid, Database, Upload, Trash2, Edit2, Plus, Pin, PinOff } from "lucide-react";
import { fetchDashboard, getFoodsDB, addFoodDB, updateFoodDB, deleteFoodDB, importFoodsDB, togglePinLog } from "./actions";
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
  pinned?: boolean;
};

type Stats = {
  totalVisits: number;
  totalCosmic: number;
  topMood: string;
  topFood: string;
  totalLogs: number;
  totalFoods: number;
};

const CATEGORY_MAP: Record<string, { label: string; icon: string; color: string }> = {
  page_visit:   { label: "Truy cập",     icon: "🌐",  color: "text-primary" },
  music:        { label: "Chọn nhạc",    icon: "🎵",  color: "text-primary" },
  decider:      { label: "Tung xúc xắc", icon: "🎲",  color: "text-foreground" },
  decider_vote: { label: "Vote món",     icon: "👍",  color: "text-accent" },
  cosmic:       { label: "Tử vi AI",     icon: "✨",  color: "text-primary" },
};

const PAGE_MAP: Record<string, string> = {
  home: "🏠 Trang chủ", stream: "🎵 Dòng cảm xúc", decider: "🎲 Trạm quyết định", cosmic: "✨ Cửa sổ vũ trụ",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"system" | "decider" | "cosmic">("system");
  
  const [logs, setLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [foods, setFoods] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dateFilter, setDateFilter] = useState<string>("all"); // system tab filter
  const [foodSearch, setFoodSearch] = useState("");
  const [pinnedOnly, setPinnedOnly] = useState(false);

  // Load Main Data
  const loadData = async (pwd: string) => {
    const res = await fetchDashboard(pwd);
    if (res.success) {
      setLogs(res.logs as Log[]);
      setStats(res.stats as Stats);
      
      const fRes = await getFoodsDB(); // Actually doesn't need pwd but we can call it here
      if (fRes.success) setFoods(fRes.data);

      return true;
    }
    setError(res.error ?? "Lỗi không xác định");
    return false;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const ok = await loadData(password);
    if (ok) setIsAuthenticated(true);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(password);
    setRefreshing(false);
  };

  const formatTime = (ts: string) => new Date(ts).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "medium" });

  // ─── Foods Management ────────────────────────────────────────────────────────
  const importJSON = async () => {
    const input = prompt("Nhập mảng JSON danh sách món ăn:");
    if (!input) return;
    setLoading(true);
    const res = await importFoodsDB(password, input);
    if (res.success) alert("Import thành công!"); else alert("Lỗi: " + res.error);
    await handleRefresh();
    setLoading(false);
  };

  const deleteFood = async (id: string, name: string) => {
    if (!confirm(`Xóa món: ${name}?`)) return;
    setLoading(true);
    await deleteFoodDB(password, id);
    await handleRefresh();
    setLoading(false);
  };

  // ─── Cosmic Management ───────────────────────────────────────────────────────
  const togglePin = async (id: string, currentPinStatus: boolean) => {
    const backupLogs = [...logs];
    setLogs(logs.map(l => l._id === id ? { ...l, pinned: !currentPinStatus } : l)); // optimistic update
    const res = await togglePinLog(password, id, !!currentPinStatus);
    if (!res.success) setLogs(backupLogs); // rollback
  };

  // ─── Filters & Computations ──────────────────────────────────────────────────
  const systemLogs = useMemo(() => {
    let base = logs.filter(l => l.category === "page_visit" || l.category === "music");
    if (dateFilter !== "all") {
      const today = new Date().toLocaleDateString();
      base = base.filter(l => new Date(l.timestamp).toLocaleDateString() === (dateFilter === "today" ? today : ""));
    }
    return base;
  }, [logs, dateFilter]);

  const deciderLogs = useMemo(() => logs.filter(l => l.category.includes("decider")), [logs]);
  
  const cosmicLogs = useMemo(() => {
    const cls = logs.filter(l => l.category === "cosmic");
    return pinnedOnly ? cls.filter(c => c.pinned) : cls;
  }, [logs, pinnedOnly]);

  const filteredFoods = useMemo(() => foods.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase())), [foods, foodSearch]);

  const mobileCount = logs.filter(l => l.device === "mobile").length;
  const desktopCount = logs.filter(l => l.device === "desktop").length;

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
            <input type="password" placeholder="Mật khẩu bí mật..." value={password} onChange={(e) => setPassword(e.target.value)}
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

  // ── Dashboard ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col md:flex-row gap-6">
      
      {/* ── Left Sidebar ── */}
      <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4">
        <div className="glass-card rounded-3xl p-6 flex items-center gap-3 mb-2">
          <ShieldCheck size={28} className="text-primary" />
          <div>
            <h1 className="text-lg font-serif font-bold text-foreground leading-tight">Terminal</h1>
            <p className="text-foreground/50 text-[10px] uppercase tracking-widest mt-0.5">Admin VibeHub</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { id: "system", label: "Hệ thống", icon: <LayoutGrid size={18} /> },
            { id: "decider", label: "Trạm quyết định", icon: <Dices size={18} /> },
            { id: "cosmic", label: "Cửa sổ vũ trụ", icon: <Stars size={18} /> },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all text-sm font-medium ${
                activeTab === tab.id ? "bg-primary text-white shadow-md shadow-primary/20" : "glass hover:bg-white/30 text-foreground/70 hover:text-foreground"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <button onClick={handleRefresh} disabled={refreshing}
          className="mt-auto flex items-center gap-2 justify-center glass border border-white/40 hover:border-white/70 text-foreground/70 hover:text-foreground px-4 py-3 rounded-2xl text-sm font-medium transition-all shadow-sm">
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Làm mới dữ liệu
        </button>
      </div>

      {/* ── Right Content ── */}
      <div className="flex-1 min-w-0 max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: SYSTEM */}
          {activeTab === "system" && (
            <motion.div key="system" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Tổng truy cập", value: stats.totalVisits, icon: <Globe /> },
                    { label: "Mobile / Desktop", value: `${mobileCount}/${desktopCount}`, icon: <Activity /> },
                    { label: "Tổng logs", value: stats.totalLogs, icon: <Database /> },
                    { label: "Vibe thịnh hành", value: stats.topMood.split(' ')[0], icon: <Music /> },
                  ].map((s, i) => (
                    <div key={i} className="glass-card rounded-3xl p-6 flex flex-col gap-3">
                      <div className="text-primary">{s.icon}</div>
                      <div>
                        <p className="text-2xl font-serif font-bold text-foreground leading-tight">{s.value}</p>
                        <p className="text-foreground/50 text-xs font-medium uppercase mt-1">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="glass-card rounded-3xl overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-white/20 flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-serif font-bold text-foreground text-lg">Lịch sử truy cập ({systemLogs.length})</h2>
                  <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="bg-white/30 border border-white/50 rounded-xl px-3 py-1.5 text-sm outline-none">
                    <option value="all">Mọi lúc</option>
                    <option value="today">Hôm nay</option>
                  </select>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-white/10 text-xs text-foreground/50 uppercase tracking-widest border-b border-white/15">
                      <tr><th className="px-6 py-4 font-medium">Thời gian</th><th className="px-6 py-4 font-medium">Thiết bị</th><th className="px-6 py-4 font-medium">ID</th><th className="px-6 py-4 font-medium">Danh mục</th></tr>
                    </thead>
                    <tbody>
                      {systemLogs.map((log) => (
                        <tr key={log._id} className="border-b border-white/10 hover:bg-white/20 text-sm">
                          <td className="px-6 py-4 text-foreground/60 font-mono text-xs">{formatTime(log.timestamp)}</td>
                          <td className="px-6 py-4">{log.device === "mobile" ? "📱 Mobile" : "🖥️ Desktop"}</td>
                          <td className="px-6 py-4 text-foreground/40 font-mono text-xs">{(log.sessionId ?? "").slice(0, 8)}</td>
                          <td className="px-6 py-4 font-medium text-primary flex items-center gap-2">
                             <span>{CATEGORY_MAP[log.category]?.icon}</span> {CATEGORY_MAP[log.category]?.label || log.category}
                             {log.category === 'music' && <span className="text-foreground/50 font-normal text-xs ml-2">({log.mood})</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DECIDER */}
          {activeTab === "decider" && (
            <motion.div key="decider" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Stats */}
                <div className="flex flex-col gap-4">
                  <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -bottom-6 text-primary/10 rotate-12 group-hover:scale-110 transition-transform"><Dices size={120}/></div>
                    <p className="text-foreground/50 text-xs font-medium uppercase tracking-widest mb-1">Top Món Ăn</p>
                    <p className="text-3xl font-serif font-bold text-foreground mb-4">{stats?.topFood.split(' (')[0]}</p>
                    <p className="text-sm font-medium text-primary">🏆 Phổ biến nhất</p>
                  </div>
                  <div className="glass-card rounded-3xl p-6">
                    <p className="text-foreground/50 text-xs font-medium uppercase tracking-widest mb-1">Dữ liệu Món</p>
                    <div className="flex justify-between items-end">
                      <p className="text-3xl font-serif font-bold text-foreground">{foods.length}</p>
                      <button onClick={importJSON} className="text-xs flex items-center gap-1 bg-white/40 hover:bg-white/60 px-3 py-1.5 rounded-full transition-colors text-foreground/80 font-medium"><Upload size={12}/> Import JSON</button>
                    </div>
                  </div>
                  
                  {/* Logs */}
                  <div className="glass-card rounded-3xl flex-1 flex flex-col overflow-hidden max-h-[300px]">
                    <div className="px-5 py-4 border-b border-white/20"><h3 className="font-serif font-bold text-sm">Nhật ký Random</h3></div>
                    <div className="overflow-y-auto p-2 flex flex-col gap-1">
                      {deciderLogs.length === 0 ? <p className="text-center text-xs text-foreground/40 py-4">Trống</p> : deciderLogs.map(l => (
                        <div key={l._id} className="text-xs p-3 rounded-xl hover:bg-white/20 flex flex-col gap-1">
                          <span className="text-foreground/40 font-mono">{formatTime(l.timestamp)}</span>
                          <span className="font-medium text-foreground">{l.category === "decider_vote" ? (l.vote === "like" ? "👍" : "👎") : "🎲"} {l.deciderItem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DB Table */}
                <div className="md:col-span-2 glass-card rounded-3xl flex flex-col overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/20 flex flex-wrap items-center justify-between gap-4 bg-white/5">
                    <h2 className="font-serif font-bold text-foreground text-lg">Quản lý Database ({filteredFoods.length})</h2>
                    <input type="text" placeholder="Tìm tên món..." value={foodSearch} onChange={e=>setFoodSearch(e.target.value)}
                      className="bg-white/30 border border-white/50 rounded-xl px-4 py-2 text-sm outline-none placeholder:text-foreground/40 w-full sm:w-auto" />
                  </div>
                  <div className="overflow-x-auto w-full max-h-[600px] overflow-y-auto relative">
                    <table className="w-full text-left min-w-[600px]">
                      <thead className="bg-white/10 text-xs text-foreground/50 uppercase tracking-widest border-b border-white/15 sticky top-0 backdrop-blur-md z-10">
                        <tr><th className="px-4 py-3 font-medium">Tên món</th><th className="px-4 py-3 font-medium">Vùng</th><th className="px-4 py-3 font-medium">Lớp</th><th className="px-4 py-3 font-medium">Mô tả</th><th className="px-4 py-3 font-medium text-right">#</th></tr>
                      </thead>
                      <tbody>
                        {filteredFoods.map(f => (
                          <tr key={f._id} className="border-b border-white/10 hover:bg-white/20 text-xs">
                            <td className="px-4 py-3 font-bold text-foreground">{f.name}</td>
                            <td className="px-4 py-3 text-foreground/60">{f.region === "bac" ? "Bắc" : f.region==="trung"?"Trung":"Nam"}</td>
                            <td className="px-4 py-3 text-foreground/60">{f.category === "an-chinh" ? "Chính" : "Vặt"}</td>
                            <td className="px-4 py-3 text-foreground/50 max-w-[200px] truncate" title={f.desc}>{f.desc}</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => deleteFood(f._id, f.name)} className="text-accent hover:bg-accent/20 p-1.5 rounded-lg transition-colors"><Trash2 size={14}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: COSMIC */}
          {activeTab === "cosmic" && (
            <motion.div key="cosmic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 glass-card rounded-3xl p-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Nhật ký Vũ Trụ</h2>
                  <p className="text-sm text-foreground/50">Đã giải đáp {stats?.totalCosmic} thắc mắc.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <button onClick={() => setPinnedOnly(false)} className={`px-4 py-2 rounded-xl transition-colors ${!pinnedOnly ? "bg-primary text-white" : "bg-white/30 text-foreground/70"}`}>Tất cả</button>
                  <button onClick={() => setPinnedOnly(true)} className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${pinnedOnly ? "bg-accent text-white" : "bg-white/30 text-foreground/70"}`}><Pin size={14}/> Đã ghim</button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-rows-max">
                {cosmicLogs.map(log => (
                  <div key={log._id} className={`glass-card rounded-[2rem] p-6 flex flex-col gap-4 relative transition-all ${log.pinned ? "border-accent/40 shadow-sm" : "border-white/20"}`}>
                    <button onClick={() => togglePin(log._id, !!log.pinned)} className={`absolute top-5 right-5 p-2 rounded-full transition-colors ${log.pinned ? "bg-accent/20 text-accent hover:bg-accent/30" : "bg-white/20 text-foreground/40 hover:bg-white/40 hover:text-foreground/80"}`} title="Ghim log">
                      <Pin size={16} className={log.pinned ? "fill-current" : ""} />
                    </button>
                    
                    <div className="flex items-center gap-3 border-b border-foreground/10 pb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold font-serif">{log.userName?.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className="font-bold text-foreground">{log.userName} <span className="text-xs font-normal text-foreground/40 ml-1">sinh {log.birthdate}</span></p>
                        <p className="text-xs text-foreground/40 font-mono mt-0.5">{formatTime(log.timestamp)}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-foreground/80 leading-relaxed max-h-[250px] overflow-y-auto no-scrollbar whitespace-pre-wrap pr-2 font-medium">
                      {log.horoscopeResult}
                    </div>
                  </div>
                ))}
                {cosmicLogs.length === 0 && <div className="col-span-1 xl:col-span-2 text-center py-16 text-foreground/40 glass-card rounded-[2rem]">Chưa có dữ liệu.</div>}
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
