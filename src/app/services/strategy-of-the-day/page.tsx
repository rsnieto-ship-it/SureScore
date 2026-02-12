"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Zap, Users, School, Clock, Target, BarChart3 } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

export default function StrategyOfTheDayPage() {
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
                  Strategy of{" "}
                  <span className="text-[var(--secondary-300)]">the Day</span>
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  A teacher-led, gamified daily test prep experience delivering focused
                  TSIA2 skill-building to entire grade levels in under ten minutes.
                  Designed to keep teachers at the center of instruction while driving
                  measurable college readiness gains.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-white text-[var(--primary-600)] hover:bg-gray-100">
                      Request a Demo
                    </Button>
                  </Link>
                  <Link href="/results">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary-600)]">
                      View Results
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
                    <Clock className="w-16 h-16 mx-auto mb-4 text-[var(--secondary-300)]" />
                    <div className="text-5xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                      &lt;10
                    </div>
                    <div className="text-white/80">Min Daily</div>
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
                How It Works
              </h2>
              <p className="text-lg text-gray-600">
                Strategy of the Day empowers teachers to deliver a daily gamified
                test prep experience that keeps students engaged and builds
                college readiness skills.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Teacher-Led Instruction",
                  description: "Teachers drive the daily experience. The platform supports and enhances instruction — it never replaces the teacher.",
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Gamified Engagement",
                  description: "Game mechanics keep students actively participating and competing, turning test prep into something students look forward to.",
                },
                {
                  icon: <School className="w-8 h-8" />,
                  title: "Grade-Wide Participation",
                  description: "Entire grade levels engage simultaneously, building a campus-wide culture of college readiness.",
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "Under Ten Minutes",
                  description: "Fits into bell schedules without displacing core instruction. Short daily sessions build retention through spaced repetition.",
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "TSIA2 Skill Focus",
                  description: "Targets the specific skill areas that drive TSI college readiness, aligned to the domains students need most.",
                },
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Real-Time Performance Data",
                  description: "Track participation and mastery across classrooms and grade levels with teacher and administrator dashboards.",
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

        {/* Two-column details */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Why Teacher-Led Daily Practice Works
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Putting teachers at the center of test prep creates sustainable,
                  scalable college readiness gains.
                </p>
                <ul className="space-y-4">
                  {[
                    "Teachers contextualize strategies for their students",
                    "Gamification drives consistent student participation",
                    "Grade-wide adoption normalizes college readiness effort",
                    "Short daily sessions build retention through spaced repetition",
                    "Teachers identify struggling students in real time",
                    "Reinforces classroom instruction rather than replacing it",
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
                  Implementation
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Designed for minimal friction — get started quickly and see
                  results from day one.
                </p>
                <ul className="space-y-4">
                  {[
                    "Digital platform accessible on any classroom device",
                    "Minimal teacher training — intuitive daily workflow",
                    "Automatic content rotation aligned to TSIA2 domains",
                    "Teacher and administrator dashboards",
                    "Compatible with advisory, homeroom, or flex periods",
                    "Campus and grade-level reporting included",
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
                { value: "<10", label: "Min Per Day" },
                { value: "Teacher", label: "Led" },
                { value: "Grade", label: "Wide" },
                { value: "Daily", label: "Content" },
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
