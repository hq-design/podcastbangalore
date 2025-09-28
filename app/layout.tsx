import type { Metadata } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

import { inter, playfair } from "@/lib/fonts";
import { baseMetadata, buildStructuredData } from "@/lib/seo";

export const metadata: Metadata = baseMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className="bg-background">
      <body className={`${inter.variable} ${playfair.variable} bg-background text-text-primary antialiased`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <main id="main">{children}</main>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: buildStructuredData() }}
        />
      </body>
    </html>
  );
}
