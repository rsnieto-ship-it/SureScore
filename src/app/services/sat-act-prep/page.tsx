"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

export default function SATACTPrepPage() {
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
                  Back to Services
                </Link>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                  SAT & ACT{" "}
                  <span className="text-[var(--secondary-300)]">Prep</span>
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  Comprehensive test preparation designed to help boost student test
                  scores and assist students in preparing for their tests with
                  confidence.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/booking">
                    <Button size="lg" className="bg-white text-[var(--primary-600)] hover:bg-gray-100">
                      Get Started
                    </Button>
                  </Link>
                  <a href="https://surescore.edis.io/Account/testlogon" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary-600)]">
                      Take Diagnostic Test
                    </Button>
                  </a>
                </div>
              </div>
              <div
                className="hidden lg:block"
              >
                <Card variant="glass" className="p-8 text-white">
                  <div className="text-center">
                    <div className="text-6xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                      +200
                    </div>
                    <div className="text-white/80">Average Score Improvement</div>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* Features */}
        <section className="py-24 bg-white">
          <Container>
            <div
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                What&apos;s Included
              </h2>
              <p className="text-lg text-gray-600">
                Our comprehensive SAT & ACT prep program gives you everything you
                need to achieve your target score.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Expert Instruction",
                  description: "Learn from certified instructors with years of test prep experience.",
                },
                {
                  title: "Practice Tests",
                  description: "Full-length practice tests with detailed score analysis.",
                },
                {
                  title: "Small Classes",
                  description: "Personalized attention with optimal student-to-teacher ratios.",
                },
                {
                  title: "Flexible Schedule",
                  description: "Multiple session times to fit your busy schedule.",
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                >
                  <Card className="h-full" hover="lift">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Curriculum */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12">
              <div
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  SAT Prep Curriculum
                </h2>
                <ul className="space-y-4">
                  {[
                    "Evidence-Based Reading strategies",
                    "Writing and Language conventions",
                    "Math problem-solving techniques",
                    "Calculator and no-calculator sections",
                    "Essay writing (optional)",
                    "Time management strategies",
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
                  ACT Prep Curriculum
                </h2>
                <ul className="space-y-4">
                  {[
                    "English grammar and rhetoric",
                    "Math through pre-calculus",
                    "Reading comprehension strategies",
                    "Science reasoning techniques",
                    "Writing test preparation",
                    "Pacing and timing strategies",
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

        <CTA />
      </main>
      <Footer />
    </>
  );
}
