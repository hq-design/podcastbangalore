import type { Metadata } from "next";

const SITE_NAME = "Podcast Bangalore";
const SITE_URL = "https://podcastbangalore.vercel.app";

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Podcast Bangalore — A Home for Stories",
    template: "%s | Podcast Bangalore",
  },
  description:
    "A modern podcast studio in Bengaluru with cinematic lighting, curated sets, and concierge production for creators, founders, and storytellers.",
  applicationName: SITE_NAME,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Podcast Bangalore — Where Stories Find Their Sound",
    description:
      "Book a cinematic podcast studio in the centre of Bengaluru with curated sets, hospitality, and end-to-end production support.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Podcast Bangalore studio view",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Podcast Bangalore — A Home for Stories",
    description:
      "A modern podcast studio in Bengaluru with cinematic lighting, curated sets, and concierge production.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};
