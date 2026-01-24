import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApiProvider } from "@/lib/providers/api-provider";
import { AuthProvider } from "@/context/authContext";
import { ToastProvider } from "@/lib/providers/toatProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campus Master",
  description: "Application de gestion universitaire moderne et efficace",
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
        <AuthProvider> 
          <ApiProvider>
            <ToastProvider />
            {children}
          </ApiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
