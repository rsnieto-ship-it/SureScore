"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, BookOpen, Settings, FileText, Layers, Target, Palette } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

export default function CustomizableCurriculumPage() {
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
                  Back to Solutions
                </Link>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                  Customizable{" "}
                  <span className="text-[var(--secondary-300)]">Curriculum</span>
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  Flexible, TEKS-aligned curriculum solutions that adapt to your
                  district&apos;s specific needs, timelines, and student population
                  demographics.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-white text-[var(--primary-600)] hover:bg-gray-100">
                      Request Curriculum Review
                    </Button>
                  </Link>
                  <Link href="/resources">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary-600)]">
                      View Sample Materials
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
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-[var(--secondary-300)]" />
                    <div className="text-5xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                      100%
                    </div>
                    <div className="text-white/80">TEKS Aligned</div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Curriculum Features */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Curriculum Customization Options
              </h2>
              <p className="text-lg text-gray-600">
                Every district is unique. Our curriculum can be tailored to match
                your specific instructional calendar, student needs, and CCMR goals.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Settings className="w-8 h-8" />,
                  title: "Pacing Guides",
                  description: "Custom-built pacing guides aligned to your district's academic calendar and testing windows.",
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Scope & Sequence",
                  description: "Tailored curriculum maps that integrate with your existing course offerings.",
                },
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: "Print Materials",
                  description: "Student workbooks, practice tests, and teacher guides with district branding options.",
                },
                {
                  icon: <Layers className="w-8 h-8" />,
                  title: "Modular Content",
                  description: "Pick and choose specific units to supplement existing curriculum or fill gaps.",
                },
                {
                  icon: <Palette className="w-8 h-8" />,
                  title: "Skill-Based Focus",
                  description: "Emphasize specific skills based on your student population's diagnostic data.",
                },
                {
                  icon: <BookOpen className="w-8 h-8" />,
                  title: "Intervention Materials",
                  description: "Supplementary resources for students needing additional support or acceleration.",
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
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mb-4">
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

        {/* Subject Coverage */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Math Curriculum
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Comprehensive math preparation covering all topics tested on
                  SAT, ACT, and TSIA2 mathematics sections.
                </p>
                <ul className="space-y-4">
                  {[
                    "Heart of Algebra (linear equations, systems)",
                    "Problem Solving & Data Analysis",
                    "Passport to Advanced Math (quadratics, functions)",
                    "Additional Topics (geometry, trigonometry)",
                    "Calculator and non-calculator strategies",
                    "Real-world application problems",
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
                  English/Language Arts Curriculum
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Complete ELAR preparation for reading comprehension and
                  writing skills tested across all major assessments.
                </p>
                <ul className="space-y-4">
                  {[
                    "Evidence-based reading strategies",
                    "Command of evidence questions",
                    "Words in context vocabulary",
                    "Standard English conventions",
                    "Expression of ideas",
                    "Analysis of informational and literary texts",
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

        {/* Implementation Models */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Implementation Models
              </h2>
              <p className="text-lg text-gray-600">
                Choose the implementation approach that best fits your district&apos;s
                structure and goals.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Dedicated Course",
                  description: "Full semester or year-long course focused exclusively on college readiness preparation.",
                  features: ["Daily instruction", "Comprehensive coverage", "Full diagnostic cycle"],
                },
                {
                  title: "Integrated Approach",
                  description: "Embed test prep content into existing English and Math courses throughout the year.",
                  features: ["No schedule changes", "Seamless integration", "Consistent reinforcement"],
                },
                {
                  title: "Intensive Boot Camp",
                  description: "Concentrated preparation during specific windows before major testing dates.",
                  features: ["Focused review", "Flexible timing", "Targeted intervention"],
                },
              ].map((model, index) => (
                <motion.div
                  key={model.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full" variant="elevated">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-4">
                        {model.title}
                      </h3>
                      <p className="text-gray-600 mb-6">{model.description}</p>
                      <ul className="space-y-2">
                        {model.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-[var(--secondary-500)]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
