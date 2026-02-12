"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Monitor, BarChart3, Users, Clock, Shield, Zap } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

export default function OnlineSolutionsPage() {
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
                  Online{" "}
                  <span className="text-[var(--secondary-300)]">Solutions</span>
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  A comprehensive digital platform providing diagnostic assessments,
                  personalized learning paths, and real-time progress tracking for
                  district-wide implementation.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-white text-[var(--primary-600)] hover:bg-gray-100">
                      Request a Demo
                    </Button>
                  </Link>
                  <a href="https://surescore.edis.io/Account/testlogon" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary-600)]">
                      Login
                    </Button>
                  </a>
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
                    <Monitor className="w-16 h-16 mx-auto mb-4 text-[var(--secondary-300)]" />
                    <div className="text-5xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                      24/7
                    </div>
                    <div className="text-white/80">Student Access</div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Platform Features */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Platform Features
              </h2>
              <p className="text-lg text-gray-600">
                Our digital platform provides everything your district needs to
                implement an effective college readiness program at scale.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Diagnostic Assessments",
                  description: "Comprehensive baseline testing to identify student strengths and areas for growth across all tested domains.",
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Personalized Learning Paths",
                  description: "AI-driven adaptive learning that adjusts to each student's pace and skill level automatically.",
                },
                {
                  icon: <Monitor className="w-8 h-8" />,
                  title: "Administrator Dashboard",
                  description: "Real-time analytics showing district, school, and classroom-level progress and performance trends.",
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Teacher Tools",
                  description: "Assignment creation, progress monitoring, and intervention alerts for educators.",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "TEKS & CCMR Aligned",
                  description: "All content mapped to Texas standards and CCMR accountability indicators.",
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "Flexible Access",
                  description: "Available 24/7 on any device, supporting both in-school and at-home learning.",
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

        {/* Test Prep Coverage */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Comprehensive Test Coverage
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Our platform supports all major college readiness assessments
                  required for CCMR accountability in Texas.
                </p>
                <ul className="space-y-4">
                  {[
                    "SAT (Math, Reading & Writing)",
                    "ACT (English, Math, Reading, Science)",
                    "TSIA2 (Texas Success Initiative Assessment)",
                    "PSAT/NMSQT Preparation",
                    "AP Exam Preparation",
                    "College Application Support",
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
                  Implementation Support
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  We ensure your district has everything needed for successful
                  platform adoption and ongoing success.
                </p>
                <ul className="space-y-4">
                  {[
                    "SIS integration (Skyward, PowerSchool, etc.)",
                    "Rostering and student account setup",
                    "Administrator training sessions",
                    "Teacher onboarding workshops",
                    "Ongoing technical support",
                    "Quarterly progress reviews",
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

        {/* Stats */}
        <section className="py-24 bg-[var(--primary-600)]">
          <Container>
            <div className="grid md:grid-cols-4 gap-8 text-center text-white">
              {[
                { value: "70+", label: "Partner Districts" },
                { value: "179", label: "Avg. SAT Point Increase" },
                { value: "3.1", label: "Avg. ACT Point Increase" },
                { value: "24/7", label: "Platform Access" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/80">{stat.label}</div>
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
