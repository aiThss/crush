"use client";

import { useState, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Sparkles, Music, Dices, ArrowRight, X } from "lucide-react";
import CosmicGuide from "@/components/CosmicGuide";
import StreamVibe from "@/components/StreamVibe";
import Decider from "@/components/Decider";

type Tab = "stream" | "decider" | "cosmic" | null;

const InteractiveCard = ({ 
  children, 
  onClick, 
  isMobile 
}: { 
  children: React.ReactNode; 
  onClick: () => void;
  isMobile: boolean;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (isMobile) {
    return (
      <motion.div
        animate={{ 
          y: ["0px", "-12px", "0px"],
          rotate: [0, 1, -1, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          repeatType: "mirror",
          ease: "easeInOut"
        }}
        onClick={onClick}
        className="glass-card rounded-3xl p-8 cursor-pointer flex flex-col items-start justify-between min-h-[220px] group transition-all"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card rounded-3xl p-8 cursor-pointer flex flex-col items-start justify-between min-h-[220px] group transition-all"
    >
      <div style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  
  // Cursor glow state
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  });

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen flex flex-col items-center p-6 sm:p-12 md:p-24 overflow-hidden">
      {/* Background Cursor Glow */}
      {!isMobile && (
        <motion.div 
          className="pointer-events-none fixed top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-[100px] z-0"
          style={{ 
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            translateX: useTransform(mouseX, x => x - 192),
            translateY: useTransform(mouseY, y => y - 192)
          }}
        />
      )}

      {/* Floating Quotes */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [-8, -6, -8] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute top-32 left-4 md:left-12 font-script text-2xl md:text-3xl text-primary/60 opacity-80 z-0 pointer-events-none"
      >
        vũ trụ đang lắng nghe...
      </motion.div>
      <motion.div 
        animate={{ y: [0, -10, 0], rotate: [5, 7, 5] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute bottom-40 right-8 md:right-32 font-script text-2xl md:text-3xl text-accent/80 opacity-80 z-0 pointer-events-none"
      >
        kỷ niệm là báu vật
      </motion.div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl flex flex-col items-center text-center z-10 pt-10 pb-16"
      >
        <span className="text-primary font-medium tracking-widest uppercase text-xs sm:text-sm mb-4">
          Trạm sạc năng lượng vũ trụ
        </span>
        <h1 className="text-5xl sm:text-7xl font-serif font-bold tracking-tight text-foreground mb-6 drop-shadow-sm">
          VibeHub.
        </h1>
        <p className="text-foreground/70 max-w-lg text-sm sm:text-base leading-relaxed">
          Nơi bạn trốn khỏi thế giới ồn ào. Dành chút không gian tĩnh lặng, lắng nghe một giai điệu dịu êm, hay để vũ trụ chỉ lối cho những bộn bề.
        </p>
      </motion.div>

      {/* Main Navigation Grids */}
      {!activeTab && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 z-10 relative"
        >
          {/* Card 1 */}
          <div className="relative">
             <motion.div 
              animate={{ y: [0, 8, 0], rotate: [-4, -2, -4] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
              className="absolute -top-6 -right-6 font-script text-2xl text-primary-glow/70 z-20 pointer-events-none"
            >
               chút mộng mơ cho ngày dài
            </motion.div>
            <InteractiveCard isMobile={isMobile} onClick={() => setActiveTab("stream")}>
              <div className="p-4 rounded-3xl bg-white/20 text-primary mb-4 group-hover:bg-white/30 transition-colors shadow-sm">
                <Music size={28} />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">Dòng Cảm Xúc</h2>
                <p className="text-foreground/70 text-sm">Trình phát Vibe. Cuốn theo từng nốt nhạc của bầu trời.</p>
              </div>
            </InteractiveCard>
          </div>

          {/* Card 2 */}
          <InteractiveCard isMobile={isMobile} onClick={() => setActiveTab("decider")}>
            <div className="p-4 rounded-3xl bg-accent/30 text-foreground mb-4 group-hover:bg-accent/40 transition-colors shadow-sm">
              <Dices size={28} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold mb-2 text-foreground group-hover:text-foreground/80 transition-colors">Trạm Quyết Định</h2>
              <p className="text-foreground/70 text-sm">Hôm nay ăn gì, làm gì? Rối quá thì để đây random cho.</p>
            </div>
          </InteractiveCard>

          {/* Card 3 */}
          <InteractiveCard isMobile={isMobile} onClick={() => setActiveTab("cosmic")}>
            <div className="p-4 rounded-3xl bg-primary/20 text-primary mb-4 group-hover:bg-primary/30 transition-colors shadow-sm">
              <Sparkles size={28} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">Cửa Sổ Vũ Trụ</h2>
              <p className="text-foreground/70 text-sm">Xem tử vi AI. Lời khuyên êm ái cho tâm hồn xao động.</p>
            </div>
          </InteractiveCard>
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
              className="absolute -top-16 left-0 text-foreground/60 hover:text-foreground flex items-center gap-2 transition-colors text-sm uppercase tracking-widest font-medium"
            >
              <ArrowRight size={16} className="rotate-180" />
              <span>Trở về</span>
            </button>
            
            <div className="glass-card rounded-[2rem] p-6 sm:p-10 relative overflow-hidden">
              <button 
                onClick={() => setActiveTab(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors shadow-sm"
              >
                <X size={20} className="text-foreground/80" />
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
