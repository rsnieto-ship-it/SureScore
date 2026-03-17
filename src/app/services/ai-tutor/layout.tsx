import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "AI Tutor | TSIA2 Test Prep with AI-Powered Personalized Learning — SureScore",
  description:
    "SureScore AI Tutor delivers personalized, mastery-based TSIA2 prep through Socratic dialogue. Diagnostic-driven learning paths, adaptive difficulty, and 24/7 availability — built on a decade of proven curriculum for Texas school districts.",
  keywords: [
    "AI tutor",
    "TSIA2 prep",
    "TSIA2 test prep",
    "AI test prep",
    "personalized test prep",
    "TSIA2 Math prep",
    "TSIA2 ELAR prep",
    "AI tutoring Texas",
    "college readiness AI",
    "Socratic tutoring",
    "adaptive learning",
    "TSIA prep software",
    "Texas college readiness",
    "CCMR test prep",
    "SureScore AI",
    "mastery based learning",
    "personalized learning platform",
  ],
  openGraph: {
    title: "AI Tutor — SureScore",
    description:
      "The personal tutor every student deserves. AI-powered TSIA2 prep with Socratic mastery, personalized content, and 24/7 availability.",
    url: "https://surescore.com/services/ai-tutor",
    siteName: "SureScore",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SureScore AI Tutor",
  applicationCategory: "EducationalApplication",
  description:
    "AI-powered, personalized TSIA2 test prep for Texas students. Mastery-based learning through Socratic dialogue, available 24/7.",
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

export default function AITutorLayout({
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
