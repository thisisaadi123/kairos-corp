"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { NumberTicker, BlurFadeIn, InfiniteSlider } from "./AnimatedSection";
import styles from "./SocialProof.module.css";

const clients = [
    "EY",
    "Accenture",
    "KPMG",
    "Deloitte",
    "Cognizant",
    "Wipro",
    "TCS",
    "Infosys",
    "HCL",
];

const impactStats = [
    { value: 50, suffix: "+", label: "Organizations", color: "var(--purple)" },
    { value: 200, suffix: "+", label: "Workshops Delivered", color: "var(--green)" },
    { value: 5000, suffix: "+", label: "Participants", color: "var(--red)" },
    { value: 12, suffix: "+", label: "Countries", color: "var(--yellow)" },
];

export default function SocialProof() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <section className={styles.section} id="clients" ref={ref}>
            {/* Stats */}
            <div className="container">
                <motion.div
                    className={styles.statsGrid}
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    {impactStats.map((stat, i) => (
                        <BlurFadeIn key={stat.label} delay={0.1 + i * 0.1}>
                            <div className={styles.statCard}>
                                <span className={styles.statValue} style={{ color: stat.color }}>
                                    <NumberTicker value={stat.value} suffix={stat.suffix} />
                                </span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        </BlurFadeIn>
                    ))}
                </motion.div>
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Label */}
            <div className="container">
                <BlurFadeIn delay={0.4}>
                    <p className={styles.label}>
                        Trusted by leading organizations worldwide
                    </p>
                </BlurFadeIn>
            </div>

            {/* Infinite Slider — replaces custom marquee */}
            <BlurFadeIn delay={0.5}>
                <InfiniteSlider speed={25} className={styles.slider}>
                    {clients.map((client) => (
                        <span key={client} className={styles.client}>
                            {client}
                        </span>
                    ))}
                </InfiniteSlider>
            </BlurFadeIn>
        </section>
    );
}
