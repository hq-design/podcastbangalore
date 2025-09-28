import type { Metadata } from "next";

import "./globals.css";

import { inter, manrope } from "@/lib/fonts";
import { baseMetadata } from "@/lib/seo";

export const metadata: Metadata = baseMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
