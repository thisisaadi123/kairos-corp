"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BlurFadeIn } from "./AnimatedSection";
import styles from "./CTA.module.css";

export default function CTA() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section className={styles.section} id="contact" ref={ref}>
            <div className="container">
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Decorative gradient blobs */}
                    <div className={styles.bgDeco}>
                        <div className={styles.blob1} />
                        <div className={styles.blob2} />
                    </div>

                    <div className={styles.inner}>
                        <BlurFadeIn delay={0.15}>
                            <h2 className={styles.heading}>
                                Upgrade Your Training{" "}
                                <span className={styles.headingAccent}>Calendar Today</span>
                            </h2>
                        </BlurFadeIn>

                        <BlurFadeIn delay={0.25}>
                            <p className={styles.subtitle}>
                                Be the first to bring these seamless, high-impact tools to your organization.
                            </p>
                        </BlurFadeIn>

                        <BlurFadeIn delay={0.35}>
                            <p className={styles.highlight}>
                                One kit. Endless impact.
                            </p>
                        </BlurFadeIn>

                        <BlurFadeIn delay={0.45}>
                            <a
                                href="https://playkairos.com/contact/"
                                className={styles.ctaBtn}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className={styles.btnShimmer} />
                                Get a Quote
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        </BlurFadeIn>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
