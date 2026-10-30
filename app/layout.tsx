import type { Metadata, Viewport } from "next";
import "./globals.css";

const DESCRIPTION =
  "A simple daily guide for visitors: what to wear in Tokyo today, based on the season's typical temperatures.";

export const metadata: Metadata = {
  title: "What to Wear in Tokyo Today",
  description: DESCRIPTION,
  openGraph: {
    title: "What to Wear in Tokyo Today",
    description: DESCRIPTION,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e7c86",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
