"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Calendar, FileText } from "lucide-react";
import { Container, Button } from "@/components/ui";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-600)] via-[var(--primary-700)] to-[var(--primary-900)]" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--secondary-500)]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--accent-500)]/10 rounded-full blur-3xl" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
              Ready to Transform Your District&apos;s CCMR Outcomes?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Partner with SureScore to implement a comprehensive college readiness
              solution tailored to your district&apos;s needs. Schedule a demo to see
              how we can help.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white text-[var(--primary-600)] hover:bg-gray-100 w-full sm:w-auto"
              >
                <Calendar className="mr-2 w-5 h-5" />
                Request a Demo
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[var(--primary-600)] w-full sm:w-auto"
              >
                <FileText className="mr-2 w-5 h-5" />
                View Solutions
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-12 pt-8 border-t border-white/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-white/60 text-sm mb-4">Trusted by Texas school districts since 1995</p>
            <div className="flex flex-wrap justify-center gap-8 text-white/40 text-sm">
              <span>70+ Partner Districts</span>
              <span>|</span>
              <span>TEKS & CCMR Aligned</span>
              <span>|</span>
              <span>Proven Results</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
