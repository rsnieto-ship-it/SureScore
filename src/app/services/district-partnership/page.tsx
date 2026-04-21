"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

export default function DistrictPartnershipPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-600)]">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div
              >
                <Link
                  href="/services"
                  className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back to Solutions
                </Link>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                  District{" "}
                  <span className="text-[var(--secondary-300)]">Partnership</span>
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  The full-service college readiness package. AI Tutors, Strategy
                  of the Day, teacher training, customizable curriculum, and a
                  dedicated success manager &mdash; everything your district needs
                  to move CCMR outcomes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-white text-[var(--primary-600)] hover:bg-gray-100">
                      Become a Partner
                    </Button>
                  </Link>
                </div>
              </div>
              <div
                className="hidden lg:block"
              >
                <Card variant="glass" className="p-8 text-white">
                  <div className="text-center">
                    <div className="text-5xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                      70+
                    </div>
                    <div className="text-white/80">Partner Districts</div>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* What's Included */}
        <section className="py-24 bg-white">
          <Container>
            <div
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                What&apos;s Included
              </h2>
              <p className="text-lg text-gray-600">
                A District Partnership bundles our college readiness tools with
                hands-on support so your team never has to figure it out alone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: "AI Tutors",
                  description:
                    "Personalized, 24/7 TSIA2, SAT, and ACT prep for every student. Mastery-based learning through Socratic dialogue that meets students where they are.",
                },
                {
                  title: "Strategy of the Day",
                  description:
                    "Teacher-led, gamified daily skill-building that gets entire grade levels prepping in under 10 minutes a day.",
                },
                {
                  title: "Teacher Training",
                  description:
                    "On-site professional development and train-the-trainer certification so your educators own the process long-term.",
                },
                {
                  title: "Customizable Curriculum",
                  description:
                    "TEKS-aligned, flexible curriculum materials adapted to your district's specific needs, timelines, and student population.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                >
                  <Card className="h-full" hover="lift">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Partnership Benefits */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12">
              <div
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Why Partner?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Partner districts get more than software &mdash; they get a team
                  that&apos;s invested in their outcomes.
                </p>
                <ul className="space-y-4">
                  {[
                    "Dedicated District Success Manager",
                    "Priority support with 4-hour response",
                    "Quarterly strategy and progress reviews",
                    "Annual curriculum updates included",
                    "On-site teacher training sessions",
                    "Custom reporting for board presentations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[var(--secondary-500)] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Implementation
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  We guide your district through every phase &mdash; from kickoff
                  to year-end results.
                </p>
                <ul className="space-y-4">
                  {[
                    "Needs assessment and custom implementation plan",
                    "SIS integration and student rostering",
                    "On-site kickoff with teachers and admin",
                    "Ongoing coaching and classroom support",
                    "Mid-year data analysis and adjustments",
                    "Year-end CCMR impact report",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[var(--secondary-500)] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-white">
          <Container>
            <div
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Ready to Partner with SureScore?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Contact us to discuss how a District Partnership can help your
                team move CCMR outcomes this year.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a
                  href="tel:+18885458378"
                  className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium"
                >
                  888-545-TEST (8378)
                </a>
                <a
                  href="mailto:info@surescore.com"
                  className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium"
                >
                  info@surescore.com
                </a>
              </div>
              <Link href="/contact">
                <Button size="lg">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
