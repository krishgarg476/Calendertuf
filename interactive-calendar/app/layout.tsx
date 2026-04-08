import type { Metadata, Viewport } from "next";
import { Outfit, Cormorant_Garamond, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Interactive Wall Calendar",
  description: "A beautiful, functional calendar component with date range selection and notes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${outfit.variable} ${cormorant.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
