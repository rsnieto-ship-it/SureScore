"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container, Card, CardContent } from "@/components/ui";

export function TIACallout() {
  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
            Two Platforms.{" "}
            <span className="text-[var(--primary-500)]">One Mission.</span>
          </h2>
          <p className="text-lg text-gray-600">
            Most districts have great teachers but poor student data &mdash; or
            great student data but no way to reward the teachers who moved the
            needle. SureScore solves both.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {/* Student Achievement */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/services/ai-tutor" className="block group">
              <Card className="h-full" hover="lift">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Student Achievement
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    AI Tutors deliver the content to drive the scores. Personalized
                    TSIA2, SAT, and ACT prep that meets every student where they are.
                  </p>
                  <span className="inline-flex items-center text-[var(--primary-500)] font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                    AI Tutors <ArrowRight className="w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Connection */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <div className="text-center">
              <p className="font-bold text-gray-900 text-sm">
                Test prep success justifies TIA designations.
              </p>
              <p className="font-bold text-gray-900 text-sm mt-2">
                TIA data reveals where prep is needed most.
              </p>
            </div>
          </motion.div>

          {/* Teacher Excellence */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/services/tia-platform" className="block group">
              <Card className="h-full" hover="lift">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Teacher Excellence
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    TIA Platform provides the framework to identify, reward, and
                    keep the teachers who make the difference.
                  </p>
                  <span className="inline-flex items-center text-[var(--primary-500)] font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                    TIA Platform <ArrowRight className="w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>

        {/* The Pitch */}
        <motion.div
          className="mt-16 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <blockquote className="text-xl md:text-2xl font-medium text-gray-800 italic font-[family-name:var(--font-montserrat)] leading-relaxed">
            &ldquo;We don&apos;t just help your students pass the test &mdash;
            we help you identify, reward, and keep the teachers who made it
            possible.&rdquo;
          </blockquote>
        </motion.div>
      </Container>
    </section>
  );
}
