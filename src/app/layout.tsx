import type { Metadata, Viewport } from "next";
import { Hanuman, Inter, Kantumruy_Pro } from "next/font/google";

import { Providers } from "./providers";
import { wedding } from "@/data/wedding";
import "./globals.css";

/* English body copy. `PrimaryZh` takes precedence when it is installed. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/*
 * Khmer, throughout. Not preloaded: the Khmer subset is the heaviest asset in
 * the project, and a guest reading in English or Chinese never renders a
 * glyph from it. Choosing ខ្មែរ fetches it on the spot, with the system Khmer
 * face showing for the moment in between.
 */
const kantumruy = Kantumruy_Pro({
  variable: "--font-kantumruy",
  subsets: ["khmer", "latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: false,
});

/*
 * Khmer titles. Not preloaded, for the same reason as the body face below.
 */
const hanuman = Hanuman({
  variable: "--font-hanuman",
  subsets: ["khmer", "latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

/*
 * The Chinese faces are deliberately absent here — see
 * `components/ChineseFonts.tsx`. They are loaded on demand, because their
 * @font-face rules alone are ~140KB of render-blocking CSS.
 */

const title = `${wedding.couple.bride.name} & ${wedding.couple.groom.name} — Wedding Invitation`;
const description = `Join ${wedding.couple.bride.name} & ${wedding.couple.groom.name} as they celebrate their special day.`;

export const metadata: Metadata = {
  metadataBase: new URL(wedding.meta.siteUrl),
  title,
  description,
  applicationName: title,
  keywords: [
    "wedding invitation",
    wedding.couple.bride.name,
    wedding.couple.groom.name,
    wedding.dateLabel.en,
  ],
  openGraph: {
    type: "website",
    title,
    description,
    siteName: title,
    locale: "en",
    images: [
      {
        url: wedding.meta.ogImage,
        width: 1200,
        height: 630,
        alt: `${wedding.couple.bride.name} & ${wedding.couple.groom.name} — ${wedding.dateLabel.en}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [wedding.meta.ogImage],
  },
  other: {
    "wedding:couple": `${wedding.couple.bride.name} & ${wedding.couple.groom.name}`,
    "wedding:date": wedding.date,
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfdff",
  /* The cover and the floating controls reach into the phone's safe areas. */
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${kantumruy.variable} ${hanuman.variable} antialiased`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
