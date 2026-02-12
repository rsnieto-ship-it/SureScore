import type { Metadata } from "next";
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
  title: "SureScore College Prep | Test Prep Services Since 1995",
  description:
    "Foster academic excellence, boost test scores, and exceed district goals with SureScore's proven SAT, ACT, PSAT, and TSIA2 test prep programs.",
  keywords: [
    "SAT prep",
    "ACT prep",
    "PSAT prep",
    "TSIA2 prep",
    "college prep",
    "test prep",
    "Texas",
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
      </body>
    </html>
  );
}
