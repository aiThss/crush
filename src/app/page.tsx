"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Music, Dices, ArrowRight, X } from "lucide-react";
import CosmicGuide from "@/components/CosmicGuide";
import StreamVibe from "@/components/StreamVibe";
import Decider from "@/components/Decider";

type Tab = "stream" | "decider" | "cosmic" | null;

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen flex flex-col items-center p-6 sm:p-12 md:p-24 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-accent/20 blur-[100px] pointer-events-none" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl flex flex-col items-center text-center z-10 pt-10 pb-16"
      >
        <span className="text-primary-glow font-medium tracking-widest uppercase text-xs sm:text-sm mb-4">
          Trạm sạc năng lượng vũ trụ
        </span>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 mb-6 drop-shadow-sm">
          VibeHub.
        </h1>
        <p className="text-foreground/70 max-w-lg text-sm sm:text-base leading-relaxed">
          Nơi bạn trốn khỏi thế giới ồn ào. Tìm một bài hát hợp thời tiết, xem vũ trụ muốn nói gì, và để The Decider quyết định bạn nên ăn món gì tối nay.
        </p>
      </motion.div>

      {/* Main Navigation Grids */}
      {!activeTab && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 z-10"
        >
          {/* Card 1: The Stream */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("stream")}
            className="glass-card rounded-3xl p-8 cursor-pointer flex flex-col items-start justify-between min-h-[220px] group transition-all"
          >
            <div className="p-4 rounded-2xl bg-primary/10 text-primary-glow mb-4 group-hover:bg-primary/20 transition-colors">
              <Music size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary-glow transition-colors">The Stream</h2>
              <p className="text-foreground/60 text-sm">Trình phát Vibe. Tìm mood qua tiết trời hôm nay.</p>
            </div>
          </motion.div>

          {/* Card 2: The Decider */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("decider")}
            className="glass-card rounded-3xl p-8 cursor-pointer flex flex-col items-start justify-between min-h-[220px] group transition-all"
          >
            <div className="p-4 rounded-2xl bg-accent/10 text-accent mb-4 group-hover:bg-accent/20 transition-colors">
              <Dices size={28} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">The Decider</h2>
              <p className="text-foreground/60 text-sm">Hôm nay ăn gì, làm gì? Rối quá thì để đây random cho.</p>
            </div>
          </motion.div>

          {/* Card 3: Cosmic Guide */}
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("cosmic")}
            className="glass-card rounded-3xl p-8 cursor-pointer flex flex-col items-start justify-between min-h-[220px] group transition-all"
          >
            <div className="p-4 rounded-2xl bg-white/5 text-white mb-4 group-hover:bg-white/10 transition-colors">
              <Sparkles size={28} fill="currentColor" className="opacity-80" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">Cosmic Guide</h2>
              <p className="text-foreground/60 text-sm">Xem tử vi AI. Lời khuyên êm ái cho tâm hồn xao động.</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Render Active Tab */}
      <AnimatePresence mode="wait">
        {activeTab && (
          <motion.div
            key="active-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl z-10 relative"
          >
            <button 
              onClick={() => setActiveTab(null)}
              className="absolute -top-16 left-0 text-foreground/50 hover:text-foreground flex items-center gap-2 transition-colors text-sm uppercase tracking-wider font-medium"
            >
              <ArrowRight size={16} className="rotate-180" />
              <span>Trở về</span>
            </button>
            
            <div className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
              <button 
                onClick={() => setActiveTab(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-foreground/60" />
              </button>
              
              {activeTab === "stream" && <StreamVibe />}
              {activeTab === "decider" && <Decider />}
              {activeTab === "cosmic" && <CosmicGuide />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
