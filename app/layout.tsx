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
  description: "Real-time disaster relief coordination platform for emergency response teams",
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {/* Mobile-constrained viewport with black bars on desktop */}
        <div className="min-h-dvh w-full flex items-center justify-center bg-black">
          <div className="w-full max-w-[430px] h-dvh bg-white relative shadow-2xl overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
