"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Games from "@/components/Games";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { ScrollProgressLine } from "@/components/AnimatedSection";

export default function Home() {
  return (
    <>
      <ScrollProgressLine />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Games />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

