import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export const metadata: Metadata = {
  title: "Luxura | Global Sourcing & Curated Interiors",
  description: "Luxury is composed with intention. Global sourcing and bespoke interiors curated for refined living.",
  icons: {
    icon: "/favicon.svg",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Luxura",
  "url": "https://luxurafurniture.com",
  "logo": "https://luxurafurniture.com/favicon.svg",
  "description": "Luxury is composed with intention. Global sourcing and bespoke interiors curated for refined living.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-403-971-7695",
    "contactType": "concierge",
    "email": "support@luxurafurnitures.com"
  },
  "sameAs": [
    "https://www.instagram.com/luxurafurniture?igsh=b2g2ODZwbGI2Ymtj&utm_source=qr",
    "https://www.facebook.com/share/1BpDjfBXTs/?mibextid=wwXIfr"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Luxura | Global Sourcing & Curated Interiors",
  "url": "https://luxurafurniture.com"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="antialiased selection:bg-lux-gold selection:text-white"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-lux-bg text-lux-text min-h-screen flex flex-col font-sans">
        <SmoothScroll>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}

