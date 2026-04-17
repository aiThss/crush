import type { Metadata } from "next";
import { Playfair_Display, Quicksand, Dancing_Script } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
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
  title: "VibeHub",
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
        className={`${playfair.variable} ${quicksand.variable} ${dancing.variable} font-sans antialiased text-foreground bg-background min-h-screen`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
