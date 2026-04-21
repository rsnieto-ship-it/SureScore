"use client";

import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

const steps = [
  {
    num: "1",
    title: "Student Logs In",
    desc: "Secure profile created. Goals configured in minutes.",
  },
  {
    num: "2",
    title: "Diagnostic",
    desc: "AI maps precise gaps across all TSIA2 content domains.",
  },
  {
    num: "3",
    title: "Personalized Plan",
    desc: "Custom learning roadmap prioritized by impact.",
  },
  {
    num: "4",
    title: "Learn with AI Tutor",
    desc: "Guided by Socratic dialogue and instant feedback.",
  },
  {
    num: "5",
    title: "Mastery Confirmed",
    desc: "AI tracks progress and reports results to teachers.",
  },
];

const personalizedFeatures = [
  {
    title: "Diagnostic-Driven",
    description:
      "Every student starts with a smart diagnostic that maps exact gaps across all TSIA2 Math and ELAR standards.",
  },
  {
    title: "Proven Curriculum",
    description:
      "SureScore's expert-crafted content — built over a decade — is delivered and personalized to each student's level.",
  },
  {
    title: "Adaptive Difficulty",
    description:
      "Questions adjust in real time. Too easy? Harder problems. Struggling? Scaffolded support with hints and context.",
  },
  {
    title: "Curriculum-Aligned",
    description:
      "All content maps to TSIA2 objectives — Math (Quantitative, Algebraic, Geometric) and ELAR (Reading, Writing, Essay).",
  },
];

const tutorFeatures = [
  {
    title: "Socratic Method",
    description:
      "The AI never just gives answers. It asks the right questions to guide students to their own breakthroughs.",
  },
  {
    title: "Infinite Patience",
    description:
      "No judgment, no frustration. Always calm, encouraging, and ready to try a new approach — however long it takes.",
  },
  {
    title: "Always Available",
    description:
      "On-demand at any hour. No scheduling, no waiting — students get help exactly when they need it.",
  },
  {
    title: "Safe & Private",
    description:
      "Student data is secure. Built with privacy-first design for school environments.",
  },
];

export default function AITutorPage() {
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
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-4">
                  AI{" "}
                  <span className="text-[var(--secondary-300)]">Tutor</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 font-medium mb-4">
                  The Personal Tutor Every Student Deserves
                </p>
                <p className="text-lg text-white/70 mb-8">
                  Personalized Content &middot; Socratic Mastery &middot;
                  Available 24/7 &middot; TSIA2 Math &amp; ELAR
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact">
                    <Button
                      size="lg"
                      className="bg-white text-[var(--primary-600)] hover:bg-gray-100"
                    >
                      Schedule a Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div
                className="hidden lg:block"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "24/7", label: "Always-On Tutoring" },
                    { value: "100%", label: "Personalized Content" },
                    { value: "TSIA2", label: "Math & ELAR Aligned" },
                    { value: "0", label: "Teacher Burden Increase" },
                  ].map((stat, index) => (
                    <div
                      key={stat.label}
                    >
                      <Card variant="glass" className="p-6 text-white text-center">
                        <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] mb-1 text-[var(--secondary-300)]">
                          {stat.value}
                        </div>
                        <div className="text-white/70 text-sm">{stat.label}</div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* The Problem */}
        <section className="py-24 bg-white">
          <Container>
            <div
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-4">
                The Problem
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Teachers Are Overwhelmed
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div
              >
                <Card className="h-full border-l-4 border-l-red-400">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Too Many Students, Not Enough Hours
                    </h3>
                    <p className="text-gray-600">
                      Teachers are doing everything they can, but there aren&apos;t
                      enough hours in the day to give every student the
                      individualized attention they need to pass TSIA2, SAT, or ACT.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div
              >
                <Card className="h-full border-l-4 border-l-red-400">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      One-Size-Fits-All Doesn&apos;t Work
                    </h3>
                    <p className="text-gray-600">
                      Traditional test prep materials are generic and disengaging.
                      Students need personalized support that meets them where they
                      are — not another worksheet.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <p
              className="text-center text-lg text-gray-500 italic mt-10 max-w-2xl mx-auto"
            >
              The result: Teachers burn out, students disengage, and test scores
              suffer.
            </p>
          </Container>
        </section>

        {/* The Solution */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-1.5 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-full text-sm font-semibold mb-4">
                The Solution
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Your Teachers&apos; Best{" "}
                <span className="italic text-[var(--primary-500)]">
                  Teaching Assistant
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                SureScore AI Tutors lift the burden off your teachers&apos;
                shoulders by giving every student a personalized, always-positive
                learning companion. Built on a decade of proven curriculum, each
                AI Tutor guides mastery through Socratic conversation — while
                flagging issues, tracking progress, and reporting back to teachers
                so they stay in control.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: "Personalized",
                  desc: "Every student gets a unique learning path built around their exact gaps, strengths, and pace.",
                },
                {
                  title: "Intelligent",
                  desc: "AI personalizes content delivery, adjusts question difficulty, and guides mastery in real time.",
                },
                {
                  title: "Conversational",
                  desc: "Learning happens through dialogue — Socratic questioning, not passive reading.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                >
                  <Card className="h-full text-center" hover="lift">
                    <CardContent className="p-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-white">
          <Container>
            <div
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-4">
                How SureScore AI Tutor Works
              </h2>
              <p className="text-lg text-gray-600 italic">
                A seamless path from first login to test-day confidence
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-start justify-center gap-4 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div
                  key={step.num}
                  className="flex-1 text-center relative"
                >
                  <div className="w-14 h-14 bg-[var(--primary-500)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold font-[family-name:var(--font-space-grotesk)]">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Building Personalized Content */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div
              className="max-w-3xl mx-auto mb-16"
            >
              <span className="text-[var(--primary-500)] font-bold font-[family-name:var(--font-space-grotesk)] text-lg">
                01
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mt-2">
                Building Personalized Content
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {personalizedFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                >
                  <Card className="h-full" hover="lift">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* A Personal Tutor for Every Student */}
        <section className="py-24 bg-white">
          <Container>
            <div
              className="max-w-3xl mx-auto mb-16"
            >
              <span className="text-[var(--primary-500)] font-bold font-[family-name:var(--font-space-grotesk)] text-lg">
                02
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mt-2">
                A Personal Tutor for Every Student
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {tutorFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                >
                  <Card className="h-full" hover="lift">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Tagline Banner */}
        <section className="py-20 bg-[var(--primary-600)]">
          <Container>
            <div
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-[var(--secondary-300)] text-lg italic mb-4">
                Your teachers get an always-on teaching assistant. Your students get:
              </p>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-10">
                A patient, expert tutor who never gives up on them.
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  "Higher Test Scores",
                  "Less Teacher Burnout",
                  "Scalable for Any District",
                ].map((item) => (
                  <span
                    key={item}
                    className="px-6 py-3 bg-[var(--secondary-500)] text-white font-semibold rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
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
