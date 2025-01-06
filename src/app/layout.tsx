import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "react-medium-image-zoom/dist/styles.css";
import "./globals.css";

import ReactQueryProvider from "@/components/ReactQueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Flow Shop",
    template: "%s | Flow Shop",
    absolute: "Flow Shop",
  },
  description:
    "Flow Shop - Your one-stop destination for modern and stylish products. Discover our curated collection of high-quality items at competitive prices.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <div className="flex min-h-svh flex-col">
              <Header />
              <div className="grow">{children}</div>
              <Footer />
            </div>
          </ReactQueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
