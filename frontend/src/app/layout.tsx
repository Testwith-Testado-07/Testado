import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ConsentGate } from "@/components/ConsentGate";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Testado — Real People. Real Insights. Real Problems.",
  description:
    "Testado helps businesses understand whether products, services, concepts and ideas are likely to work with their target customers before launch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning className={inter.className}>
        <ToastProvider>
          <ConsentGate>{children}</ConsentGate>
        </ToastProvider>
      </body>
    </html>
  );
}
