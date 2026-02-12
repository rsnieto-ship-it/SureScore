"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { Button, Container } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />

      {/* Animated shapes */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[var(--secondary-500)]/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                Trusted by Texas Districts Since 1995
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-[family-name:var(--font-montserrat)] text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Boost Your{" "}
              <span className="text-[var(--secondary-300)]">CCMR</span>{" "}
              Rating
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/80 mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Texas&apos; trusted TSIA2, SAT, and ACT partner. We guarantee improved
              passing rates through proven test prep, teacher training, and
              data-driven solutions built specifically for Texas school districts.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/services">
                <Button size="lg" className="bg-white text-[var(--primary-600)] hover:bg-gray-100">
                  Explore Solutions
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[var(--primary-600)]"
                >
                  Request a Demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats Preview */}
            <motion.div
              className="flex gap-8 mt-12 pt-8 border-t border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div>
                <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-white">
                  70+
                </div>
                <div className="text-white/70 text-sm">Partner Districts</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-white">
                  179-pt
                </div>
                <div className="text-white/70 text-sm">Avg. SAT Increase</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-white">
                  3.1-pt
                </div>
                <div className="text-white/70 text-sm">Avg. ACT Increase</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[var(--secondary-300)]">
                  TSIA2
                </div>
                <div className="text-white/70 text-sm">Guaranteed Results</div>
              </div>
            </motion.div>
          </div>

          {/* Visual Element */}
          <motion.div
            className="hidden lg:block relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Floating cards */}
              <motion.div
                className="absolute top-0 right-0 bg-white rounded-2xl shadow-2xl p-6 max-w-[200px]"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-8 h-8 text-[var(--secondary-500)]" />
                </div>
                <div className="text-3xl font-bold text-[var(--primary-500)] font-[family-name:var(--font-space-grotesk)]">
                  179-pt
                </div>
                <div className="text-gray-600 text-sm">Avg. SAT Increase</div>
              </motion.div>

              <motion.div
                className="absolute bottom-1/4 left-0 bg-white rounded-2xl shadow-2xl p-6 max-w-[220px]"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-[var(--secondary-500)] rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">Teacher Training</span>
                </div>
                <div className="text-gray-500 text-sm">Empower your educators with proven strategies</div>
              </motion.div>

              <motion.div
                className="absolute top-1/3 right-1/4 bg-[var(--secondary-500)] rounded-2xl shadow-2xl p-4 text-white"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShieldCheck className="w-6 h-6 mb-1" />
                <div className="font-bold">TSIA2 Ready</div>
                <div className="text-white/80 text-sm">Guaranteed Pass Rates</div>
              </motion.div>

              {/* Center circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold font-[family-name:var(--font-montserrat)] text-[var(--primary-600)]">
                      SS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
