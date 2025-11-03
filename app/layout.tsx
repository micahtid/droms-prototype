import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Disaster Relief Map",
  description: "Real-time disaster relief coordination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {/* Mobile-constrained viewport with black bars on desktop */}
        <div className="min-h-screen w-full flex items-center justify-center bg-black">
          <div className="w-full max-w-[430px] h-screen bg-white relative shadow-2xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
