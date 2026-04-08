import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interactive Wall Calendar",
  description: "A beautiful, functional calendar component with date range selection and notes.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
