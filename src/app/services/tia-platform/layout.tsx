import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "TIA Data Platform | Teacher Incentive Allotment Software — SureScore",
  description:
    "Streamline your Teacher Incentive Allotment workflows with SureScore's TIA Data Platform. Automated roster matching across 12 assessment vendors, TEA-aligned growth calculations, error flagging, and submission-ready 30-column TEA output files. Built for Texas school districts.",
  keywords: [
    "Teacher Incentive Allotment",
    "TIA",
    "TIA software",
    "TIA data platform",
    "TIA Texas",
    "Teacher Incentive Allotment software",
    "TIA roster matching",
    "TIA TEA submission",
    "TIA growth calculations",
    "TIA assessment vendors",
    "teacher designation Texas",
    "recognized teacher",
    "master teacher",
    "designated teacher",
    "TEA 30 column file",
    "TIA data management",
    "strategic compensation Texas",
    "teacher retention Texas",
    "SureScore TIA",
  ],
  openGraph: {
    title: "TIA Data Platform — SureScore",
    description:
      "Automate your Teacher Incentive Allotment workflows. 12 vendor integrations, TEA-aligned growth models, and one-click submission files.",
    url: "https://surescore.com/services/tia-platform",
    siteName: "SureScore",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SureScore TIA Data Platform",
  applicationCategory: "BusinessApplication",
  description:
    "Teacher Incentive Allotment data management platform for Texas school districts. Automated roster matching, TEA-aligned growth calculations, and submission-ready output files.",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    category: "Education Software",
  },
  creator: {
    "@type": "Organization",
    name: "SureScore",
    url: "https://surescore.com",
    address: {
      "@type": "PostalAddress",
      addressRegion: "TX",
      addressCountry: "US",
    },
  },
};

export default function TIAPlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
