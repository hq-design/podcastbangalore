import type { Metadata } from "next";

const SITE_NAME = "Ultimate Podcast Studio";
const SITE_URL = "https://podcaststudio.example";
const FALLBACK_PRICE = 175;

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Record Your Podcast Like a Pro | Ultimate Podcast Studio",
    template: "%s | Ultimate Podcast Studio",
  },
  description:
    "Book a world-class podcast studio with elite gear, cinematic visuals, and on-site support in under 60 seconds.",
  applicationName: SITE_NAME,
  keywords: [
    "podcast studio rental",
    "podcast recording studio",
    "podcast equipment",
    "studio booking",
    "audio engineer",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    title: "Record Your Podcast Like a Pro",
    description: "Cinematic studio, elite gear, frictionless booking. Experience the ultimate podcast studio.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ultimate Podcast Studio Rental",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@podcaststudio",
    creator: "@podcaststudio",
    title: "Record Your Podcast Like a Pro",
    description:
      "Book a world-class studio, elite gear, and on-site support in under 60 seconds.",
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
  city = "Los Angeles",
  geo = { lat: 34.0522, lng: -118.2437 },
  address = "123 Studio Lane, Los Angeles, CA 90028",
  phone = "+1 (310) 555-0123",
  email = "bookings@podcaststudio.example",
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
      addressRegion: "CA",
      postalCode: "90028",
      addressCountry: "US",
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
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/podcaststudio",
      "https://www.youtube.com/@podcaststudio",
      "https://www.linkedin.com/company/podcaststudio",
    ],
    makesOffer: {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: FALLBACK_PRICE.toString(),
        priceCurrency: "USD",
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
      priceCurrency: "USD",
      lowPrice: FALLBACK_PRICE,
      highPrice: FALLBACK_PRICE * 8,
      offerCount: 8,
      availability: "https://schema.org/InStock",
    },
  };

  return JSON.stringify([jsonLd, productJson]);
}
