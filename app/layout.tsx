import type { Metadata, Viewport } from "next";
import "./globals.css";
import ConditionalShell from "@/components/layout/ConditionalShell";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2B9361",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fitkalp.com"),
  title: {
    default: "FitKalp - Gym Management CRM for Indian Gyms",
    template: "%s | FitKalp",
  },
  description:
    "FitKalp is the gym management CRM built for Indian gym owners. Automate renewals, track payments, manage members, and stop losing business to spreadsheets and WhatsApp.",
  keywords: [
    "gym management software India",
    "gym CRM India",
    "gym membership management",
    "fitness studio software",
    "WhatsApp gym reminders",
    "GST invoicing gym",
    "gym billing software",
  ],
  authors: [{ name: "FitKalp" }],
  creator: "FitKalp",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://fitkalp.com",
    siteName: "FitKalp",
    title: "FitKalp - Gym Management CRM for Indian Gyms",
    description:
      "Stop running your gym on spreadsheets and WhatsApp. FitKalp gives you a complete CRM to manage members, automate renewals, and grow your gym.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FitKalp - Gym Management CRM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitKalp - Gym Management CRM for Indian Gyms",
    description:
      "Stop running your gym on spreadsheets and WhatsApp. FitKalp gives you a complete CRM.",
    images: ["/images/og-image.jpg"],
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/Icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/Icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400;1,9..40,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "FitKalp",
              applicationCategory: "BusinessApplication",
              description:
                "Gym management CRM software for Indian gym and fitness studio owners. Manage members, automate renewals, track payments.",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "599",
                priceCurrency: "INR",
              },
              provider: {
                "@type": "Organization",
                name: "FitKalp",
                url: process.env.NEXT_PUBLIC_SITE_URL || "https://fitkalp.com",
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  email: "fitkalp.gym@gmail.com",
                  telephone: "+91-9410004994",
                },
              },
            }),
          }}
        />
      </head>
      <body>
        <ConditionalShell>
          {children}
        </ConditionalShell>
      </body>
    </html>
  );
}

