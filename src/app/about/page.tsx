"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Handshake, BarChart3, Award, CheckCircle, Building2, GraduationCap, TrendingUp } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent } from "@/components/ui";
import { companyInfo } from "@/content/team";
import { CTA } from "@/components/sections";

const valueIcons: { [key: string]: React.ReactNode } = {
  "Results-Driven": <Target className="w-6 h-6" />,
  "Partnership-Focused": <Handshake className="w-6 h-6" />,
  "Data-Informed": <BarChart3 className="w-6 h-6" />,
  Excellence: <Award className="w-6 h-6" />,
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-600)]">
          <Container>
            <motion.div
              className="max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                About SureScore
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                Partnering with Texas Districts Since{" "}
                <span className="text-[var(--secondary-300)]">1995</span>
              </h1>
              <p className="text-xl text-white/80">
                For three decades, SureScore has been helping Texas school
                districts improve their CCMR ratings and get more students college
                ready through comprehensive, data-driven solutions.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-white">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {companyInfo.mission}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Our Vision
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {companyInfo.vision}
                </p>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Impact Stats */}
        <section className="py-24 bg-[var(--primary-600)]">
          <Container>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-4">
                Our Impact Across Texas
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Measurable results that speak to our commitment to district success.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: <Building2 className="w-8 h-8" />, value: "70+", label: "Partner Districts" },
                { icon: <TrendingUp className="w-8 h-8" />, value: "179", label: "Avg. SAT Point Increase" },
                { icon: <GraduationCap className="w-8 h-8" />, value: "3.1", label: "Avg. ACT Point Increase" },
                { icon: <Award className="w-8 h-8" />, value: "30+", label: "Years of Excellence" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Values */}
        <section className="py-24 bg-gray-50">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600">
                These principles guide our partnerships with Texas school districts.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companyInfo.values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center" hover="lift">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        {valueIcons[value.title]}
                      </div>
                      <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Founder Section */}
        <section className="py-24 bg-white">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full max-w-md mx-auto">
                  <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--primary-400)] to-[var(--secondary-400)]">
                    <Image
                      src="/images/team/roy.jpg"
                      alt="Roy Nieto, CEO & Founder of SureScore"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="inline-block px-4 py-2 bg-[var(--secondary-100)] text-[var(--secondary-600)] rounded-full text-sm font-medium mb-4">
                  Our Founder
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Roy Nieto
                </h2>
                <p className="text-[var(--primary-500)] font-semibold text-lg mb-4">
                  CEO & Founder
                </p>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Roy Nieto founded SureScore Inc. in 1995 and serves as its Chief
                    Executive Officer. With over 30 years of experience in college
                    admissions, advisement, and test preparation, he has conducted
                    hundreds of seminars to students, families, and school districts
                    across the United States and Mexico.
                  </p>
                  <p>
                    Prior to launching SureScore, Roy was drafted by the Houston Astros
                    as a pitcher and played for three years in the minor leagues. He has
                    served as director for the College Admissions Training Program at the
                    National Hispanic Institute, and currently works with school districts
                    on predictive analytics to improve education systems and college
                    readiness outcomes.
                  </p>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Why Districts Choose SureScore
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  With three decades of experience, we&apos;ve refined our approach to
                  deliver consistent, measurable CCMR improvements for Texas districts.
                </p>
                <ul className="space-y-4">
                  {[
                    "30+ years exclusively serving Texas districts",
                    "Comprehensive CCMR-focused solutions",
                    "TEKS-aligned curriculum and assessments",
                    "Dedicated district success managers",
                    "Professional development for teachers",
                    "Data-driven progress monitoring",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-[var(--secondary-500)] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="aspect-square bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-3xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-7xl font-bold font-[family-name:var(--font-space-grotesk)]">
                      30+
                    </div>
                    <div className="text-xl mt-2">Years Serving Texas</div>
                  </div>
                </div>
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
