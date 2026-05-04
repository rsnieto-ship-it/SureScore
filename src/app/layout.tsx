import type { Metadata } from "next";
import Script from "next/script";
import { Montserrat, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SureScore | Teacher Excellence & Student Achievement for Texas Districts",
  description:
    "SureScore empowers Texas districts to bridge the gap between teacher excellence and student achievement. AI-powered TSIA2 test prep and Teacher Incentive Allotment (TIA) data management — two platforms, one mission.",
  keywords: [
    "SureScore",
    "Teacher Incentive Allotment",
    "TIA",
    "TIA software",
    "TSIA2 prep",
    "AI tutor",
    "SAT prep",
    "ACT prep",
    "PSAT prep",
    "college prep",
    "test prep Texas",
    "CCMR",
    "Texas school districts",
    "college readiness",
    "teacher retention",
    "TIA data platform",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        {children}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon='{"token": "5bc7bb1b80864bc886702ee93befecf6"}'
        />
      </body>
    </html>
  );
}
