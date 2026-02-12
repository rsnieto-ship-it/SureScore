"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Award, School, Calendar, Users } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

export default function PSATPrepPage() {
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
                  <School className="w-4 h-4" />
                  Classroom Delivery
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                  PSAT/NMSQT{" "}
                  <span className="text-[var(--secondary-300)]">Prep</span>
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  Comprehensive PSAT prep delivered straight into the classroom.
                  Assists students in preparing for their tests and boosting their
                  scores while building a foundation for SAT success.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/booking">
                    <Button size="lg" className="bg-white text-[var(--primary-600)] hover:bg-gray-100">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary-600)]">
                      School Programs
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
                <Card variant="glass" className="p-8 text-white text-center">
                  <Award className="w-16 h-16 mx-auto mb-4" />
                  <div className="text-3xl font-bold font-[family-name:var(--font-montserrat)] mb-2">
                    National Merit
                  </div>
                  <div className="text-white/80">Scholarship Qualifier</div>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Why PSAT Matters */}
        <section className="py-24 bg-white">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Why PSAT Preparation Matters
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  The PSAT/NMSQT is more than just practice for the SAT—it&apos;s your
                  gateway to National Merit Scholarships and a crucial benchmark for
                  college readiness.
                </p>
                <ul className="space-y-4">
                  {[
                    "Qualify for National Merit Scholarship Program",
                    "Identify strengths and weaknesses early",
                    "Build confidence before the SAT",
                    "Access to scholarship opportunities",
                    "Practice with real test conditions",
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
                <Card className="bg-[var(--primary-50)] border-[var(--primary-200)]">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      National Merit Timeline
                    </h3>
                    <div className="space-y-4">
                      {[
                        { month: "October", event: "PSAT/NMSQT Test Date" },
                        { month: "December", event: "Scores Released" },
                        { month: "September", event: "Semifinalists Announced" },
                        { month: "February", event: "Finalist Notification" },
                        { month: "March-June", event: "Scholarship Winners" },
                      ].map((item, index) => (
                        <div key={item.month} className="flex items-center gap-4">
                          <div className="w-24 text-[var(--primary-500)] font-semibold">
                            {item.month}
                          </div>
                          <div className="flex-1 text-gray-700">{item.event}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Classroom Program */}
        <section className="py-24 bg-gray-50">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Classroom Delivery Model
              </h2>
              <p className="text-lg text-gray-600">
                Our PSAT prep is designed to integrate seamlessly into your
                school&apos;s schedule.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <School className="w-10 h-10" />,
                  title: "In-School Sessions",
                  description:
                    "Expert instructors come to your school, minimizing disruption to students' schedules.",
                },
                {
                  icon: <Calendar className="w-10 h-10" />,
                  title: "Flexible Scheduling",
                  description:
                    "Work with your school calendar to find optimal times for prep sessions.",
                },
                {
                  icon: <Users className="w-10 h-10" />,
                  title: "Group Learning",
                  description:
                    "Students learn together, building community while preparing for success.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center" hover="lift">
                    <CardContent className="p-8">
                      <div className="w-20 h-20 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-3xl flex items-center justify-center mx-auto mb-6">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
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
