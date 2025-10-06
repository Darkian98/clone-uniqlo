"use client"
import { motion, animate, useMotionValue } from "framer-motion";
import { useState } from "react";

const posts = [
  { id: 1, color: "#1abc9c", text: "🎵 Video 1" },
  { id: 2, color: "#3498db", text: "🔥 Video 2" },
  { id: 3, color: "#9b59b6", text: "😎 Video 3" },
];

export default function TikTokHorizontalStable() {
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);

  const nextIndex = (index + 1) % posts.length;
  const prevIndex = (index - 1 + posts.length) % posts.length;

  const handleDragEnd = (_: any, info: any) => {
    const threshold = window.innerWidth / 4; // mínimo 25% del ancho
    const distance = info.offset.x;

    let newIndex = index;

    if (distance < -threshold) newIndex = (index + 1) % posts.length;
    else if (distance > threshold) newIndex = (index - 1 + posts.length) % posts.length;

    animate(x, newIndex === index ? 0 : distance < 0 ? -window.innerWidth : window.innerWidth, {
      type: "spring",
      stiffness: 300,
      damping: 25,
      onComplete: () => {
        setIndex(newIndex);
        x.set(0);
      },
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        style={{
          x,
          height: "100vh",
          width: "300vw",
          display: "flex",
          position: "absolute",
          left: "-100vw",
        }}
      >
        {/* Prev */}
        <div
          style={{
            width: "100vw",
            height: "100vh",
            background: posts[prevIndex].color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            color: "white",
          }}
        >
          {posts[prevIndex].text}
        </div>

        {/* Current */}
        <div
          style={{
            width: "100vw",
            height: "100vh",
            background: posts[index].color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            color: "white",
          }}
        >
          {posts[index].text}
        </div>

        {/* Next */}
        <div
          style={{
            width: "100vw",
            height: "100vh",
            background: posts[nextIndex].color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            color: "white",
          }}
        >
          {posts[nextIndex].text}
        </div>
      </motion.div>

      {/* Indicadores */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {posts.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}