"use client";

import { useState } from "react";
import { Dices, Utensils, PersonStanding, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { getRandomDecision } from "@/app/actions";
import { logActivity } from "@/app/tracking-actions";
import { getSessionId, getDevice } from "@/lib/session";
import { motion, AnimatePresence } from "framer-motion";

type VoteState = "idle" | "liked" | "disliked";

export default function Decider() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [typeClicked, setTypeClicked] = useState<"food" | "activity" | null>(null);
  const [voteState, setVoteState] = useState<VoteState>("idle");
  const [showCelebration, setShowCelebration] = useState(false);

  const handleRoll = async (type: "food" | "activity") => {
    setLoading(true);
    setTypeClicked(type);
    setResult(null);
    setVoteState("idle");
    await new Promise(resolve => setTimeout(resolve, 800));
    const res = await getRandomDecision(type);
    const item = res.success ? res.result! : "Oops, có lỗi gì đó rồi. Cậu tự quyết đi!";
    setResult(item);

    // Log the decider action
    logActivity({
      category: "decider",
      deciderItem: item,
      deciderType: type,
      device: getDevice(),
      sessionId: getSessionId(),
    });

    setLoading(false);
  };

  const handleLike = () => {
    if (!result || !typeClicked || voteState !== "idle") return;
    setVoteState("liked");
    setShowCelebration(true);
    logActivity({
      category: "decider_vote",
      deciderItem: result,
      deciderType: typeClicked,
      vote: "like",
      device: getDevice(),
      sessionId: getSessionId(),
    });
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const handleDislike = () => {
    if (!result || !typeClicked || voteState !== "idle") return;
    logActivity({
      category: "decider_vote",
      deciderItem: result,
      deciderType: typeClicked,
      vote: "dislike",
      device: getDevice(),
      sessionId: getSessionId(),
    });
    handleRoll(typeClicked);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-white/40 text-primary shadow-sm">
          <Dices size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold">Trạm Quyết Định</h2>
          <p className="text-foreground/70 text-sm">Chữa bệnh lười suy nghĩ.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => handleRoll("food")} disabled={loading}
          className="glass border border-white/40 hover:border-white/80 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-colors group shadow-sm">
          <Utensils size={32} className="text-foreground group-hover:scale-110 transition-transform" />
          <span className="font-medium text-foreground/80 group-hover:text-foreground">Hôm nay ăn gì?</span>
        </button>
        <button onClick={() => handleRoll("activity")} disabled={loading}
          className="glass border border-white/40 hover:border-white/80 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-colors group shadow-sm">
          <PersonStanding size={32} className="text-primary group-hover:scale-110 transition-transform" />
          <span className="font-medium text-foreground/80 group-hover:text-foreground">Hôm nay làm gì?</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {(loading || result) && (
          <motion.div key="result-box"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="mt-8 p-8 rounded-[2rem] bg-surface-hover/80 border border-white/50 flex flex-col items-center justify-center text-center min-h-[160px] shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center gap-4 text-foreground/70">
                <Loader2 className="animate-spin" size={28} />
                <p className="text-sm font-medium">Vũ trụ đang bốc thăm...</p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 w-full">
                <p className="text-sm text-foreground/60 uppercase tracking-widest font-medium">
                  {typeClicked === "food" ? "Bạn nên ăn" : "Bạn nên"}
                </p>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{result}</h3>

                {typeClicked === "food" && voteState === "idle" && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 mt-2 flex-wrap justify-center">
                    <p className="text-xs text-foreground/50">Nghe hợp lý không?</p>
                    <button onClick={handleLike}
                      className="flex items-center gap-1.5 bg-white/40 hover:bg-primary/20 border border-white/50 hover:border-primary/30 text-foreground px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm">
                      <ThumbsUp size={14} /> Ăn được!
                    </button>
                    <button onClick={handleDislike}
                      className="flex items-center gap-1.5 bg-white/40 hover:bg-accent/20 border border-white/50 hover:border-accent/30 text-foreground px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm">
                      <ThumbsDown size={14} /> Đổi đi!
                    </button>
                  </motion.div>
                )}
                {voteState === "liked" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-primary font-medium mt-2">
                    ✨ Chúc bạn ngon miệng nhé!
                  </motion.p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/15 backdrop-blur-sm z-50" onClick={() => setShowCelebration(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }} transition={{ type: "spring", damping: 18, stiffness: 280 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[85vw] max-w-xs">
              <div className="glass-card rounded-3xl p-8 flex flex-col items-center gap-4 text-center shadow-xl border border-white/60">
                <motion.div animate={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ duration: 0.6 }} className="text-5xl">🍽️</motion.div>
                <h3 className="font-serif font-bold text-xl text-foreground">Tuyệt vời!</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  Chúc bạn thưởng thức bữa ăn thật vui vẻ nhé 🌸<br />
                  <span className="text-foreground/50 text-xs">Ăn ngon, sống khoẻ, vũ trụ yêu bạn!</span>
                </p>
                <button onClick={() => setShowCelebration(false)}
                  className="mt-2 px-6 py-2 bg-primary hover:bg-primary-glow text-white rounded-full text-sm font-medium transition-colors shadow-sm">
                  Cảm ơn! 🙏
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
