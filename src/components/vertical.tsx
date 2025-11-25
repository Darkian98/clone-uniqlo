"use client"
import { motion, animate, useMotionValue } from "framer-motion";
import { useState, useRef, FC, useEffect } from "react";

interface IVertical {
    id: number,
    color: string,
    text: string
}

export const Vertical: FC<{ posts: Array<any> }> = ({ posts }) => {
    const [index, setIndex] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);
    const [innerHeightSafe, setInnerHeightSafe] = useState(0);
    const y = useMotionValue(0);
    const animating = useRef(false);

    // Calcular altura real del viewport
    useEffect(() => {
        const updateHeight = () => {
            setViewportHeight(window.innerHeight);
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);

        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    const nextIndex = (index + 1) % posts.length;
    const prevIndex = (index - 1 + posts.length) % posts.length;

    const handleDragEnd = (_: any, info: any) => {
        if (animating.current) return;

        const distance = info.offset.y;
        const threshold = 120;

        if (distance < -threshold) {
            slide("next");
        } else if (distance > threshold) {
            slide("prev");
        } else {
            animate(y, 0, { duration: 0.25, ease: "easeOut" });
        }
    };

    const slide = (dir: "next" | "prev") => {
        animating.current = true;
        const offset = dir === "next" ? -viewportHeight : viewportHeight;

        animate(y, offset, {
            duration: 0.3,
            ease: "easeOut",
            onComplete: () => {
                requestAnimationFrame(() => {
                    setIndex((i) =>
                        dir === "next" ? (i + 1) % posts.length : (i - 1 + posts.length) % posts.length
                    );
                    y.set(0);
                    animating.current = false;
                });
            },
        });
    };

    useEffect(() => {
        setViewportHeight(window.innerHeight);
    }, []);

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ height: viewportHeight || '100vh' }}
        >
            <motion.div
                drag="y"
                dragElastic={0.1}
                dragDirectionLock
                onDragEnd={handleDragEnd}
                style={{
                    y,
                    height: (viewportHeight || innerHeightSafe) * 3,
                    position: "absolute",
                    top: -(viewportHeight || innerHeightSafe),
                    width: "100%",
                    willChange: "transform",
                }}
            >
                {[prevIndex, index, nextIndex].map((i) => (
                    <div
                        key={i}
                        style={{
                            height: viewportHeight || '100vh',
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                        }}
                    >
                        <HandlerResource type={posts[i].resource.type} {...posts[i].resource} />
                    </div>
                ))}
            </motion.div>

            {/* Indicadores verticales */}
            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2 z-20">
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
            alt=""
            loading="eager"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
            }}
        />
    );
}

const VideoRender = ({ url }: any) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.src = url;
            videoRef.current.load();
            videoRef.current.play().catch(() => {
                // Ignorar errores de autoplay
            });
        }
    }, [url]);

    return (
        <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
                backgroundColor: "black",
            }}
        />
    );
}

const TextRender = ({ color }: any) => {
    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: color,
                zIndex: 0,
            }}
        />
    );
}