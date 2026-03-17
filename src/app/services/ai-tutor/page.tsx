"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Clock,
  MessageCircle,
  Target,
  BarChart3,
  Shield,
  Zap,
  BookOpen,
  CheckCircle,
  Sparkles,
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
    icon: <Target className="w-8 h-8" />,
    title: "Diagnostic-Driven",
    description:
      "Every student starts with a smart diagnostic that maps exact gaps across all TSIA2 Math and ELAR standards.",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Proven Curriculum",
    description:
      "SureScore's expert-crafted content — built over a decade — is delivered and personalized to each student's level.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Adaptive Difficulty",
    description:
      "Questions adjust in real time. Too easy? Harder problems. Struggling? Scaffolded support with hints and context.",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Curriculum-Aligned",
    description:
      "All content maps to TSIA2 objectives — Math (Quantitative, Algebraic, Geometric) and ELAR (Reading, Writing, Essay).",
  },
];

const tutorFeatures = [
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Socratic Method",
    description:
      "The AI never just gives answers. It asks the right questions to guide students to their own breakthroughs.",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Infinite Patience",
    description:
      "No judgment, no frustration. Always calm, encouraging, and ready to try a new approach — however long it takes.",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Always Available",
    description:
      "On-demand at any hour. No scheduling, no waiting — students get help exactly when they need it.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
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
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "24/7", label: "Always-On Tutoring" },
                    { value: "100%", label: "Personalized Content" },
                    { value: "TSIA2", label: "Math & ELAR Aligned" },
                    { value: "0", label: "Teacher Burden Increase" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Card variant="glass" className="p-6 text-white text-center">
                        <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] mb-1 text-[var(--secondary-300)]">
                          {stat.value}
                        </div>
                        <div className="text-white/70 text-sm">{stat.label}</div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* The Problem */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-4">
                The Problem
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Two Gaps Holding Students Back
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-l-4 border-l-red-400">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Boring Content
                    </h3>
                    <p className="text-gray-600">
                      Traditional test prep is dry and one-size-fits-all. Generic
                      worksheets and repetitive drills don&apos;t inspire — they
                      disengage students entirely.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-l-4 border-l-red-400">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Teacher Shortage
                    </h3>
                    <p className="text-gray-600">
                      Advanced Math and ELAR teachers are scarce — especially in
                      under-resourced districts. Students rarely get access to the
                      expert instruction they need.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.p
              className="text-center text-lg text-gray-500 italic mt-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              The result: Students fall behind, confidence drops, and test scores
              suffer.
            </motion.p>
          </Container>
        </section>

        {/* The Solution */}
        <section className="py-24 bg-gray-50">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-full text-sm font-semibold mb-4">
                The Solution
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                SureScore AI Tutor Solves Both —{" "}
                <span className="italic text-[var(--primary-500)]">
                  Simultaneously
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                A fully personalized, AI-powered learning companion built for
                TSIA2 prep. It delivers SureScore&apos;s proven curriculum —
                refined over a decade — and personalizes the experience for each
                student with an intelligent tutor that guides mastery through
                conversation, not passive drills.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: <Brain className="w-10 h-10" />,
                  title: "Personalized",
                  desc: "Every student gets a unique learning path built around their exact gaps, strengths, and pace.",
                },
                {
                  icon: <Zap className="w-10 h-10" />,
                  title: "Intelligent",
                  desc: "AI personalizes content delivery, adjusts question difficulty, and guides mastery in real time.",
                },
                {
                  icon: <MessageCircle className="w-10 h-10" />,
                  title: "Conversational",
                  desc: "Learning happens through dialogue — Socratic questioning, not passive reading.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center" hover="lift">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-4">
                How SureScore AI Tutor Works
              </h2>
              <p className="text-lg text-gray-600 italic">
                A seamless path from first login to test-day confidence
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row items-start justify-center gap-4 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={step.num}
                  className="flex-1 text-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-14 h-14 bg-[var(--primary-500)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold font-[family-name:var(--font-space-grotesk)]">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Building Personalized Content */}
        <section className="py-24 bg-gray-50">
          <Container>
            <motion.div
              className="max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[var(--primary-500)] font-bold font-[family-name:var(--font-space-grotesk)] text-lg">
                01
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mt-2">
                Building Personalized Content
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {personalizedFeatures.map((feature, index) => (
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
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* A Personal Tutor for Every Student */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[var(--primary-500)] font-bold font-[family-name:var(--font-space-grotesk)] text-lg">
                02
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mt-2">
                A Personal Tutor for Every Student
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {tutorFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full" hover="lift">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-[var(--secondary-100)] text-[var(--secondary-500)] rounded-2xl flex items-center justify-center mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Tagline Banner */}
        <section className="py-20 bg-[var(--primary-600)]">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[var(--secondary-300)] text-lg italic mb-4">
                Every student gets what only the most fortunate students used to
                have:
              </p>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-10">
                A brilliant, patient tutor who never gives up on them.
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  "Higher Test Scores",
                  "Deeper Understanding",
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
            </motion.div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
