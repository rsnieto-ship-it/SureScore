"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, MapPin, BarChart3, FileCheck, BookMarked } from "lucide-react";
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href="/services"
                  className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back to Services
                </Link>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
                  <MapPin className="w-4 h-4" />
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
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
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
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Features */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Program Features
              </h2>
              <p className="text-lg text-gray-600">
                Our TSIA2 prep program is specifically designed for Texas students
                and aligned with state standards.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <BookMarked className="w-8 h-8" />,
                  title: "TEKS Aligned",
                  description: "Curriculum aligned with all Texas Essential Knowledge and Skills standards.",
                },
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Data Analytics",
                  description: "Track student progress with detailed analytics and reporting.",
                },
                {
                  icon: <FileCheck className="w-8 h-8" />,
                  title: "College Ready",
                  description: "Prepare students to meet college readiness benchmarks.",
                },
                {
                  icon: <MapPin className="w-8 h-8" />,
                  title: "Texas Focused",
                  description: "Specifically designed for Texas public college requirements.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full" hover="lift">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* What's Covered */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
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
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
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
              </motion.div>
            </div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
