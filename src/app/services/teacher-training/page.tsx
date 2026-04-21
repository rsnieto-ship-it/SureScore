"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
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
              <div
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
              </div>
              <div
                className="hidden lg:block"
              >
                <Card variant="glass" className="p-8 text-white">
                  <div className="text-center">
                    <div className="text-5xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                      5,000+
                    </div>
                    <div className="text-white/80">Teachers Trained</div>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* Training Programs */}
        <section className="py-24 bg-white">
          <Container>
            <div
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Professional Development Programs
              </h2>
              <p className="text-lg text-gray-600">
                Comprehensive training options designed to fit your district&apos;s
                schedule and professional development goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "On-Site Workshops",
                  description: "Full-day or half-day sessions at your campus with hands-on practice and collaborative activities.",
                },
                {
                  title: "Virtual Training",
                  description: "Live online sessions for flexible scheduling, perfect for multi-campus districts.",
                },
                {
                  title: "Self-Paced Modules",
                  description: "On-demand video courses teachers can complete at their own pace with certification.",
                },
                {
                  title: "Coaching Sessions",
                  description: "One-on-one or small group coaching for teachers needing additional support.",
                },
                {
                  title: "Leadership Training",
                  description: "Specialized training for department heads and instructional coaches.",
                },
                {
                  title: "New Teacher Bootcamp",
                  description: "Intensive program for teachers new to test prep instruction.",
                },
              ].map((program, index) => (
                <div
                  key={program.title}
                >
                  <Card className="h-full" hover="lift">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {program.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{program.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Training Topics */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12">
              <div
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
              </div>
              <div
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
              </div>
            </div>
          </Container>
        </section>

        {/* CPE Credits */}
        <section className="py-24 bg-white">
          <Container>
            <div
              className="max-w-3xl mx-auto text-center"
            >
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
            </div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
