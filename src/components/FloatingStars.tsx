"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FloatingStars() {
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    // Chỉ render client-side để tránh hydration mismatch
    const isMobile = window.innerWidth < 768;
    // Tối ưu số lượng sao trên mobile để đỡ hao pin & lag
    const count = isMobile ? 25 : 60;
    
    const newStars = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // vw
      y: Math.random() * 100, // vh
      // Cỡ sao randomize từ 1px đến 3px
      size: Math.random() * 2 + 1, 
      // Vận tốc lơ lửng (duration)
      duration: Math.random() * 30 + 30, // 30s - 60s
      // Thời gian trễ
      delay: Math.random() * 10,
      // Hướng trôi dạt: một số sang trái, một số sang phải
      drift: Math.random() * 10 - 5, 
    }));
    setStars(newStars);
  }, []);

  if (stars.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ 
            y: `${star.y}vh`, 
            x: `${star.x}vw`, 
            opacity: 0,
            scale: 0.5 
          }}
          animate={{
            y: [`${star.y}vh`, `${star.y - 15}vh`],
            x: [`${star.x}vw`, `${star.x + star.drift}vw`],
            opacity: [0, 0.7, 0.7, 0],
            scale: [0.5, 1, 1, 0.5]
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute rounded-full bg-white"
          style={{ 
            width: star.size, 
            height: star.size,
            boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.8)` // Aura phát sáng
          }}
        />
      ))}
      
      {/* Vầng sáng (Nebula) góc màn hình mờ ảo */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
    </div>
  );
}
