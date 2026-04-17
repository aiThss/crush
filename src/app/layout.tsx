import type { Metadata } from "next";
import { Comfortaa, Quicksand, Dancing_Script } from "next/font/google";
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
        className={`${comfortaa.variable} ${quicksand.variable} ${dancing.variable} font-sans antialiased text-foreground bg-background min-h-screen`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
