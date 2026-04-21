"use client";

import Link from "next/link";
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
          <div
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
              We Don&apos;t Just Help Students Pass the Test
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              We help you identify, reward, and keep the teachers who made it
              possible. From AI-powered test prep to TIA data management &mdash;
              two platforms, one mission: district success.
            </p>
          </div>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white text-[var(--primary-600)] hover:bg-gray-100 w-full sm:w-auto"
              >
                Request a Demo
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[var(--primary-600)] w-full sm:w-auto"
              >
                View Solutions
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            className="mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-white/60 text-sm mb-4">Trusted by Texas school districts since 1995</p>
            <div className="flex flex-wrap justify-center gap-8 text-white/40 text-sm">
              <span>70+ Partner Districts</span>
              <span>|</span>
              <span>TEKS & CCMR Aligned</span>
              <span>|</span>
              <span>Proven Results</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
