/**
 * Root Layout Component for Next.js Application
 *
 * This is the main layout component that wraps all pages in the application.
 * It sets up global providers, fonts, styling, and the overall HTML structure.
 * Includes authentication, theme, and React Query providers for state management.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
// Providers
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ContextProvider } from "@/components/providers/ContextProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patient Management System",
  description:
    "A comprehensive healthcare management platform for patient care and team collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const darkMode = true;

  return (
    <html lang="en" suppressHydrationWarning className={darkMode ? "dark" : ""}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryClientProvider>
          <AuthProvider>
            <ContextProvider>
              <ThemeProvider>{children}</ThemeProvider>
              <Toaster position="bottom-center" richColors expand={true} />
            </ContextProvider>
          </AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
