"use client";

import { useState } from "react";
import { Dices, Utensils, PersonStanding, Loader2 } from "lucide-react";
import { getRandomDecision } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";

export default function Decider() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [typeClicked, setTypeClicked] = useState<"food" | "activity" | null>(null);

  const handleRoll = async (type: "food" | "activity") => {
    setLoading(true);
    setTypeClicked(type);
    setResult(null);
    
    // Fake delay for suspense
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const res = await getRandomDecision(type);
    if (res.success) {
      setResult(res.result!);
    } else {
      setResult("Oops, có lỗi gì đó rồi. Cậu tự quyết đi!");
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-accent/10 text-accent">
          <Dices size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">The Decider</h2>
          <p className="text-foreground/50 text-sm">Chữa bệnh lười suy nghĩ.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => handleRoll("food")}
          disabled={loading}
          className="glass border border-accent/20 hover:border-accent/50 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors group"
        >
          <Utensils size={32} className="text-accent group-hover:scale-110 transition-transform" />
          <span className="font-medium text-foreground/80 group-hover:text-foreground">Hôm nay ăn gì?</span>
        </button>

        <button 
          onClick={() => handleRoll("activity")}
          disabled={loading}
          className="glass border border-primary/20 hover:border-primary/50 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors group"
        >
          <PersonStanding size={32} className="text-primary group-hover:scale-110 transition-transform" />
          <span className="font-medium text-foreground/80 group-hover:text-foreground">Hôm nay làm trò gì?</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {(loading || result) && (
          <motion.div 
            key="result-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-8 p-8 rounded-2xl bg-surface-hover/80 border border-white/5 flex flex-col items-center justify-center text-center min-h-[160px]"
          >
            {loading ? (
              <div className="flex flex-col items-center gap-4 text-foreground/60">
                <Loader2 className="animate-spin" size={28} />
                <p className="text-sm">Vũ trụ đang bốc thăm...</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-2"
              >
                <p className="text-sm text-foreground/50 uppercase tracking-widest mb-2">
                  {typeClicked === "food" ? "Bạn nên ăn" : "Bạn nên"}
                </p>
                <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">
                  {result}
                </h3>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
