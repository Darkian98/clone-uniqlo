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

export const Vertical: FC<{ posts: Array<any> }> = ({ posts }) => {
    const [index, setIndex] = useState(0);
    const y = useMotionValue(0);
    const animating = useRef(false);

    const nextIndex = (index + 1) % posts.length;
    const prevIndex = (index - 1 + posts.length) % posts.length;

    const handleDragEnd = (_: any, info: any) => {
        if (animating.current) return;

        const distance = info.offset.y;
        const threshold = 120;

        if (distance < -threshold) {
            slide("next");  // arrastraste hacia arriba suficiente
        } else if (distance > threshold) {
            slide("prev");  // arrastraste hacia abajo suficiente
        } else {
            // volver suavemente al centro
            animate(y, 0, { duration: 0.25, ease: "easeOut" });
        }
    };

    const slide = (dir: "next" | "prev") => {
        animating.current = true;
        const offset = dir === "next" ? -window.innerHeight : window.innerHeight;

        animate(y, offset, {
            type: "tween", 
            duration: 0.3,
            ease: [0.22, 0.61, 0.36, 1],
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
                // dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0}
                dragDirectionLock 
                onDragEnd={handleDragEnd}
                style={{
                    y,
                    height: "100vh",
                    position: "absolute",
                    top: "-100vh",
                    width: "100%",
                }}
            >
                {[prevIndex, index, nextIndex].map((i, pos) => (
                    <div
                        key={`${i}`}
                        style={{
                            height: "100vh",     // ← CORRECCIÓN
                            position: "relative", // ← NECESARIO
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <HandlerResource type={posts[i].resource.type} {...posts[i].resource} />
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

type ResourceType = "img" | "video" | "text";

interface Resource {
    type: ResourceType;
    [key: string]: any;
}

const HandlerResource: FC<Resource> = (resource) => {
    const components: Record<ResourceType, React.FC<any>> = {
        img: ImgRender,
        video: VideoRender,
        text: TextRender
    };
    const Component = components[resource.type];

    return <Component {...resource} />;
};


const ImgRender = ({ url }: any) => {
    return (
        <img
            src={url}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover"
            }}
        />
    );
}

const VideoRender = ({ url }: any) => {
    return (
        <video
            key={url}
            src={url}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
            }}
        />
    );
}

const TextRender = ({ color }: any) => {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: color,
            }}
        />
    );
}

const Slide = ({ children }: any) => (
    <div style={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative"
    }}>
        {children}
    </div>
);