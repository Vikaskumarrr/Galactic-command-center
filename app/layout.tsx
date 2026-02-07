import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { TamboWrapper } from "@/components/TamboWrapper";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Galactic Command Center | AI-Powered Fleet Operations",
  description: "Command your fleet, explore planets, and manage galactic operations with real-time AI-powered diagnostics and intelligence.",
  keywords: ["Star Wars", "Command Center", "Generative UI", "React", "Next.js"],
  authors: [{ name: "Galactic Command" }],
  openGraph: {
    title: "Galactic Command Center",
    description: "Next-gen generative UI command center for the Rebel Alliance",
    type: "website",
    locale: "en_US",
    siteName: "Galactic Command",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Galactic Command Center - Star Wars themed UI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Galactic Command Center",
    description: "Next-gen generative UI command center for the Rebel Alliance",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable}`} suppressHydrationWarning>
        <TamboWrapper apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}>
          {children}
        </TamboWrapper>
      </body>
    </html>
  );
}
