"use client"
import { Vertical } from "@/components/vertical";
import { motion, animate, useMotionValue } from "framer-motion";
import { useState, useRef } from "react";
import { posts } from "@/data/posts"

export default function TikTokHorizontalStable() {
  const [index, setIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const x = useMotionValue(0);
  const animating = useRef(false);

  const nextIndex = (index + 1) % posts.length;
  const prevIndex = (index - 1 + posts.length) % posts.length;

  const handleDragEnd = (_: any, info: any) => {
    if (animating.current) return;
    const threshold = 60;
    const distance = info.offset.x;
    const velocity = info.velocity.x;

    let newIndex = index;

    if (distance < -threshold || velocity < -500) {
      newIndex = (index + 1) % posts.length;
    } else if (distance > threshold || velocity > 500) {
      newIndex = (index - 1 + posts.length) % posts.length;
    }

    if (newIndex !== index) {
      animating.current = true;
      animate(x, distance < 0 ? -window.innerWidth : window.innerWidth, {
        duration: 0.3,
        ease: "easeOut",
        onComplete: () => {
          setIndex(newIndex);
          x.set(0);
          animating.current = false;
        },
      });
    } else {
      animate(x, 0, {
        duration: 0.2,
        ease: "easeOut",
      });
    }
  };

  const goToIndex = (targetIndex: number) => {
    if (targetIndex === index || animating.current) return;

    animating.current = true;
    setIsNavigating(true);
    
    const direction = targetIndex > index ? -1 : 1;
    const distance = Math.abs(targetIndex - index);

    animate(x, direction * window.innerWidth * distance, {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
      onComplete: () => {
        setIndex(targetIndex);
        x.set(0);
        animating.current = false;
        setIsNavigating(false);
      },
    });
  };

  // Renderizar todos los slides durante navegación por click, solo 3 durante drag
  const slidesToRender = isNavigating 
    ? posts.map((_, i) => i)
    : [prevIndex, index, nextIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-black">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        onDragEnd={handleDragEnd}
        dragDirectionLock 
        style={{
          x,
          height: "100vh",
          width: isNavigating ? `${posts.length * 100}vw` : "300vw",
          display: "flex",
          position: "absolute",
          left: isNavigating ? "0" : "-100vw",
          touchAction: "pan-y",
        }}
      >
        {slidesToRender.map((i) => {
          const offset = isNavigating ? i : (i === prevIndex ? 0 : i === index ? 1 : 2);
          
          return (
            <div
              key={i}
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
                transform: isNavigating ? `translateX(${-index * 100}vw)` : "none",
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/10 p-2 rounded-lg">
        {posts.map((post, i) => (
          <div
            key={i}
            onClick={() => goToIndex(i)}
            className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === index ? "bg-white w-6" : "bg-white/50"
              }`}
            />
            <p className="text-white text-xs">{post.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}