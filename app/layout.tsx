import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MUIThemeProvider from "@/components/ui/MUIThemeProvider";
import ChatAI from '@/components/ChatAI';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Tracker - Manage Your Expenses",
  description: "Track your expenses, analyze spending patterns, and manage your budget effectively with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MUIThemeProvider>
          {children}
          <ChatAI />
        </MUIThemeProvider>
      </body>
    </html>
  );
}
