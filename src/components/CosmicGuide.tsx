"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { getCosmicGuidance } from "@/app/actions";
import { motion } from "framer-motion";

export default function CosmicGuide() {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthdate) return;
    
    setLoading(true);
    setResult(null);
    setError(null);
    
    const res = await getCosmicGuidance(name, birthdate);
    
    if (res.success) {
      setResult(res.text!);
    } else {
      setError(res.error!);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-white/10 text-white">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Tử vi AI</h2>
          <p className="text-foreground/50 text-sm">Vũ trụ có vài lời thủ thỉ với cậu.</p>
        </div>
      </div>

      {!result && !error ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground/70 ml-1">Tên của cậu là gì?</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Cô gái mộng mơ"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 placeholder-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground/70 ml-1">Cậu đến Trái Đất ngày nào?</label>
            <input 
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !name || !birthdate}
            className="mt-4 w-full bg-primary hover:bg-primary-glow text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(155,81,224,0.3)] hover:shadow-[0_0_30px_rgba(177,98,255,0.5)]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? "Đang kết nối vũ trụ..." : "Rút quẻ hôm nay"}
          </button>
        </form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          {error ? (
            <p className="text-accent text-center">{error}</p>
          ) : (
            <div className="prose prose-invert prose-p:leading-relaxed text-sm md:text-base text-foreground/90 font-light whitespace-pre-wrap">
              {result}
            </div>
          )}
          
          <button 
            onClick={() => { setResult(null); setError(null); }}
            className="mt-8 text-sm text-primary hover:text-primary-glow underline underline-offset-4 transition-colors"
          >
            Thử một quẻ khác
          </button>
        </motion.div>
      )}
    </div>
  );
}
