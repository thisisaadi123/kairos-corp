"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { MagneticHover } from "./AnimatedSection";
import styles from "./Navbar.module.css";

const navLinks = [
    { label: "About", href: "https://playkairos.com/about-us/", external: true },
    { label: "Games", href: "#games", dropdown: true },
    { label: "Blog", href: "https://playkairos.com/blog/", external: true },
    { label: "Gamewise", href: "https://playkairos.com/gamewise/", external: true },
    { label: "Login", href: "https://playkairos.com/contact/", external: true },
];

const gamesDropdown = [
    { label: "Digital Games", href: "https://playkairos.com/digital-games/" },
    { label: "Physical Games", href: "https://playkairos.com/physical-games/" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [gamesOpen, setGamesOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 40);
    });

    return (
        <>
            <motion.header
                className={styles.header}
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
                <motion.nav
                    className={styles.pill}
                    layout
                    animate={{
                        maxWidth: scrolled ? 680 : 1200,
                        padding: scrolled ? "6px 14px" : "14px 28px",
                        borderRadius: scrolled ? 9999 : 24,
                        backgroundColor: scrolled
                            ? "rgba(255, 255, 255, 0.85)"
                            : "rgba(255, 255, 255, 0)",
                        borderColor: scrolled
                            ? "rgba(226, 232, 240, 0.7)"
                            : "rgba(255, 255, 255, 0)",
                        marginTop: scrolled ? 10 : 0,
                    }}
                    transition={{
                        duration: 0.45,
                        ease: [0.25, 0.1, 0.25, 1],
                        backgroundColor: { duration: 0.3 },
                        borderColor: { duration: 0.3 },
                    }}
                    style={{
                        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
                        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
                        boxShadow: scrolled
                            ? "0 4px 30px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)"
                            : "none",
                    }}
                >
                    {/* Logo */}
                    <a href="https://playkairos.com/" target="_blank" rel="noopener noreferrer" className={styles.logo}>
                        <Image
                            src="/kairos-logo.png"
                            alt="Kairos"
                            width={160}
                            height={22}
                            className={styles.logoImg}
                            priority
                        />
                    </a>

                    {/* Desktop links */}
                    <div className={styles.links}>
                        {navLinks.map((link) =>
                            link.dropdown ? (
                                <div
                                    key={link.label}
                                    className={styles.dropdown}
                                    onMouseEnter={() => setGamesOpen(true)}
                                    onMouseLeave={() => setGamesOpen(false)}
                                >
                                    <a href={link.href} className={styles.link}>
                                        {link.label}
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 3 }}>
                                            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </a>
                                    <AnimatePresence>
                                        {gamesOpen && (
                                            <motion.div
                                                className={styles.dropdownMenu}
                                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                {gamesDropdown.map((item) => (
                                                    <a
                                                        key={item.label}
                                                        href={item.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.dropdownItem}
                                                    >
                                                        {item.label}
                                                    </a>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target={link.external ? "_blank" : undefined}
                                    rel={link.external ? "noopener noreferrer" : undefined}
                                    className={styles.link}
                                >
                                    {link.label}
                                </a>
                            )
                        )}
                    </div>

                    {/* CTA */}
                    <MagneticHover strength={0.1}>
                        <a href="https://playkairos.com/contact/" target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
                            Contact Us
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </MagneticHover>

                    {/* Hamburger (mobile) */}
                    <button
                        className={`${styles.hamburger} ${menuOpen ? styles.hamburgerActive : ""}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="toggle menu"
                    >
                        <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} />
                        <motion.span animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }} />
                        <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} />
                    </button>
                </motion.nav>

                {/* Mobile dropdown */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            className={styles.mobileMenu}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {navLinks.map((link, i) =>
                                link.dropdown ? (
                                    <div key={link.label}>
                                        <motion.span
                                            className={styles.mobileLink}
                                            style={{ cursor: "default", display: "block" }}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                        >
                                            {link.label}
                                        </motion.span>
                                        {gamesDropdown.map((sub) => (
                                            <motion.a
                                                key={sub.label}
                                                href={sub.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.mobileLink}
                                                style={{ paddingLeft: 24, fontSize: 14 }}
                                                onClick={() => setMenuOpen(false)}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.08 + 0.04 }}
                                            >
                                                ↳ {sub.label}
                                            </motion.a>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.a
                                        key={link.label}
                                        href={link.href}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        className={styles.mobileLink}
                                        onClick={() => setMenuOpen(false)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                    >
                                        {link.label}
                                    </motion.a>
                                )
                            )}
                            <motion.a
                                href="https://playkairos.com/contact/" target="_blank" rel="noopener noreferrer"
                                className={styles.mobileCta}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                onClick={() => setMenuOpen(false)}
                            >
                                Contact Us →
                            </motion.a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Mobile overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMenuOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
