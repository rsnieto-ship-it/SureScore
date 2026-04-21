"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

export default function TSIA2PrepPage() {
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
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
                  Texas-Specific Program
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                  TSIA2{" "}
                  <span className="text-[var(--secondary-300)]">Prep</span>
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  Texas Success Initiative Assessment preparation with curriculum
                  aligned to all TEKS standards. Higher results through efficient
                  implementation models and data analytics.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/booking">
                    <Button size="lg" className="bg-white text-[var(--primary-600)] hover:bg-gray-100">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary-600)]">
                      School Partnerships
                    </Button>
                  </Link>
                </div>
              </div>
              <div
                className="hidden lg:block"
              >
                <Card variant="glass" className="p-8 text-white">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                      TEKS
                    </div>
                    <div className="text-white/80">Aligned Curriculum</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">Math</div>
                      <div className="text-white/70 text-sm">College Ready</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">ELAR</div>
                      <div className="text-white/70 text-sm">College Ready</div>
                    </div>
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
                Program Features
              </h2>
              <p className="text-lg text-gray-600">
                Our TSIA2 prep program is specifically designed for Texas students
                and aligned with state standards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "TEKS Aligned",
                  description: "Curriculum aligned with all Texas Essential Knowledge and Skills standards.",
                },
                {
                  title: "Data Analytics",
                  description: "Track student progress with detailed analytics and reporting.",
                },
                {
                  title: "College Ready",
                  description: "Prepare students to meet college readiness benchmarks.",
                },
                {
                  title: "Texas Focused",
                  description: "Specifically designed for Texas public college requirements.",
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

        {/* What's Covered */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12">
              <div
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Mathematics
                </h2>
                <ul className="space-y-4">
                  {[
                    "Elementary algebra and functions",
                    "Intermediate algebra",
                    "Geometry and measurement",
                    "Data analysis and statistics",
                    "Probabilistic reasoning",
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
                  English Language Arts & Reading
                </h2>
                <ul className="space-y-4">
                  {[
                    "Literary analysis",
                    "Informational text comprehension",
                    "Vocabulary development",
                    "Essay writing and revision",
                    "Grammar and conventions",
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
