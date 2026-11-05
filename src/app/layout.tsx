import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Navbar from "@/components/Navbar"; // ✅ Navbar ইমপোর্ট করা হলো

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookNook | Online Library",
  description: "A small online library to add, borrow, and return books.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <Toaster position="top-center" reverseOrder={false} />
        
        <Navbar /> {/* ✅ Navbar এখানে যোগ করা হলো */}
        
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}