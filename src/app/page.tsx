"use client";

import { useState, useEffect, MouseEvent, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Sparkles, Music, Dices, ArrowRight, X } from "lucide-react";
import CosmicGuide from "@/components/CosmicGuide";
import StreamVibe from "@/components/StreamVibe";
import Decider from "@/components/Decider";
import { logActivity } from "@/app/tracking-actions";
import { getSessionId, getDevice } from "@/lib/session";
import { getFoodsDB } from "@/app/admin/actions";

type Tab = "stream" | "decider" | "cosmic" | null;

const InteractiveCard = ({
  children, onClick, isMobile
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
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  if (isMobile) {
    return (
      <motion.div
        animate={{ y: ["0px", "-12px", "0px"], rotate: [0, 1, -1, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        onClick={onClick}
        className="glass-card rounded-3xl p-8 cursor-pointer flex flex-col items-start justify-between min-h-[220px] group transition-all"
      >{children}</motion.div>
    );
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "1000px" }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card rounded-3xl p-8 cursor-pointer flex flex-col items-start justify-between min-h-[220px] group transition-all"
    >
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [foods, setFoods] = useState<any[]>([]);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const cursorX = useTransform(mouseX, x => x - 192);
  const cursorY = useTransform(mouseY, y => y - 192);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);

    // Fetch initial data
    getFoodsDB().then(res => {
      if (res.success) setFoods(res.data);
    });

    // Log page visit
    logActivity({
      category: "page_visit",
      page: "home",
      device: getDevice(),
      sessionId: getSessionId(),
    });

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGlobalMouseMove = useCallback((e: globalThis.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!isMobile) window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [isMobile, handleGlobalMouseMove]);

  const handleTabOpen = (tab: Exclude<Tab, null>) => {
    setActiveTab(tab);
    logActivity({
      category: "page_visit",
      page: tab,
      device: getDevice(),
      sessionId: getSessionId(),
    });
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen flex flex-col items-center p-6 sm:p-12 md:p-24 overflow-hidden">
      {/* Background Cursor Glow */}
      {!isMobile && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-[100px] z-0"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)", translateX: cursorX, translateY: cursorY }}
        />
      )}

      {/* Floating Quotes */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [-8, -6, -8] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute top-32 left-4 md:left-12 font-script font-bold text-3xl md:text-4xl text-accent opacity-100 z-0 pointer-events-none drop-shadow-md"
      >
        vũ trụ đang lắng nghe...
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [5, 7, 5] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute bottom-40 right-8 md:right-32 font-script font-bold text-3xl md:text-4xl text-accent opacity-100 z-0 pointer-events-none drop-shadow-md"
      >
        kỷ niệm là báu vật
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl flex flex-col items-center text-center z-10 pt-10 pb-16"
      >
        <span className="text-primary font-medium tracking-widest uppercase text-xs sm:text-sm mb-4">
          Nơi vũ trụ quyết định thay bạn
        </span>
        <h1 style={{ fontFamily: "'Courier New', Courier, monospace" }} className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground mb-6 drop-shadow-sm">
          Tín hiệu từ vũ trụ
        </h1>
        <p className="text-foreground/80 max-w-lg text-sm sm:text-base leading-relaxed">
          Nếu chưa quyết định được, thì để tôi!!!
        </p>
      </motion.div>

      {/* Main Navigation Grids */}
      {!activeTab && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 z-10 relative"
        >
          {/* Card 1 */}
          <div className="relative">
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [-4, -2, -4] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
              className="absolute -top-6 -right-6 font-script font-bold text-3xl text-accent opacity-100 z-20 pointer-events-none drop-shadow-md"
            >
              chút mộng mơ cho ngày dài
            </motion.div>
            <InteractiveCard isMobile={isMobile} onClick={() => handleTabOpen("stream")}>
              <div className="p-4 rounded-3xl bg-white/20 text-primary mb-4 group-hover:bg-white/30 transition-colors shadow-sm">
                <Music size={28} />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">Dòng Cảm Xúc</h2>
                <p className="text-foreground/80 text-sm">Trình phát Random. Mỗi ngày một bản nhạc.</p>
              </div>
            </InteractiveCard>
          </div>

          {/* Card 2 */}
          <InteractiveCard isMobile={isMobile} onClick={() => handleTabOpen("decider")}>
            <div className="p-4 rounded-3xl bg-white/20 text-primary mb-4 group-hover:bg-white/30 transition-colors shadow-sm">
              <Dices size={28} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold mb-2 text-foreground group-hover:text-foreground/80 transition-colors">Trạm Quyết Định</h2>
              <p className="text-foreground/80 text-sm">Hôm nay ăn gì, làm gì? Rối quá thì để đây random cho.</p>
            </div>
          </InteractiveCard>

          {/* Card 3 */}
          <InteractiveCard isMobile={isMobile} onClick={() => handleTabOpen("cosmic")}>
            <div className="p-4 rounded-3xl bg-white/20 text-primary mb-4 group-hover:bg-white/30 transition-colors shadow-sm">
              <Sparkles size={28} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">Cửa Sổ Vũ Trụ</h2>
              <p className="text-foreground/80 text-sm">Tử vi hôm nay. Để mình luận quẻ một chút nếu bạn đang có thắc mắc nhé!</p>
            </div>
          </InteractiveCard>
        </motion.div>
      )}

      {/* Render Active Tab */}
      <AnimatePresence mode="wait">
        {activeTab && (
          <motion.div key="active-tab"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            className="w-full max-w-2xl z-10 relative"
          >
            <button onClick={() => setActiveTab(null)}
              className="absolute -top-16 left-0 text-foreground/60 hover:text-foreground flex items-center gap-2 transition-colors text-sm uppercase tracking-widest font-medium">
              <ArrowRight size={16} className="rotate-180" />
              <span>Trở về</span>
            </button>
            <div className="glass-card rounded-[2rem] p-6 sm:p-10 relative overflow-hidden">
              <button onClick={() => setActiveTab(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors shadow-sm">
                <X size={20} className="text-foreground/80" />
              </button>
              {activeTab === "stream" && <StreamVibe />}
              {activeTab === "decider" && <Decider initialFoods={foods} />}
              {activeTab === "cosmic" && <CosmicGuide />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
