import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "VibeHub",
  description: "Trạm sạc năng lượng vũ trụ - Aesthetic personal portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body
        className={`${lexend.variable} antialiased selection:bg-primary/30 selection:text-primary-glow min-h-screen`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
