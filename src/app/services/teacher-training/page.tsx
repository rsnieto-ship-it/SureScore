"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Users, GraduationCap, BookOpen, Award, Calendar, Video } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

export default function TeacherTrainingPage() {
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
                  Teacher{" "}
                  <span className="text-[var(--secondary-300)]">Training</span>
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  Professional development programs that equip your educators with
                  proven test prep strategies and instructional techniques to
                  maximize student outcomes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-white text-[var(--primary-600)] hover:bg-gray-100">
                      Schedule Training
                    </Button>
                  </Link>
                  <Link href="/resources">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary-600)]">
                      View Resources
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
                    <GraduationCap className="w-16 h-16 mx-auto mb-4 text-[var(--secondary-300)]" />
                    <div className="text-5xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                      5,000+
                    </div>
                    <div className="text-white/80">Teachers Trained</div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Training Programs */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Professional Development Programs
              </h2>
              <p className="text-lg text-gray-600">
                Comprehensive training options designed to fit your district&apos;s
                schedule and professional development goals.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Calendar className="w-8 h-8" />,
                  title: "On-Site Workshops",
                  description: "Full-day or half-day sessions at your campus with hands-on practice and collaborative activities.",
                },
                {
                  icon: <Video className="w-8 h-8" />,
                  title: "Virtual Training",
                  description: "Live online sessions for flexible scheduling, perfect for multi-campus districts.",
                },
                {
                  icon: <BookOpen className="w-8 h-8" />,
                  title: "Self-Paced Modules",
                  description: "On-demand video courses teachers can complete at their own pace with certification.",
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Coaching Sessions",
                  description: "One-on-one or small group coaching for teachers needing additional support.",
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: "Leadership Training",
                  description: "Specialized training for department heads and instructional coaches.",
                },
                {
                  icon: <GraduationCap className="w-8 h-8" />,
                  title: "New Teacher Bootcamp",
                  description: "Intensive program for teachers new to test prep instruction.",
                },
              ].map((program, index) => (
                <motion.div
                  key={program.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full" hover="lift">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mb-4">
                        {program.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {program.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{program.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Training Topics */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Instructional Strategies
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Evidence-based teaching methods proven to improve student
                  performance on college readiness assessments.
                </p>
                <ul className="space-y-4">
                  {[
                    "Test-taking strategies for SAT, ACT, and TSIA2",
                    "Time management techniques for timed assessments",
                    "Error analysis and misconception identification",
                    "Differentiated instruction for diverse learners",
                    "Integrating test prep into daily instruction",
                    "Motivating students and reducing test anxiety",
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
                  Platform Mastery
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Learn to leverage our digital platform for maximum impact
                  in your classroom.
                </p>
                <ul className="space-y-4">
                  {[
                    "Navigating the teacher dashboard",
                    "Creating and assigning practice sets",
                    "Interpreting student performance data",
                    "Setting up intervention groups",
                    "Generating progress reports",
                    "Best practices for blended learning",
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

        {/* CPE Credits */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-[var(--secondary-100)] text-[var(--secondary-500)] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Earn CPE Credits
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                All SureScore professional development programs qualify for Continuing
                Professional Education (CPE) credits. Teachers receive documentation
                of completed training hours for their professional development records.
              </p>
              <Link href="/contact">
                <Button size="lg">
                  Request Training Information
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
