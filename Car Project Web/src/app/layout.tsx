/**
 * Root Layout
 * Main layout wrapper for the entire application
 */

import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import "@/styles/globals.css";

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo2",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cars Project - Next.js + TypeScript + Tailwind",
    template: "%s | Cars Project",
  },
  description: "A production-grade Next.js application with clean architecture and scalable folder structure",
  keywords: ["Next.js", "TypeScript", "Tailwind CSS", "React", "Web Development"],
  authors: [{ name: "Cars Project Team" }],
  creator: "Cars Project",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://carsproject.com",
    title: "Cars Project",
    description: "A production-grade Next.js application",
    siteName: "Cars Project",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cars Project",
    description: "A production-grade Next.js application",
    creator: "@carsproject",
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
    <html lang="en" suppressHydrationWarning>
      <body className={exo2.variable}>
        <AuthProvider>
          <FavoritesProvider>
            <NotificationProvider>
              <div className="relative min-h-screen">
                <Navbar />
                <main className="relative z-10">{children}</main>
                <ConditionalFooter />
              </div>
            </NotificationProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

