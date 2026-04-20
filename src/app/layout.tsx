import type { Metadata } from "next";
import { Comfortaa, Quicksand, Dancing_Script, Lora } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin", "vietnamese"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin", "vietnamese"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin", "vietnamese"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
});

import FloatingStars from "@/components/FloatingStars";

export const metadata: Metadata = {
  title: "Tín hiệu từ vũ trụ",
  description: "Trạm sạc năng lượng vũ trụ - Celestial Minimalist portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${comfortaa.variable} ${quicksand.variable} ${dancing.variable} ${lora.variable} font-sans antialiased text-foreground bg-background min-h-screen`}
        suppressHydrationWarning
      >
        <FloatingStars />
        {children}
      </body>
    </html>
  );
}
