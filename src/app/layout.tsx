import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "LP-Corporate L&D - Kairos",
  description:
    "Instant Portfolio Expansion for Consultants. Deliver new workshops on Agility, Trust, and Leadership with our tabletop learning games.",
  openGraph: {
    title: "Kairos — Instant Portfolio Expansion",
    description:
      "Turn one launch into four new revenue streams with our lightweight, portable learning games.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${grotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
