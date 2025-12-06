import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Asjon Dalipaj - Full Stack Developer & Creative Engineer",
  description: "Portfolio of Asjon Dalipaj - Full Stack Developer specializing in music therapy applications, AI-driven solutions, and modern web development.",
  keywords: ["Full Stack Developer", "Music Therapy", "AI", "Web Development", "TypeScript", "Next.js"],
  authors: [{ name: "Asjon Dalipaj" }],
  openGraph: {
    title: "Asjon Dalipaj - Full Stack Developer",
    description: "Portfolio showcasing innovative projects in music therapy and web development",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
