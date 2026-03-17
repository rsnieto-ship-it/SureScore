"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Container, Button } from "@/components/ui";
import { Testimonials, CTA } from "@/components/sections";

export default function ResultsPage() {
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                Proven{" "}
                <span className="text-[var(--secondary-300)]">Results</span>
              </h1>
              <p className="text-xl text-white/80">
                Trusted by 70+ Texas school districts since 1995. Hear from the
                educators who partner with SureScore.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white">
          <Container>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: "70+", label: "Partner Districts" },
                { value: "179-pt", label: "Avg. SAT Increase" },
                { value: "3.1-pt", label: "Avg. ACT Increase" },
                { value: "30+", label: "Years in Texas Ed" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-[var(--primary-500)] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        <Testimonials />

        {/* CTA to contact */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-4">
                Want to see detailed case studies?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Contact us to learn how SureScore has helped districts like yours
                improve student outcomes and retain top teaching talent.
              </p>
              <Link href="/contact">
                <Button size="lg">Request a Demo</Button>
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
