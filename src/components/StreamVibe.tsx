"use client";

import { useState, useEffect } from "react";
import { Music, CloudRain, Sun, Cloud, Wind, Play, Pause, SkipForward } from "lucide-react";
import { motion } from "framer-motion";

const VIBES = [
  {
    weather: "Trời đang mưa 🌧️",
    desc: "Nghe chút Lana Del Rey vỗ về tâm hồn nhé.",
    song: "Summertime Sadness",
    artist: "Lana Del Rey",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
    animeArt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
  },
  {
    weather: "Trời đầy nắng ☀️",
    desc: "Năng lượng rực rỡ, bật dải pop sôi động thôi!",
    song: "Super Shy",
    artist: "NewJeans",
    cover: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=400&q=80",
    animeArt: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
  },
  {
    weather: "Trời se lạnh ❄️",
    desc: "Một cốc cacao ấm và tí Lofi hiphop thì sao nhỉ?",
    song: "Coffee Shop Vibes",
    artist: "Lofi Girl",
    cover: "https://images.unsplash.com/photo-1497911270199-1bd1e3ed938e?w=400&q=80",
    animeArt: "https://images.unsplash.com/photo-1516280440502-dfda6cb0c538?w=800&q=80",
  },
  {
    weather: "Trời nhiều mây ☁️",
    desc: "Mây giăng lối, nghe Indie nhè nhẹ xoa dịu đi.",
    song: "Chuyện Rằng",
    artist: "Thịnh Suy",
    cover: "https://images.unsplash.com/photo-1456086272160-b223af04bd1b?w=400&q=80",
    animeArt: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80",
  }
];

export default function StreamVibe() {
  const [currentVibe, setCurrentVibe] = useState(VIBES[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const randomVibe = VIBES[Math.floor(Math.random() * VIBES.length)];
    setCurrentVibe(randomVibe);
  }, []);

  const handleShuffle = () => {
    const newVibe = VIBES[Math.floor(Math.random() * VIBES.length)];
    setCurrentVibe(newVibe);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-white/40 text-primary shadow-sm">
          <Music size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold">Dòng Cảm Xúc</h2>
          <p className="text-foreground/70 text-sm">Giai điệu trôi theo thời tiết.</p>
        </div>
      </div>

      <div className="relative rounded-[2rem] overflow-hidden aspect-video mb-6 block md:hidden lg:block border border-white/40 group shadow-sm bg-white/20">
        <img 
          src={currentVibe.animeArt} 
          alt="Aesthetic background" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-lg font-serif font-bold text-foreground mb-1 drop-shadow-sm">{currentVibe.weather}</h3>
          <p className="text-foreground/90 font-medium text-sm drop-shadow-sm">{currentVibe.desc}</p>
        </div>
      </div>

      <div className="glass p-4 rounded-[2rem] flex items-center gap-4 relative overflow-hidden">
        {/* Progress Bar Background */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: isPlaying ? "100%" : "30%" }}
            transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          />
        </div>

        <img 
          src={currentVibe.cover} 
          alt="Album Cover" 
          className="w-16 h-16 rounded-2xl object-cover shadow-sm opacity-90"
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-bold truncate text-foreground">{currentVibe.song}</h4>
          <p className="text-sm text-foreground/70 font-medium truncate">{currentVibe.artist}</p>
        </div>

        <div className="flex items-center gap-2 pr-2 relative z-10">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary-glow flex items-center justify-center text-white transition-colors shadow-sm"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={handleShuffle}
            className="w-10 h-10 rounded-full hover:bg-white/40 flex items-center justify-center text-foreground transition-colors"
          >
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
