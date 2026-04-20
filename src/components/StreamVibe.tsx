"use client";

import { useState, useEffect } from "react";
import { Music, SkipForward, ExternalLink, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logActivity } from "@/app/tracking-actions";
import { getSessionId, getDevice } from "@/lib/session";

type Mood = "buồn" | "vui" | "thư giãn" | "năng lượng" | "cô đơn" | null;

const MOOD_OPTIONS: { key: Mood; emoji: string; label: string }[] = [
  { key: "buồn", emoji: "🌧️", label: "Hơi buồn buồn" },
  { key: "vui", emoji: "☀️", label: "Đang vui lắm" },
  { key: "thư giãn", emoji: "🍃", label: "Muốn thư giãn" },
  { key: "năng lượng", emoji: "⚡", label: "Đầy năng lượng" },
  { key: "cô đơn", emoji: "🌙", label: "Một mình thôi" },
];

const VIBES: Record<NonNullable<Mood>, {
  weather: string;
  desc: string;
  song: string;
  artist: string;
  cover: string;
  animeArt: string;
  ytMusicId: string;
  youtubeId: string;
}[]> = {
  buồn: [
    {
      weather: "Trời đang mưa 🌧️",
      desc: "Nghe chút Lana Del Rey vỗ về tâm hồn nhé.",
      song: "Summertime Sadness",
      artist: "Lana Del Rey",
      cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
      animeArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
      ytMusicId: "TdrL3QxjyVw",
      youtubeId: "TdrL3QxjyVw",
    },
    {
      weather: "Trời u ám 🌑",
      desc: "Để Chuyện Rằng kể thay nỗi lòng.",
      song: "Chuyện Rằng",
      artist: "Thịnh Suy",
      cover: "https://images.unsplash.com/photo-1456086272160-b223af04bd1b?w=400&q=80",
      animeArt: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80",
      ytMusicId: "g_B0VYNF4bI",
      youtubeId: "g_B0VYNF4bI",
    },
  ],
  vui: [
    {
      weather: "Trời đầy nắng ☀️",
      desc: "Năng lượng rực rỡ, bật dải pop sôi động thôi!",
      song: "Super Shy",
      artist: "NewJeans",
      cover: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=400&q=80",
      animeArt: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
      ytMusicId: "IPMPKb7_5u8",
      youtubeId: "IPMPKb7_5u8",
    },
    {
      weather: "Sắc màu rực rỡ 🌈",
      desc: "Dancefloor trong đầu mình đang rộn ràng lắm.",
      song: "Hype Boy",
      artist: "NewJeans",
      cover: "https://images.unsplash.com/photo-1501386761578-eaa54b9bcf69?w=400&q=80",
      animeArt: "https://images.unsplash.com/photo-1549122728-f519709caa9c?w=800&q=80",
      ytMusicId: "H2HcMDDzSqs",
      youtubeId: "H2HcMDDzSqs",
    },
  ],
  "thư giãn": [
    {
      weather: "Trời se lạnh ❄️",
      desc: "Một cốc cacao ấm và tí Lofi hiphop thì sao nhỉ?",
      song: "Snowfall",
      artist: "Øneheart & reidenshi",
      cover: "https://images.unsplash.com/photo-1497911270199-1bd1e3ed938e?w=400&q=80",
      animeArt: "https://images.unsplash.com/photo-1516280440502-dfda6cb0c538?w=800&q=80",
      ytMusicId: "kOhMsF7fLFM",
      youtubeId: "kOhMsF7fLFM",
    },
    {
      weather: "Chiều tà yên tĩnh 🌅",
      desc: "Nhạc không lời cho tâm trí được nghỉ ngơi.",
      song: "River Flows In You",
      artist: "Yiruma",
      cover: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&q=80",
      animeArt: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
      ytMusicId: "7maJOI3QMu0",
      youtubeId: "7maJOI3QMu0",
    },
  ],
  "năng lượng": [
    {
      weather: "Đang bùng cháy 🔥",
      desc: "Full throttle. Không phanh. Bật to lên nào!",
      song: "LALALA",
      artist: "Y2K & bbno$",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
      animeArt: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80",
      ytMusicId: "bqYKJH2yHLs",
      youtubeId: "bqYKJH2yHLs",
    },
    {
      weather: "Giờ G đã đến ⚡",
      desc: "Thắng mọi thứ ngày hôm nay. Bắt đầu thôi.",
      song: "Superhero",
      artist: "Metro Boomin",
      cover: "https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?w=400&q=80",
      animeArt: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80",
      ytMusicId: "fFVcpBLAuKo",
      youtubeId: "fFVcpBLAuKo",
    },
  ],
  "cô đơn": [
    {
      weather: "Đêm khuya yên tĩnh 🌙",
      desc: "Chỉ có mình mày và bản nhạc này thôi.",
      song: "Heather",
      artist: "Conan Gray",
      cover: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80",
      animeArt: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&q=80",
      ytMusicId: "D-r-hbQiDtA",
      youtubeId: "D-r-hbQiDtA",
    },
    {
      weather: "Sáng sớm một mình ☁️",
      desc: "Khoảng lặng trước khi ngày mới bắt đầu.",
      song: "The Night We Met",
      artist: "Lord Huron",
      cover: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80",
      animeArt: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
      ytMusicId: "KtlgYxa6BMU",
      youtubeId: "KtlgYxa6BMU",
    },
  ],
};

export default function StreamVibe() {
  const [mood, setMood] = useState<Mood>(null);
  const [currentVibe, setCurrentVibe] = useState(VIBES["thư giãn"][0]);
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  useEffect(() => {
    if (mood) {
      const vibes = VIBES[mood];
      const chosen = vibes[Math.floor(Math.random() * vibes.length)];
      setCurrentVibe(chosen);
      // Fire-and-forget logging
      logActivity({
        category: "music",
        mood,
        song: chosen.song,
        artist: chosen.artist,
        device: getDevice(),
        sessionId: getSessionId(),
      });
    }
  }, [mood]);

  const handleShuffle = () => {
    if (!mood) return;
    const vibes = VIBES[mood];
    const others = vibes.filter(v => v.song !== currentVibe.song);
    const pool = others.length > 0 ? others : vibes;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setCurrentVibe(chosen);
    logActivity({
      category: "music",
      mood,
      song: chosen.song,
      artist: chosen.artist,
      device: getDevice(),
      sessionId: getSessionId(),
    });
  };

  const openYouTubeMusic = () => {
    window.open(`https://music.youtube.com/watch?v=${currentVibe.ytMusicId}`, "_blank");
    setShowLaunchModal(false);
  };

  const openYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${currentVibe.youtubeId}`, "_blank");
    setShowLaunchModal(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-white/40 text-primary shadow-sm">
          <Music size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold">Dòng Cảm Xúc</h2>
          <p className="text-foreground/70 text-sm">Giai điệu trôi theo tâm trạng.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!mood ? (
          <motion.div
            key="mood-select"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4"
          >
            <p className="text-center text-foreground/80 font-medium mb-2">
              Tâm trạng của cậu lúc này thế nào? 🌿
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMood(m.key)}
                  className="glass border border-white/50 hover:border-primary/40 hover:bg-white/50 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all group shadow-sm"
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground text-center">{m.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="vibe-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4"
          >
            <button
              onClick={() => setMood(null)}
              className="flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft size={12} /> Đổi tâm trạng
            </button>

            <div className="relative rounded-[2rem] overflow-hidden aspect-video border border-white/40 group shadow-sm bg-white/20">
              <img
                src={currentVibe.animeArt}
                alt="Aesthetic background"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="text-lg font-serif font-bold text-foreground mb-1 drop-shadow-sm">{currentVibe.weather}</h3>
                <p className="text-foreground/90 font-medium text-sm drop-shadow-sm">{currentVibe.desc}</p>
              </div>
            </div>

            <div className="glass p-4 rounded-[2rem] flex items-center gap-4 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "30%" }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 50, ease: "linear", repeat: Infinity }}
                />
              </div>
              <img
                src={currentVibe.cover}
                alt="Album Cover"
                className="w-16 h-16 rounded-2xl object-cover shadow-sm opacity-90 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold truncate text-foreground">{currentVibe.song}</h4>
                <p className="text-sm text-foreground/70 font-medium truncate">{currentVibe.artist}</p>
              </div>
              <div className="flex items-center gap-2 pr-2 relative z-10 flex-shrink-0">
                <button
                  onClick={() => setShowLaunchModal(true)}
                  className="w-12 h-12 rounded-full bg-primary hover:bg-primary-glow flex items-center justify-center text-white transition-colors shadow-sm text-base"
                >▶</button>
                <button
                  onClick={handleShuffle}
                  className="w-10 h-10 rounded-full hover:bg-white/40 flex items-center justify-center text-foreground transition-colors"
                >
                  <SkipForward size={18} fill="currentColor" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launch Modal */}
      <AnimatePresence>
        {showLaunchModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={() => setShowLaunchModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-sm"
            >
              <div className="rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-[var(--background)]">
                <div className="p-6 flex flex-col gap-1 items-center text-center border-b border-white/30">
                  <p className="text-xs text-foreground/50 uppercase tracking-widest font-medium">Nghe ngay</p>
                  <h3 className="font-serif font-bold text-xl text-foreground mt-1">{currentVibe.song}</h3>
                  <p className="text-sm text-foreground/60">{currentVibe.artist}</p>
                </div>
                <button onClick={openYouTubeMusic} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/40 transition-colors border-b border-white/20">
                  <span className="text-2xl">🎵</span>
                  <div className="text-left">
                    <p className="font-bold text-foreground text-sm">YouTube Music</p>
                    <p className="text-xs text-foreground/55">Chất lượng cao · Có tài khoản Google</p>
                  </div>
                  <ExternalLink size={14} className="ml-auto text-foreground/30" />
                </button>
                <button onClick={openYouTube} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/40 transition-colors">
                  <span className="text-2xl">▶️</span>
                  <div className="text-left">
                    <p className="font-bold text-foreground text-sm">YouTube</p>
                    <p className="text-xs text-foreground/55">Miễn phí · Không cần đăng nhập</p>
                  </div>
                  <ExternalLink size={14} className="ml-auto text-foreground/30" />
                </button>
                <div className="p-4">
                  <button onClick={() => setShowLaunchModal(false)} className="w-full py-2.5 rounded-2xl text-sm text-foreground/60 hover:text-foreground hover:bg-white/30 transition-colors font-medium">
                    Thôi, để sau
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
