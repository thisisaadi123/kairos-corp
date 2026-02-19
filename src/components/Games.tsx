"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import styles from "./Games.module.css";

const games = [
    {
        index: "01",
        name: "Team Compass",
        tagline: "The Reflection & Awareness Builder",
        color: "purple" as const,
        format: "1 Team (5–10 Players)",
        duration: "30–45 Mins",
        premise:
            "A reflective card-based challenge where teams explore key dimensions of human development. Players must build a stable tower using cards that represent balanced growth, fostering dialogue and collective awareness.",
        skills: ["Self Mastery", "People Mastery", "Growth Mindset", "Situational Awareness"],
        logo: "/logo-team-compass.png",
        video: "/videos/team-compass.mp4",
    },
    {
        index: "02",
        name: "Shared Spaces",
        tagline: "The Psychological Safety Architect",
        color: "green" as const,
        format: "1 Team (6–12 Players)",
        duration: "30–45 Mins",
        premise:
            "A card activity designed to help teams pause and connect. Participants respond to thoughtful prompts and build a shared tower — where each card represents a story, moment, or value that signifies the team's collective trust.",
        skills: ["Psychological Safety", "Building Trust", "Inclusivity", "Active Listening"],
        logo: "/logo-shared-spaces.png",
        video: "/videos/shared-spaces.mp4",
    },
    {
        index: "03",
        name: "Surface Tension",
        tagline: "The Collaboration & Execution Challenge",
        color: "red" as const,
        format: "Up to 4 Teams (30–35 People)",
        duration: "30–45 Mins",
        premise:
            "A tabletop construction challenge where teams must recreate a specific structure using 30 blocks. The catch? They only have partial visual view cards, forcing them to break down information silos to succeed.",
        skills: ["Problem Solving", "Empathy", "Communication", "Execution Excellence"],
        logo: "/logo-surface-tension.png",
        video: "/videos/surface-tension.mp4",
    },
    {
        index: "04",
        name: "Cycle Time",
        tagline: "The Agility & Pressure Simulator",
        color: "yellow" as const,
        format: "Up to 5 Teams (30–40 People)",
        duration: "30–45 Mins",
        premise:
            "A fast-paced construction game using colored rods that mirrors the pressure of ambiguity. Teams must build accurately and quickly without direct visual access, relying on situational leadership to win.",
        skills: ["Situational Leadership", "Agile Thinking", "Execution Excellence", "Empathy"],
        logo: "/logo-cycle-time.png",
        video: "/videos/cycle-time.mp4",
    },
];

const colorStyles: Record<string, { accent: string; glow: string; bg: string; badgeBg: string }> = {
    purple: { accent: "var(--purple)", glow: "rgba(124, 58, 237, 0.12)", bg: "rgba(124, 58, 237, 0.06)", badgeBg: "rgba(124, 58, 237, 0.1)" },
    green: { accent: "var(--green)", glow: "rgba(5, 150, 105, 0.12)", bg: "rgba(5, 150, 105, 0.06)", badgeBg: "rgba(5, 150, 105, 0.1)" },
    red: { accent: "var(--red)", glow: "rgba(239, 64, 96, 0.12)", bg: "rgba(239, 64, 96, 0.06)", badgeBg: "rgba(239, 64, 96, 0.1)" },
    yellow: { accent: "var(--yellow)", glow: "rgba(217, 119, 6, 0.12)", bg: "rgba(217, 119, 6, 0.06)", badgeBg: "rgba(217, 119, 6, 0.1)" },
};

function GameCard({
    game,
    index,
    activeVideo,
    setActiveVideo,
}: {
    game: typeof games[0];
    index: number;
    activeVideo: string | null;
    setActiveVideo: (id: string | null) => void;
}) {
    const colors = colorStyles[game.color];
    const ref = useRef(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const isEven = index % 2 === 0;
    const isPlaying = activeVideo === game.name;
    const [isPreviewing, setIsPreviewing] = useState(false);

    // When another video becomes active, pause this one
    useEffect(() => {
        if (activeVideo !== game.name && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.muted = true;
        }
    }, [activeVideo, game.name]);

    const handleVideoClick = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            // Already playing — pause
            video.pause();
            video.muted = true;
            setActiveVideo(null);
        } else {
            // Play with sound — resume from current position
            video.muted = false;
            video.play();
            setActiveVideo(game.name);
        }
    }, [isPlaying, game.name, setActiveVideo]);

    const handleMouseEnter = useCallback(() => {
        if (isPlaying) return; // Don't override click-to-play
        const video = videoRef.current;
        if (!video) return;
        video.muted = true;
        video.play();
        setIsPreviewing(true);
    }, [isPlaying]);

    const handleMouseLeave = useCallback(() => {
        if (isPlaying) return;
        const video = videoRef.current;
        if (!video) return;
        video.pause();
        video.currentTime = 0;
        setIsPreviewing(false);
    }, [isPlaying]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className={styles.card}>
                {/* Accent top bar */}
                <motion.div
                    className={styles.accentBar}
                    style={{ background: colors.accent }}
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Header — badge+tagline left, logo right */}
                <div className={styles.logoSection}>
                    <div className={styles.badgeRow}>
                        <motion.span
                            className={styles.indexBadge}
                            style={{ color: colors.accent, background: colors.badgeBg }}
                            initial={{ scale: 0 }}
                            animate={isInView ? { scale: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
                        >
                            {game.index}
                        </motion.span>
                        <p className={styles.tagline} style={{ color: colors.accent }}>{game.tagline}</p>
                    </div>
                    <div className={styles.logoContainer}>
                        <Image
                            src={game.logo}
                            alt={game.name}
                            width={400}
                            height={120}
                            className={styles.gameLogo}
                            style={{ objectFit: "contain", objectPosition: "right" }}
                        />
                    </div>
                </div>

                <div className={`${styles.cardInner} ${isEven ? "" : styles.cardReversed}`}>
                    {/* Left — Description */}
                    <div className={styles.descSide}>
                        <h3 className={styles.gameName}>{game.name}</h3>
                        <p className={styles.premise}>{game.premise}</p>

                        {/* Meta in boxes */}
                        <div className={styles.meta}>
                            <div className={styles.metaBox}>
                                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 1.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM2 12.5c0-2 2.24-3.5 5-3.5s5 1.5 5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                </svg>
                                <span>{game.format}</span>
                            </div>
                            <div className={styles.metaBox}>
                                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                                    <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                </svg>
                                <span>{game.duration}</span>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className={styles.skills}>
                            {game.skills.map((skill, i) => (
                                <motion.span
                                    key={skill}
                                    className={styles.skillPill}
                                    style={{ color: colors.accent, background: colors.badgeBg }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <a
                                href="https://playkairos.com/contact/"
                                className={styles.gameBtn}
                                style={{
                                    background: colors.accent,
                                    color: game.color === "yellow" ? "var(--text-primary)" : "#fff",
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Get {game.name}
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        </motion.div>
                    </div>

                    {/* Right — Video */}
                    <motion.div
                        className={styles.videoSide}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div
                            className={`${styles.videoWrapper} ${isPlaying ? styles.videoActive : ""}`}
                            style={{ borderColor: isPlaying ? colors.accent : "transparent" }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleVideoClick}
                        >
                            <video
                                ref={videoRef}
                                className={styles.videoPlayer}
                                src={game.video}
                                muted
                                loop
                                playsInline
                                poster=""
                            />
                            {/* Overlay — visible when not playing and not previewing */}
                            <div className={`${styles.videoOverlay} ${(isPlaying || isPreviewing) ? styles.videoOverlayHidden : ""}`}>
                                <div className={styles.playBtn} style={{ background: colors.accent }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                                        <path d="M8 5v14l11-7L8 5z" />
                                    </svg>
                                </div>
                                <span className={styles.videoLabel}>Tap or hover to preview</span>
                            </div>
                            {/* Playing indicator */}
                            {isPlaying && (
                                <div className={styles.pauseHint}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                                        <rect x="6" y="4" width="4" height="16" />
                                        <rect x="14" y="4" width="4" height="16" />
                                    </svg>
                                    Click to pause
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default function Games() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

    return (
        <section className={styles.games} id="games" ref={sectionRef}>
            {/* Background decoration */}
            <motion.div className={styles.bgDeco} style={{ y: bgY }}>
                <div className={styles.bgCircle} />
            </motion.div>

            <div className="container">
                <div className={styles.header}>
                    <motion.h2
                        className={styles.heading}
                        initial={{ opacity: 0, y: 24 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        The New{" "}
                        <span className={styles.headingGradient}>Line‑Up</span>
                    </motion.h2>

                    <motion.p
                        className={styles.sub}
                        initial={{ opacity: 0, y: 16 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.25 }}
                    >
                        Four world-class tabletop games designed to{" "}
                        <strong>transform team dynamics</strong>.
                    </motion.p>
                </div>

                <div className={styles.list}>
                    {games.map((game, i) => (
                        <GameCard
                            key={game.name}
                            game={game}
                            index={i}
                            activeVideo={activeVideo}
                            setActiveVideo={setActiveVideo}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
