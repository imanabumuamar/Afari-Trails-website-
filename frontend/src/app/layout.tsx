import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppWidget } from "@/components/layout/WhatsAppWidget";
import { AppProviders } from "@/context/providers";
import { resolveWhatsAppSettings } from "@/config/whatsapp";
import { site } from "@/lib/data/site";
import { getConnectContent } from "@/services/content/connect";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description:
    "Luxury safari expeditions, sustainable development, and curated African experiences — rooted in Zambia, designed for the journey.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { whatsapp: cmsWhatsApp } = await getConnectContent();
  const whatsapp = resolveWhatsAppSettings(cmsWhatsApp);

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-beige text-charcoal">
        <AppProviders>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppWidget
            number={whatsapp.number}
            message={whatsapp.message}
          />
        </AppProviders>
      </body>
    </html>
  );
}
