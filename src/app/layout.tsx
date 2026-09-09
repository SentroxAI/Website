import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ThemeProvider from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import ToastProvider from "@/components/ui/feedback/Toast";
import CookieConsent from "@/components/common/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://sentroxai.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Sentrox AI — AI-Powered Web & Automation Solutions",
    template: "%s | Sentrox AI",
  },

  description:
    "Sentrox AI builds premium AI-powered websites, automation systems, chatbots, and custom software that help businesses grow faster.",

  keywords: [
    "AI website development",
    "AI automation",
    "AI chatbot",
    "custom software",
    "web development",
    "Sentrox AI",
    "Next.js",
    "AI agents",
    "digital agency India",
    "web development company",
  ],

  authors: [{ name: "Sentrox AI", url: BASE_URL }],
  creator: "Sentrox AI",
  publisher: "Sentrox AI",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Sentrox AI",
    title: "Sentrox AI — AI-Powered Web & Automation Solutions",
    description:
      "Premium AI-powered websites, automation, and custom software for modern businesses.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Sentrox AI — AI-Powered Web & Automation Solutions",
    description:
      "Premium AI-powered websites, automation, and custom software for modern businesses.",
    creator: "@sentroxai",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": `${BASE_URL}/feed.xml`,
    },
  },

  other: {
    "google-site-verification": "",
  },
};

/* ── Structured Data (JSON-LD) ─────────────────────────────────────────────── */

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sentrox AI",
  alternateName: "SentroxAI",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.ico`,
  description:
    "AI-powered website development, automation, and custom software solutions for modern businesses.",
  foundingDate: "2025",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "hello@sentroxai.com",
    url: `${BASE_URL}/contact`,
  },
  sameAs: [
    "https://twitter.com/sentroxai",
    "https://linkedin.com/company/sentroxai",
    "https://github.com/sentroxai",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sentrox AI",
  url: BASE_URL,
  description: "AI-powered web development and automation solutions.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Sentrox AI",
  url: BASE_URL,
  description:
    "Full-service digital agency specializing in AI-powered websites, web applications, automation, and custom software development.",
  priceRange: "$$",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Digital Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI-Powered Website Development",
          description: "Custom websites built with Next.js, AI features, and modern design.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Business Automation",
          description: "Workflow automation, chatbots, and AI agent integration.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom Software Development",
          description: "Tailored SaaS platforms, dashboards, and web applications.",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* ── Organization Schema ────────────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* ── WebSite Schema (with SearchAction) ────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        {/* ── ProfessionalService Schema ─────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(professionalServiceSchema),
          }}
        />
        {/* ── RSS Feed ───────────────────────────────────────────────── */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Sentrox AI Blog"
          href="/feed.xml"
        />
      </head>

      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ToastProvider />
            <CookieConsent />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}