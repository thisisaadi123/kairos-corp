"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MagneticHover, GlowingOrb, FloatingParticles, SplitText } from "./AnimatedSection";
import Image from "next/image";
import styles from "./Hero.module.css";

const pillWords = [
    { text: "Lighter", color: "#EF4060" },
    { text: "Faster", color: "#7C3AED" },
    { text: "Smarter", color: "#059669" },
];

export default function Hero() {
    const sectionRef = useRef(null);
    const [colorIndex, setColorIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setColorIndex((prev) => (prev + 1) % pillWords.length);
        }, 1500);
        return () => clearInterval(timer);
    }, []);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

    const getColor = (pillIndex: number) => {
        return pillWords[(pillIndex + colorIndex) % pillWords.length].color;
    };

    return (
        <section className={styles.hero} id="hero" ref={sectionRef}>
            {/* Subtle aurora background */}
            <motion.div className={styles.auroraBg} style={{ opacity: bgOpacity, scale: bgScale }}>
                <GlowingOrb color="rgba(124, 58, 237, 0.06)" size={500} style={{ top: "-15%", left: "-10%" }} />
                <GlowingOrb color="rgba(239, 64, 96, 0.05)" size={400} style={{ bottom: "-10%", right: "-10%" }} />
                <GlowingOrb color="rgba(5, 150, 105, 0.04)" size={350} style={{ top: "40%", right: "5%" }} />
            </motion.div>

            {/* Subtle floating particles */}
            <FloatingParticles count={8} />

            <div className={styles.content}>
                {/* Left — Text */}
                <div className={styles.textSide}>
                    {/* Title with parallax */}
                    <motion.div style={{ y: titleY }}>
                        <h1 className={styles.title}>
                            <motion.span
                                className={styles.titleGradient}
                                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            >
                                The New Era
                            </motion.span>
                            <br />
                            <SplitText as="span" className={styles.titleInner} delay={0.45}>
                                Of Learning Games
                            </SplitText>
                        </h1>
                    </motion.div>

                    {/* Oscillating color pills */}
                    <motion.div
                        className={styles.pills}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        {pillWords.map((pill, i) => (
                            <motion.span
                                key={pill.text}
                                className={styles.pill}
                                animate={{
                                    backgroundColor: getColor(i),
                                    scale: [1, 1.04, 1],
                                }}
                                transition={{
                                    backgroundColor: { duration: 0.8, ease: "easeInOut" },
                                    scale: { duration: 2, repeat: Infinity, repeatDelay: 4, delay: i * 0.6 },
                                }}
                            >
                                {pill.text}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.8 }}
                    >
                        Discover <strong>4 new tabletop learning games</strong> designed for seamless integration and zero logistical stress.
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        className={styles.buttons}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 1.0 }}
                    >
                        <MagneticHover strength={0.15}>
                            <a href="https://playkairos.com/contact/" target="_blank" rel="noopener noreferrer" className={`btn btn-secondary btn-large ${styles.ctaBtn}`}>
                                Get a Quote
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        </MagneticHover>
                    </motion.div>
                </div>

                {/* Right — Product Image (no 3D effects, no border) */}
                <motion.div
                    className={styles.imageSide}
                    initial={{ opacity: 0, x: 60, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className={styles.imageFrame}>
                        <Image
                            src="/hero-boxes.jpg"
                            alt="Kairos game boxes — Surface Tension, Team Compass, Shared Spaces"
                            width={1237}
                            height={927}
                            className={styles.heroImage}
                            priority
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
