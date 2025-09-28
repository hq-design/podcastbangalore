import type { Metadata } from "next";

const SITE_NAME = "Podcast Bangalore";
const SITE_URL = "https://podcastbangalore.vercel.app";
const FALLBACK_PRICE = 15000;

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Where India’s Stories Take Shape | Podcast Bangalore",
    template: "%s | Podcast Bangalore",
  },
  description:
    "Podcast Bangalore is an invitation-only studio in the heart of Bengaluru where filmmakers, founders, and artists craft the conversations that move India forward.",
  applicationName: SITE_NAME,
  keywords: [
    "podcast bangalore",
    "recording studio india",
    "creative studio bengaluru",
    "podcast production",
    "storytelling studio",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    title: "Where India’s Stories Take Shape",
    description: "An exclusive, cinematic recording experience for creators working at the highest level.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Podcast Bangalore studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@podcastbangalore",
    creator: "@podcastbangalore",
    title: "Where India’s Stories Take Shape",
    description:
      "An invitation-only studio in Bengaluru for the country’s most compelling storytellers.",
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

interface BusinessInfoOptions {
  city?: string;
  geo?: {
    lat: number;
    lng: number;
  };
  address?: string;
  phone?: string;
  email?: string;
}

export function buildStructuredData({
  city = "Bengaluru",
  geo = { lat: 12.9716, lng: 77.5946 },
  address = "18 Residency Road, Shanthala Nagar, Bengaluru 560025",
  phone = "+91 9900 112233",
  email = "concierge@podcastbangalore.com",
}: BusinessInfoOptions = {}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    description: baseMetadata.description,
    url: SITE_URL,
    telephone: phone,
    email,
    image: `${SITE_URL}/og-image.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressRegion: "KA",
      postalCode: "560025",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.lat,
      longitude: geo.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "09:00",
        closes: "23:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/podcastbangalore",
      "https://open.spotify.com/show/podcastbangalore",
      "https://www.youtube.com/@podcastbangalore",
    ],
    makesOffer: {
      "@type": "Offer",
      priceCurrency: "INR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: FALLBACK_PRICE.toString(),
        priceCurrency: "INR",
        unitText: "HOUR",
      },
      availability: "https://schema.org/InStock",
    },
  };

  const productJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Podcast Studio Rental",
    description: baseMetadata.description,
    brand: SITE_NAME,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: FALLBACK_PRICE,
      highPrice: FALLBACK_PRICE * 8,
      offerCount: 8,
      availability: "https://schema.org/InStock",
    },
  };

  return JSON.stringify([jsonLd, productJson]);
}
