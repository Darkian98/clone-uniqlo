"use client"
import { Vertical } from "@/components/vertical";
import { motion, animate, useMotionValue } from "framer-motion";
import { useState, useRef } from "react";

const posts = [
  { id: 1, color: "#1abc9c", text: "🎵 Video 1" },
  { id: 2, color: "#3498db", text: "🔥 Video 2" },
  { id: 3, color: "#9b59b6", text: "😎 Video 3" },
];

export default function TikTokScrollStable() {
  const [index, setIndex] = useState(0);
  const y = useMotionValue(0);
  const animating = useRef(false);

  const nextIndex = (index + 1) % posts.length;
  const prevIndex = (index - 1 + posts.length) % posts.length;

  const handleDragEnd = (_: any, info: any) => {
    if (animating.current) return; // evita múltiples animaciones
    const threshold = 100;
    const distance = info.offset.y;

    if (distance < -threshold) {
      slide("next")
    } else if (distance > threshold) {
      slide("prev");
    } else {
      animate(y, 0, { type: "spring", stiffness: 300 });
    }

  };

  const slide = (dir: "next" | "prev") => {
    animating.current = true;
    const offset = dir === "next" ? -window.innerHeight : window.innerHeight;

    animate(y, offset, {
      duration: 0.4,
      ease: "easeInOut",
      onComplete: () => {
        setIndex((i) =>
          dir === "next" ? (i + 1) % posts.length : (i - 1 + posts.length) % posts.length
        );
        y.set(0);
        animating.current = false;
      },
    });
  };

  return (
   <Vertical />
  );
}