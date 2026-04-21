"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />

      {/* Animated shapes */}
      <div
        className="absolute top-1/4 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[var(--secondary-500)]/20 rounded-full blur-3xl"
      />

      <Container className="relative z-10">
        {/* Umbrella Narrative */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div
          >
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
              Trusted by Texas Districts Since 1995
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-[family-name:var(--font-montserrat)] text-white leading-tight mb-6"
          >
            Where{" "}
            <span className="text-[var(--secondary-300)]">Teacher Excellence</span>
            {" "}Meets{" "}
            <span className="text-[var(--secondary-300)]">Student Achievement</span>
          </h1>

          <p
            className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
          >
            We empower Texas districts to bridge the gap between teacher
            excellence and student achievement &mdash; the two sides of district
            success.
          </p>
        </div>

        {/* Two Doors */}
        <div
          className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {/* Door 1: Student Achievement */}
          <Link href="/services/ai-tutor" className="group block">
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-10 hover:bg-white/15 hover:border-white/40 transition-all duration-300 h-full">
              <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-3">
                Boost Student Scores
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                AI-powered TSIA2, SAT, and ACT prep that personalizes to every
                student&apos;s gaps. Mastery-based learning through Socratic
                dialogue &mdash; available 24/7.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span className="text-[var(--secondary-300)]">&#10003;</span>
                  <span>179-pt avg. SAT increase</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span className="text-[var(--secondary-300)]">&#10003;</span>
                  <span>3.1-pt avg. ACT increase</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span className="text-[var(--secondary-300)]">&#10003;</span>
                  <span>Guaranteed TSIA2 results</span>
                </div>
              </div>
              <span className="inline-flex items-center text-[var(--secondary-300)] font-semibold group-hover:gap-3 gap-2 transition-all">
                Explore AI Tutor
                <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </Link>

          {/* Door 2: Teacher Excellence */}
          <Link href="/services/tia-platform" className="group block">
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-10 hover:bg-white/15 hover:border-white/40 transition-all duration-300 h-full">
              <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-3">
                Retain Top Talent
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Streamline your Teacher Incentive Allotment workflows &mdash;
                automated roster matching, multi-vendor integration, and
                submission-ready TEA files.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span className="text-[var(--secondary-300)]">&#10003;</span>
                  <span>12 assessment vendor integrations</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span className="text-[var(--secondary-300)]">&#10003;</span>
                  <span>TEA-aligned growth calculations</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span className="text-[var(--secondary-300)]">&#10003;</span>
                  <span>One-click 30-column TEA output</span>
                </div>
              </div>
              <span className="inline-flex items-center text-[var(--secondary-300)] font-semibold group-hover:gap-3 gap-2 transition-all">
                Explore TIA Platform
                <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </Link>
        </div>

        {/* Stats bar */}
        <div
          className="flex flex-wrap justify-center gap-8 md:gap-12 mt-16 pt-8 border-t border-white/20 max-w-3xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-white">
              70+
            </div>
            <div className="text-white/70 text-sm">Partner Districts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-white">
              30+
            </div>
            <div className="text-white/70 text-sm">Years in Texas Ed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[var(--secondary-300)]">
              2
            </div>
            <div className="text-white/70 text-sm">Platforms, One Mission</div>
          </div>
        </div>
      </Container>

    </section>
  );
}
