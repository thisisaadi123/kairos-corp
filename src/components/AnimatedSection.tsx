"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
    motion,
    useInView,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
    useMotionTemplate,
    MotionValue,
} from "framer-motion";

/* =====================================================================
   ANIMATED SECTION — scroll-triggered container
   ===================================================================== */

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right" | "scale" | "fade";
    stagger?: boolean;
}

const directionMap = {
    up: { y: 60, opacity: 0 },
    left: { x: -60, opacity: 0 },
    right: { x: 60, opacity: 0 },
    scale: { scale: 0.92, opacity: 0 },
    fade: { opacity: 0 },
};

export default function AnimatedSection({
    children,
    className,
    delay = 0,
    direction = "up",
}: AnimatedSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={directionMap[direction]}
            animate={isInView ? { x: 0, y: 0, scale: 1, opacity: 1 } : directionMap[direction]}
            transition={{
                duration: 0.85,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            {children}
        </motion.div>
    );
}

/* =====================================================================
   TEXT REVEAL — word-by-word scroll reveal
   ===================================================================== */

export function TextReveal({
    children,
    className,
    as: Tag = "p",
    delay = 0,
}: {
    children: string;
    className?: string;
    as?: "p" | "h1" | "h2" | "h3" | "span";
    delay?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-40px" });
    const words = children.split(" ");

    return (
        <Tag ref={ref} className={className} style={{ overflow: "hidden" }}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    style={{ display: "inline-block", marginRight: "0.28em" }}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{
                        duration: 0.6,
                        delay: delay + i * 0.04,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </Tag>
    );
}

/* =====================================================================
   SCROLL PARALLAX — moves element based on scroll
   ===================================================================== */

export function ScrollParallax({
    children,
    className,
    speed = 0.2,
    direction = "up",
}: {
    children: React.ReactNode;
    className?: string;
    speed?: number;
    direction?: "up" | "down";
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const factor = direction === "up" ? -1 : 1;
    const y = useTransform(scrollYProgress, [0, 1], [factor * 100 * speed, factor * -100 * speed]);

    return (
        <motion.div ref={ref} style={{ y }} className={className}>
            {children}
        </motion.div>
    );
}

/* =====================================================================
   SCROLL SCALE — scales up as it enters viewport
   ===================================================================== */

export function ScrollScale({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);

    return (
        <motion.div ref={ref} style={{ scale, opacity }} className={className}>
            {children}
        </motion.div>
    );
}

/* =====================================================================
   NUMBER TICKER — smooth animated counter with spring physics
   ===================================================================== */

export function NumberTicker({
    value,
    suffix = "",
    prefix = "",
    className,
    duration = 2,
}: {
    value: number;
    suffix?: string;
    prefix?: string;
    className?: string;
    duration?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const motionValue = useMotionValue(0);
    const spring = useSpring(motionValue, { duration: duration * 1000 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (isInView) motionValue.set(value);
    }, [isInView, motionValue, value]);

    useEffect(() => {
        const unsub = spring.on("change", (v: number) => setDisplay(Math.round(v)));
        return unsub;
    }, [spring]);

    return (
        <span ref={ref} className={className}>
            {prefix}{display}{suffix}
        </span>
    );
}

/* =====================================================================
   CHARACTER REVEAL — individual letter animation (Apple-style)
   ===================================================================== */

export function CharacterReveal({
    children,
    className,
    delay = 0,
    staggerSpeed = 0.02,
}: {
    children: string;
    className?: string;
    delay?: number;
    staggerSpeed?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-20px" });
    const chars = children.split("");

    return (
        <span ref={ref} className={className} aria-label={children}>
            {chars.map((char, i) => (
                <motion.span
                    key={i}
                    style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
                    initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                    animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * staggerSpeed,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
}

/* =====================================================================
   MAGNETIC HOVER — element follows cursor on hover
   ===================================================================== */

export function MagneticHover({
    children,
    className,
    strength = 0.3,
}: {
    children: React.ReactNode;
    className?: string;
    strength?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 200 };
    const sx = useSpring(x, springConfig);
    const sy = useSpring(y, springConfig);

    const handleMouse = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        x.set((e.clientX - cx) * strength);
        y.set((e.clientY - cy) * strength);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x: sx, y: sy }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* =====================================================================
   SPOTLIGHT CARD — radial spotlight follows cursor on hover
   ===================================================================== */

export function SpotlightCard({
    children,
    className,
    spotlightColor = "rgba(124, 58, 237, 0.08)",
}: {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    }, [mouseX, mouseY]);

    const background = useMotionTemplate`radial-gradient(
        350px circle at ${mouseX}px ${mouseY}px,
        ${spotlightColor},
        transparent 80%
    )`;

    return (
        <div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: "relative", overflow: "hidden" }}
        >
            <motion.div
                style={{
                    position: "absolute",
                    inset: 0,
                    background,
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none",
                    zIndex: 0,
                    borderRadius: "inherit",
                }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
                {children}
            </div>
        </div>
    );
}

/* =====================================================================
   AURORA BACKGROUND — animated gradient mesh
   ===================================================================== */

export function AuroraBackground({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className={className} style={{ position: "relative", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    inset: "-50%",
                    background: `
                        radial-gradient(ellipse 80% 60% at 20% 30%, rgba(124, 58, 237, 0.12), transparent),
                        radial-gradient(ellipse 60% 80% at 80% 20%, rgba(239, 64, 96, 0.08), transparent),
                        radial-gradient(ellipse 70% 50% at 60% 80%, rgba(5, 150, 105, 0.08), transparent),
                        radial-gradient(ellipse 50% 70% at 30% 70%, rgba(217, 119, 6, 0.06), transparent)
                    `,
                    backgroundSize: "200% 200%",
                    animation: "aurora 20s ease-in-out infinite",
                    pointerEvents: "none",
                }}
            />
            {children}
        </div>
    );
}

/* =====================================================================
   FLOATING PARTICLES — ambient floating dots
   ===================================================================== */

export function FloatingParticles({
    count = 20,
    className,
    colors = ["var(--purple)", "var(--red)", "var(--green)", "var(--yellow)"],
}: {
    count?: number;
    className?: string;
    colors?: string[];
}) {
    const particles = Array.from({ length: count }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
        color: colors[i % colors.length],
    }));

    return (
        <div
            className={className}
            style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
            }}
        >
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    style={{
                        position: "absolute",
                        width: p.size,
                        height: p.size,
                        borderRadius: "50%",
                        background: p.color,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        opacity: 0.2,
                    }}
                    animate={{
                        y: [0, -30, 10, -20, 0],
                        x: [0, 15, -10, 5, 0],
                        opacity: [0.15, 0.3, 0.15, 0.25, 0.15],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

/* =====================================================================
   ANIMATED GRADIENT BORDER — rotating gradient around an element
   ===================================================================== */

export function AnimatedGradientBorder({
    children,
    className,
    borderWidth = 2,
    borderRadius = 28,
}: {
    children: React.ReactNode;
    className?: string;
    borderWidth?: number;
    borderRadius?: number;
}) {
    return (
        <div
            className={className}
            style={{
                position: "relative",
                borderRadius,
                padding: borderWidth,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius,
                    background: "linear-gradient(135deg, var(--purple), var(--red), var(--yellow), var(--green), var(--purple))",
                    backgroundSize: "300% 300%",
                    animation: "aurora 4s ease-in-out infinite",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: borderWidth,
                }}
            />
            <div style={{ position: "relative", borderRadius: borderRadius - borderWidth }}>
                {children}
            </div>
        </div>
    );
}

/* =====================================================================
   SCROLL PROGRESS LINE — shows scroll progress
   ===================================================================== */

export function ScrollProgressLine({ color = "var(--purple)" }: { color?: string }) {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <motion.div
            style={{
                scaleX,
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, var(--purple), var(--red), var(--yellow), var(--green))`,
                transformOrigin: "left",
                zIndex: 9999,
            }}
        />
    );
}

/* =====================================================================
   GLOWING ORB — animated floating gradient sphere
   ===================================================================== */

export function GlowingOrb({
    color = "var(--purple)",
    size = 400,
    className,
    style,
}: {
    color?: string;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <motion.div
            className={className}
            style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color}, transparent 70%)`,
                filter: "blur(60px)",
                pointerEvents: "none",
                ...style,
            }}
            animate={{
                scale: [1, 1.1, 0.95, 1.05, 1],
                x: [0, 30, -20, 15, 0],
                y: [0, -25, 15, -10, 0],
            }}
            transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
}

/* =====================================================================
   BLUR FADE IN — blur→sharp + fade-up on scroll (FocusU-style)
   ===================================================================== */

export function BlurFadeIn({
    children,
    className,
    delay = 0,
    duration = 0.7,
    yOffset = 40,
    blur = 12,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    yOffset?: number;
    blur?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: yOffset, filter: `blur(${blur}px)` }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            {children}
        </motion.div>
    );
}

/* =====================================================================
   STAGGER CONTAINER + ITEM — sequential child animations
   ===================================================================== */

export function StaggerContainer({
    children,
    className,
    staggerDelay = 0.08,
    delayChildren = 0.15,
}: {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
    delayChildren?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: staggerDelay, delayChildren } },
            }}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 50, filter: "blur(8px)" },
                visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

/* =====================================================================
   TILT CARD — 3D perspective tilt following cursor on hover
   ===================================================================== */

export function TiltCard({
    children,
    className,
    tiltAmount = 8,
    scale = 1.02,
    glare = true,
}: {
    children: React.ReactNode;
    className?: string;
    tiltAmount?: number;
    scale?: number;
    glare?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const cardScale = useMotionValue(1);
    const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const springConfig = { damping: 20, stiffness: 300 };
    const sRotateX = useSpring(rotateX, springConfig);
    const sRotateY = useSpring(rotateY, springConfig);
    const sScale = useSpring(cardScale, springConfig);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const pctX = (e.clientX - centerX) / (rect.width / 2);
        const pctY = (e.clientY - centerY) / (rect.height / 2);
        rotateX.set(-pctY * tiltAmount);
        rotateY.set(pctX * tiltAmount);
        setGlarePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, [rotateX, rotateY, tiltAmount]);

    const handleMouseEnter = () => {
        setIsHovered(true);
        cardScale.set(scale);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
        rotateX.set(0);
        rotateY.set(0);
        cardScale.set(1);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: sRotateX,
                rotateY: sRotateY,
                scale: sScale,
                transformStyle: "preserve-3d",
                perspective: 1000,
            }}
        >
            {children}
            {glare && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "inherit",
                        pointerEvents: "none",
                        background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15), transparent 60%)`,
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        zIndex: 2,
                    }}
                />
            )}
        </motion.div>
    );
}

/* =====================================================================
   INFINITE SLIDER — smooth infinite horizontal scroll
   ===================================================================== */

export function InfiniteSlider({
    children,
    className,
    speed = 30,
    direction = "left",
    pauseOnHover = true,
}: {
    children: React.ReactNode;
    className?: string;
    speed?: number;
    direction?: "left" | "right";
    pauseOnHover?: boolean;
}) {
    const duration = speed;
    const translateDir = direction === "left" ? "-50%" : "50%";

    return (
        <div
            className={className}
            style={{
                overflow: "hidden",
                width: "100%",
                maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
        >
            <motion.div
                style={{
                    display: "flex",
                    width: "max-content",
                    gap: "2rem",
                }}
                animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "linear",
                }}
                whileHover={pauseOnHover ? { animationPlayState: "paused" } : undefined}
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
}

/* =====================================================================
   SPLIT TEXT — each word flies in with spring physics
   ===================================================================== */

export function SplitText({
    children,
    className,
    delay = 0,
    as: Tag = "span",
}: {
    children: string;
    className?: string;
    delay?: number;
    as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-40px" });
    const words = children.split(" ");

    return (
        <Tag ref={ref} className={className} style={{ display: "flex", flexWrap: "wrap", gap: "0 0.3em" }}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    style={{ display: "inline-block" }}
                    initial={{ y: 80, opacity: 0, rotateX: 50, filter: "blur(8px)" }}
                    animate={isInView ? { y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)" } : {}}
                    transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 100,
                        delay: delay + i * 0.05,
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </Tag>
    );
}

/* =====================================================================
   DRAW LINE — SVG decorative line that draws on scroll
   ===================================================================== */

export function DrawLine({
    className,
    color = "var(--purple)",
    width = 200,
    height = 40,
}: {
    className?: string;
    color?: string;
    width?: number;
    height?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-20px" });

    return (
        <motion.svg
            ref={ref}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            className={className}
            style={{ overflow: "visible" }}
        >
            <motion.path
                d={`M 0 ${height / 2} Q ${width / 4} 0, ${width / 2} ${height / 2} T ${width} ${height / 2}`}
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
        </motion.svg>
    );
}
