"use client";

import { useState, useRef } from "react";
import { Dices, Utensils, PersonStanding, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { ACTIVITIES, FOOD_GROUP_META, type Region, type FoodItem } from "@/data/foods";
import { logActivity } from "@/app/tracking-actions";
import { getSessionId, getDevice } from "@/lib/session";
import { motion, AnimatePresence } from "framer-motion";

type VoteState = "idle" | "liked" | "disliked";
type RegionFilter = "all" | Region;
type CategoryFilter = "all" | "an-chinh" | "an-vat";

// ─── Config ───────────────────────────────────────────────────────────────────
const DISLIKE_THRESHOLD = 3; // dislikes within a group before switching to next group

// ─── Region selector data ─────────────────────────────────────────────────────
// ─── Region selector helper ──────────────────────────────────────────────────
function getFilteredCount(foods: any[], region: string, category: CategoryFilter) {
  return foods.filter(f => f.region === region && (category === "all" || f.category === category)).length;
}

const REGION_LABEL: Record<RegionFilter, string> = {
  all: "mọi miền", bac: "Miền Bắc", trung: "Miền Trung", nam: "Miền Nam",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGroupsForRegion(foods: any[], region: RegionFilter, category: CategoryFilter): string[] {
  const pool = foods.filter(f => 
    (region === "all" || f.region === region) && 
    (category === "all" || f.category === category)
  );
  return [...new Set(pool.map(f => f.group))];
}

function pickNewGroup(foods: any[], region: RegionFilter, category: CategoryFilter, exhausted: string[]): string {
  const all = getGroupsForRegion(foods, region, category);
  const available = all.filter(g => !exhausted.includes(g));
  const pool = available.length > 0 ? available : all; // reset if all exhausted
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Decider({ initialFoods = [] }: { initialFoods?: any[] }) {
  const foods = initialFoods.length > 0 ? initialFoods : [];
  
  const [categoryFilter, setCategoryFilter]   = useState<CategoryFilter>("all");
  
  const CATEGORY_OPTIONS: { key: CategoryFilter; label: string; emoji: string; count: number }[] = [
    { key: "all",      label: "Ăn gì cũng được", emoji: "🍱", count: foods.length },
    { key: "an-chinh", label: "Ăn no (bữa chính)", emoji: "🍲", count: foods.filter(f => f.category === "an-chinh").length },
    { key: "an-vat",   label: "Ăn vặt / Tráng miệng", emoji: "🧋", count: foods.filter(f => f.category === "an-vat").length },
  ];

  const REGION_OPTIONS: { key: RegionFilter; label: string; emoji: string; count: number }[] = [
    { key: "all",   label: "Tất cả",     emoji: "🌏", count: foods.filter(f => categoryFilter === "all" || f.category === categoryFilter).length },
    { key: "bac",   label: "Miền Bắc",   emoji: "🌿", count: getFilteredCount(foods, "bac", categoryFilter) },
    { key: "trung", label: "Miền Trung", emoji: "🌊", count: getFilteredCount(foods, "trung", categoryFilter) },
    { key: "nam",   label: "Miền Nam",   emoji: "🌴", count: getFilteredCount(foods, "nam", categoryFilter) },
  ];

  const [loading, setLoading]                 = useState(false);
  const [result, setResult]                   = useState<string | null>(null);
  const [resultDesc, setResultDesc]           = useState<string | null>(null);
  const [typeClicked, setTypeClicked]         = useState<"food" | "activity" | null>(null);
  const [regionFilter, setRegionFilter]       = useState<RegionFilter>("all");
  const [voteState, setVoteState]             = useState<VoteState>("idle");
  const [showCelebration, setShowCelebration] = useState(false);

  // Group-switch state (refs — updated synchronously so handleDislike → handleRoll works)
  const activeGroupRef      = useRef<string | null>(null);
  const groupDislikeRef     = useRef(0);
  const exhaustedGroupsRef  = useRef<string[]>([]);

  // Display-only state for group indicator
  const [groupLabel, setGroupLabel]     = useState<string | null>(null);
  const [groupDislikeCount, setGroupDislikeCount] = useState(0);

  // Per-type anti-repeat history
  const recentFood     = useRef<string[]>([]);
  const recentActivity = useRef<string[]>([]);

  // ── Reset all group state (on region change) ───────────────────────────────
  const resetGroups = () => {
    activeGroupRef.current     = null;
    groupDislikeRef.current    = 0;
    exhaustedGroupsRef.current = [];
    setGroupLabel(null);
    setGroupDislikeCount(0);
  };

  // ── Main roll handler ──────────────────────────────────────────────────────
  const handleRoll = async (type: "food" | "activity") => {
    setLoading(true);
    setTypeClicked(type);
    setResult(null);
    setResultDesc(null);
    setVoteState("idle");

    await new Promise(resolve => setTimeout(resolve, 650));

    let item: string;
    let desc: string | null = null;

    if (type === "food") {
      const pool = foods.filter(f => 
        (regionFilter === "all" || f.region === regionFilter) &&
        (categoryFilter === "all" || f.category === categoryFilter)
      );

      // ── Pick / maintain active group ───────────────────────────────────────
      let group = activeGroupRef.current;
      if (!group) {
        group = pickNewGroup(foods, regionFilter, categoryFilter, exhaustedGroupsRef.current);
        activeGroupRef.current  = group;
        groupDislikeRef.current = 0;
      }

      // ── Get foods in this group ───────────────────────────────────────────
      const groupFoods = pool.filter(f => f.group === group);
      const workingPool = groupFoods.length > 0 ? groupFoods : pool; // fallback

      // ── Anti-repeat within group ──────────────────────────────────────────
      const excludeCount = Math.max(1, Math.floor(workingPool.length / 2));
      const recent       = recentFood.current.slice(-excludeCount);
      const available    = workingPool.filter(f => !recent.includes(f.name));
      const finalPool    = available.length > 0 ? available : workingPool;

      const picked = finalPool[Math.floor(Math.random() * finalPool.length)];
      recentFood.current = [...recentFood.current, picked.name].slice(-20);
      item = picked.name;
      desc = picked.desc;

      // ── Update group label display ────────────────────────────────────────
      const meta = FOOD_GROUP_META.find(m => m.key === group);
      setGroupLabel(meta ? `${meta.emoji} ${meta.label}` : null);
      setGroupDislikeCount(groupDislikeRef.current);

    } else {
      // Activity — simple anti-repeat
      const excludeCount = Math.max(1, Math.floor(ACTIVITIES.length / 3));
      const recent       = recentActivity.current.slice(-excludeCount);
      const available    = ACTIVITIES.filter(a => !recent.includes(a));
      const finalPool    = available.length > 0 ? available : ACTIVITIES;

      item = finalPool[Math.floor(Math.random() * finalPool.length)];
      recentActivity.current = [...recentActivity.current, item].slice(-10);
      setGroupLabel(null);
      setGroupDislikeCount(0);
    }

    setResult(item);
    setResultDesc(desc);
    logActivity({
      category: "decider", deciderItem: item, deciderType: type,
      device: getDevice(), sessionId: getSessionId(),
    });
    setLoading(false);
  };

  // ── Like → keep group, show celebration ───────────────────────────────────
  const handleLike = () => {
    if (!result || !typeClicked || voteState !== "idle") return;
    setVoteState("liked");
    setShowCelebration(true);
    logActivity({
      category: "decider_vote", deciderItem: result, deciderType: typeClicked,
      vote: "like", device: getDevice(), sessionId: getSessionId(),
    });
    setTimeout(() => setShowCelebration(false), 3000);
  };

  // ── Dislike → stay in group until threshold, then switch ──────────────────
  const handleDislike = () => {
    if (!result || !typeClicked || voteState !== "idle") return;

    logActivity({
      category: "decider_vote", deciderItem: result, deciderType: typeClicked,
      vote: "dislike", device: getDevice(), sessionId: getSessionId(),
    });

    if (typeClicked === "food") {
      const newCount = groupDislikeRef.current + 1;

      if (newCount >= DISLIKE_THRESHOLD) {
        // Exhaust current group → switch next roll
        if (activeGroupRef.current) {
          exhaustedGroupsRef.current = [...exhaustedGroupsRef.current, activeGroupRef.current];
          // If all groups exhausted, reset exhausted list
          const totalGroups = getGroupsForRegion(foods, regionFilter, categoryFilter).length;
          if (exhaustedGroupsRef.current.length >= totalGroups) {
            exhaustedGroupsRef.current = [];
          }
        }
        activeGroupRef.current  = null;
        groupDislikeRef.current = 0;
        setGroupLabel(null);
        setGroupDislikeCount(0);
      } else {
        groupDislikeRef.current = newCount;
        setGroupDislikeCount(newCount);
      }
    }

    handleRoll(typeClicked);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-white/40 text-primary shadow-sm">
          <Dices size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold">Trạm Quyết Định</h2>
          <p className="text-foreground/70 text-sm">Chữa bệnh lười suy nghĩ.</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex flex-col gap-4">
        
        {/* Category Filter */}
        <div>
          <p className="text-[11px] text-foreground/45 uppercase tracking-widest font-medium mb-2.5">
            1. Bạn muốn ăn kiểu gì?
          </p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORY_OPTIONS.map((c) => (
              <button key={c.key}
                onClick={() => { setCategoryFilter(c.key); resetGroups(); setResult(null); }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border shadow-sm ${
                  categoryFilter === c.key
                    ? "bg-accent/20 border-accent/50 text-accent"
                    : "bg-white/30 border-white/40 text-foreground/60 hover:bg-white/50 hover:border-white/70 hover:text-foreground"
                }`}>
                <span>{c.emoji}</span>
                <span>{c.label}</span>
                <span className={`text-[10px] rounded-full px-1.5 py-0.5 ml-0.5 ${
                  categoryFilter === c.key ? "bg-accent/20 text-accent" : "bg-white/40 text-foreground/40"
                }`}>{c.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Region Filter */}
        <div>
          <p className="text-[11px] text-foreground/45 uppercase tracking-widest font-medium mb-2.5">
            2. Vùng Tiên cảnh nào đây?
          </p>
          <div className="flex gap-2 flex-wrap">
            {REGION_OPTIONS.map((r) => (
              <button key={r.key}
                onClick={() => { setRegionFilter(r.key); resetGroups(); setResult(null); }}
                disabled={r.count === 0}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border shadow-sm ${
                  r.count === 0 ? "opacity-30 cursor-not-allowed bg-white/10 text-foreground/30 border-white/10" :
                  regionFilter === r.key
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-white/30 border-white/40 text-foreground/60 hover:bg-white/50 hover:border-white/70 hover:text-foreground"
                }`}>
                <span>{r.emoji}</span>
                <span>{r.label}</span>
                <span className={`text-[10px] rounded-full px-1.5 py-0.5 ml-0.5 ${
                  r.count === 0 ? "bg-white/5" :
                  regionFilter === r.key ? "bg-primary/20 text-primary" : "bg-white/40 text-foreground/40"
                }`}>{r.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Roll Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => handleRoll("food")} disabled={loading}
          className="glass border border-white/40 hover:border-white/80 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-colors group shadow-sm">
          <Utensils size={32} className="text-foreground group-hover:scale-110 transition-transform" />
          <span className="font-medium text-foreground/80 group-hover:text-foreground">Hôm nay ăn gì?</span>
          {regionFilter !== "all" && (
            <span className="text-xs text-foreground/45 font-medium">
              {REGION_LABEL[regionFilter]} · {REGION_OPTIONS.find(r => r.key === regionFilter)?.count} món
            </span>
          )}
        </button>
        <button onClick={() => handleRoll("activity")} disabled={loading}
          className="glass border border-white/40 hover:border-white/80 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-colors group shadow-sm">
          <PersonStanding size={32} className="text-primary group-hover:scale-110 transition-transform" />
          <span className="font-medium text-foreground/80 group-hover:text-foreground">Hôm nay làm gì?</span>
          <span className="text-xs text-foreground/45 font-medium">{ACTIVITIES.length} lựa chọn</span>
        </button>
      </div>

      {/* Result Box */}
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
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 w-full">

                {/* Group label indicator */}
                {groupLabel && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-2">
                    <span className="text-xs bg-white/40 border border-white/50 rounded-full px-3 py-1 text-foreground/50 font-medium">
                      {groupLabel}
                    </span>
                    {/* Dislike dots indicator */}
                    {groupDislikeCount > 0 && (
                      <div className="flex gap-1" title={`${groupDislikeCount}/${DISLIKE_THRESHOLD} lần không thích nhóm này`}>
                        {Array.from({ length: DISLIKE_THRESHOLD }).map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            i < groupDislikeCount ? "bg-accent/60" : "bg-foreground/15"
                          }`} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                <p className="text-sm text-foreground/60 uppercase tracking-widest font-medium">
                  {typeClicked === "food" ? "Bạn nên ăn" : "Bạn nên"}
                </p>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{result}</h3>

                {resultDesc && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="text-sm text-foreground/55 italic max-w-xs leading-relaxed">
                    {resultDesc}
                  </motion.p>
                )}

                {/* Vote buttons */}
                {voteState === "idle" && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="flex items-center gap-3 mt-2 flex-wrap justify-center">
                    <p className="text-xs text-foreground/50">Nghe hợp lý không?</p>
                    <button onClick={handleLike}
                      className="flex items-center gap-1.5 bg-white/40 hover:bg-primary/20 border border-white/50 hover:border-primary/30 text-foreground px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm">
                      <ThumbsUp size={14} /> Được!
                    </button>
                    <button onClick={handleDislike}
                      className="flex items-center gap-1.5 bg-white/40 hover:bg-accent/20 border border-white/50 hover:border-accent/30 text-foreground px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm">
                      <ThumbsDown size={14} /> Đổi đi!
                    </button>
                  </motion.div>
                )}
                {voteState === "liked" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-primary font-medium mt-2">
                    ✨ {typeClicked === "food" ? "Chúc bạn ngon miệng!" : "Chúc bạn vui vẻ nhé!"}
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
                <motion.div animate={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ duration: 0.6 }} className="text-5xl">
                  {typeClicked === "food" ? "🍽️" : "🎯"}
                </motion.div>
                <h3 className="font-serif font-bold text-xl text-foreground">Tuyệt vời!</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {typeClicked === "food"
                    ? <><span>Chúc bạn thưởng thức bữa ăn thật vui vẻ nhé 🌸</span><br /><span className="text-foreground/50 text-xs">Ăn ngon, sống khoẻ, vũ trụ yêu bạn!</span></>
                    : <><span>Chúc bạn có một buổi thật vui và ý nghĩa 🌟</span><br /><span className="text-foreground/50 text-xs">Cứ thế mà làm, vũ trụ sẽ sắp xếp hết!</span></>}
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
