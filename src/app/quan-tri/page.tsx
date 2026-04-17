"use client";

import { useState } from "react";
import { Lock, ShieldCheck, Database } from "lucide-react";
import { fetchAdminLogs } from "./actions";

type Log = {
  _id: string;
  name: string;
  birthdate: string;
  result: string;
  timestamp: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const res = await fetchAdminLogs(password);
    
    if (res.success) {
      setIsAuthenticated(true);
      setLogs(res.logs!);
    } else {
      setError(res.error!);
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <form onSubmit={handleLogin} className="glass-card p-8 rounded-3xl w-full max-w-sm flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary-glow mb-2">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Admin VibeHub</h1>
          
          <div className="w-full">
            <input 
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 text-center tracking-widest transition-all"
            />
            {error && <p className="text-accent text-xs mt-2 text-center">{error}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading || !password}
            className="w-full bg-primary hover:bg-primary-glow text-white py-3 rounded-xl transition-all disabled:opacity-50 font-medium"
          >
            {loading ? "Đang mở cửa..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck size={32} className="text-primary-glow" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/50 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Database size={16} />
            <span>{logs.length} bản ghi</span>
          </div>
        </div>

        <div className="glass rounded-3xl overflow-hidden border border-white/10 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-foreground/80 text-sm">
                <th className="p-4 font-medium border-b border-white/10">Thời gian</th>
                <th className="p-4 font-medium border-b border-white/10">Tên</th>
                <th className="p-4 font-medium border-b border-white/10">Ngày sinh</th>
                <th className="p-4 font-medium border-b border-white/10">Kết quả AI</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm text-foreground/60 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString("vi-VN")}
                  </td>
                  <td className="p-4 text-sm font-medium">{log.name}</td>
                  <td className="p-4 text-sm whitespace-nowrap">{log.birthdate}</td>
                  <td className="p-4 text-sm text-foreground/70 max-w-md">
                    <div className="line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                      {log.result}
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/50">
                    Chưa có ai hỏi vũ trụ điều gì.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
