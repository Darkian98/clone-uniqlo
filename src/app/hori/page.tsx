
"use client"
import { Vertical } from "@/components/vertical";
import { motion, animate, useMotionValue } from "framer-motion";
import { useState, useRef } from "react";
import { posts } from "@/data/posts"

export default function TikTokHorizontalStable() {
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);

  const nextIndex = (index + 1) % posts.length;
  const prevIndex = (index - 1 + posts.length) % posts.length;

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 50;
    const distance = info.offset.x;
    const velocity = info.velocity.x;

    let newIndex = index;

    if (distance < -threshold || velocity < -500) {
      newIndex = (index + 1) % posts.length;
    } else if (distance > threshold || velocity > 500) {
      newIndex = (index - 1 + posts.length) % posts.length;
    }

    if (newIndex !== index) {
      animate(x, distance < 0 ? -window.innerWidth : window.innerWidth, {
        duration: 0.3,
        ease: "easeOut",
        onComplete: () => {
          setIndex(newIndex);
          x.set(0);
        },
      });
    } else {
      animate(x, 0, {
        duration: 0.2,
        ease: "easeOut",
      });
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-black">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        onDragEnd={handleDragEnd}
        style={{
          x,
          height: "100vh",
          width: "300vw",
          display: "flex",
          position: "absolute",
          left: "-100vw",
          touchAction: "pan-y",
        }}
      >
        {[prevIndex, index, nextIndex].map((i, pos) => {
          return (
            <div
              key={`${i}-${pos}`}
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                color: "white",
                fontWeight: "bold",
                userSelect: "none",
                position: "relative",
              }}
            >
              <div style={{ width: "100%", height: "100%", position: "relative" }}>

                <Vertical posts={posts[i].vertical} />
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Indicadores horizontales */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {posts.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? "bg-white w-6" : "bg-white/50"
              }`}
          />
        ))}
      </div>

      {/* Contador */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full z-10">
        {index + 1} / {posts.length}
      </div>
    </div>
  );
}