"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import styles from "./Footer.module.css";

export default function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-40px" });

    const containerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.08, delayChildren: 0.1 },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
        },
    };

    return (
        <footer className={styles.footer} ref={ref}>
            {/* Gradient top line */}
            <div className={styles.gradLine} />

            <motion.div
                className={`container ${styles.grid}`}
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {/* Brand */}
                <motion.div className={styles.brand} variants={childVariants}>
                    <div className={styles.brandRow}>
                        <Image
                            src="/kairos-logo.png"
                            alt="Kairos"
                            width={160}
                            height={26}
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                    <p className={styles.brandDesc}>
                        Game-based experiences that build skills, shift behaviours, and spark lasting impact.
                    </p>
                </motion.div>

                {/* Company */}
                <motion.div className={styles.column} variants={childVariants}>
                    <h4>Company</h4>
                    <ul>
                        <li><a href="https://playkairos.com/about-us/" target="_blank" rel="noopener noreferrer">About Us</a></li>
                        <li><a href="https://playkairos.com/blog/" target="_blank" rel="noopener noreferrer">Blog</a></li>
                        <li><a href="https://playkairos.com" target="_blank" rel="noopener noreferrer">Main Site</a></li>
                        <li>
                            <a href="https://www.linkedin.com/company/playkairos/" target="_blank" rel="noopener noreferrer" className={styles.linkedInLink}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="1.5" />
                                    <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </motion.div>

                {/* Games */}
                <motion.div className={styles.column} variants={childVariants}>
                    <h4>Games</h4>
                    <ul>
                        <li><a href="#games">Team Compass</a></li>
                        <li><a href="#games">Shared Spaces</a></li>
                        <li><a href="#games">Surface Tension</a></li>
                        <li><a href="#games">Cycle Time</a></li>
                    </ul>
                </motion.div>

                {/* Contact */}
                <motion.div className={styles.column} variants={childVariants}>
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="mailto:gomathi@blueskylearning.in">gomathi@blueskylearning.in</a></li>
                        <li><a href="mailto:deepak@playkairos.com">deepak@playkairos.com</a></li>
                        <li><a href="tel:+917299948787">+91 72999 48787</a></li>
                    </ul>
                </motion.div>
            </motion.div>


        </footer>
    );
}
