import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const description =
  "Uniport lets apps receive assets on their home chain while users pay from whatever chain they already use. One React component, no API key.";

export const metadata: Metadata = {
  metadataBase: new URL("https://uniport.dev"),
  title: {
    default: "Uniport — Let users deposit from any chain",
    template: "%s — Uniport",
  },
  description,
  openGraph: {
    title: "Uniport — Let users deposit from any chain",
    description,
    url: "https://uniport.dev",
    siteName: "Uniport",
    type: "website",
  },
  twitter: { card: "summary", title: "Uniport", description },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="u-page">
        <TooltipProvider>{children}</TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
