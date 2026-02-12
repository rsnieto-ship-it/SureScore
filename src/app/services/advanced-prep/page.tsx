"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Star, Trophy, Zap, Target } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

export default function AdvancedPrepPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-[var(--primary-900)] via-[var(--primary-800)] to-[var(--secondary-700)]">
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
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-500)] rounded-full text-white text-sm font-medium mb-6">
                  <Star className="w-4 h-4" />
                  Elite Program
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                  Advanced{" "}
                  <span className="text-[var(--secondary-300)]">Prep</span>
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  Rigorous ACT and SAT preparation for top-scoring students targeting
                  the 99th percentile. Encompasses all other SureScore solutions with
                  enhanced instruction.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/booking">
                    <Button size="lg" className="bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white">
                      Apply Now
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary-600)]">
                      Learn More
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
                  <Card variant="glass" className="p-6 text-white text-center">
                    <Trophy className="w-10 h-10 mx-auto mb-3" />
                    <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)]">99th</div>
                    <div className="text-white/80 text-sm">Percentile Target</div>
                  </Card>
                  <Card variant="glass" className="p-6 text-white text-center">
                    <Target className="w-10 h-10 mx-auto mb-3" />
                    <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)]">1500+</div>
                    <div className="text-white/80 text-sm">SAT Goal</div>
                  </Card>
                  <Card variant="glass" className="p-6 text-white text-center">
                    <Zap className="w-10 h-10 mx-auto mb-3" />
                    <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)]">34+</div>
                    <div className="text-white/80 text-sm">ACT Goal</div>
                  </Card>
                  <Card variant="glass" className="p-6 text-white text-center">
                    <Star className="w-10 h-10 mx-auto mb-3" />
                    <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)]">Elite</div>
                    <div className="text-white/80 text-sm">Instruction</div>
                  </Card>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Who It's For */}
        <section className="py-24 bg-white">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Is Advanced Prep Right for You?
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  This elite program is designed for high-achieving students who are
                  already performing well but want to reach the very top percentiles.
                </p>
                <ul className="space-y-4">
                  {[
                    "Currently scoring 1300+ SAT or 28+ ACT",
                    "Targeting Ivy League or top-tier universities",
                    "Committed to intensive preparation",
                    "Ready for challenging coursework",
                    "Seeking competitive scholarships",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[var(--accent-500)] flex-shrink-0 mt-0.5" />
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
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
                  <h3 className="text-2xl font-bold mb-6">Program Highlights</h3>
                  <ul className="space-y-4">
                    {[
                      "One-on-one coaching sessions",
                      "Advanced problem-solving techniques",
                      "Personalized weakness analysis",
                      "Unlimited practice test access",
                      "College application guidance",
                      "Score guarantee program",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-[var(--accent-500)] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
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
