"use client"
import { motion, animate, useMotionValue } from "framer-motion";
import { useState, useRef, FC } from "react";

// const posts = [
//     { id: 1, color: "#e74c3c", text: "📱 Vertical 1" },
//     { id: 2, color: "#f39c12", text: "⭐ Vertical 2" },
//     { id: 3, color: "#2ecc71", text: "💚 Vertical 3" },
// ];

interface IVertical {
    id: number,
    color: string,
    text: string
}

export const Vertical: FC<{ posts: Array<IVertical> }> = ({ posts }) => {
    const [index, setIndex] = useState(0);
    const y = useMotionValue(0);
    const animating = useRef(false);

    const nextIndex = (index + 1) % posts.length;
    const prevIndex = (index - 1 + posts.length) % posts.length;

    const handleDragEnd = (_: any, info: any) => {
        if (animating.current) return;
        const threshold = 100;
        const distance = info.offset.y;

        if (distance < -threshold) {
            slide("next");
        } else if (distance > threshold) {
            slide("prev");
        } else {
            animate(y, 0, { duration: 0.2, ease: "easeOut" });
        }
    };

    const slide = (dir: "next" | "prev") => {
        animating.current = true;
        const offset = dir === "next" ? -window.innerHeight : window.innerHeight;

        animate(y, offset, {
            duration: 0.3,
            ease: "easeOut",
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
        <div className="relative h-full w-full overflow-hidden">
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                style={{
                    y,
                    height: "300%",
                    position: "absolute",
                    top: "-100%",
                    width: "100%",
                }}
            >
                {[prevIndex, index, nextIndex].map((i, pos) => (
                    <div
                        key={`${i}-${pos}`}
                        style={{
                            height: "33.333%",
                            background: posts[i].color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                        }}
                    >
                        {posts[i].text}
                    </div>
                ))}
            </motion.div>

            {/* Indicadores verticales */}
            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2">
                {posts.map((_, i) => (
                    <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${i === index ? "h-6 bg-white" : "h-2 bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}