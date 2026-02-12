"use client";

import { motion } from "framer-motion";
import { Star, Quote, Building2 } from "lucide-react";
import { Container, Card, CardContent } from "@/components/ui";
import { testimonials } from "@/content/testimonials";

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <Container>
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-2 bg-[var(--secondary-100)] text-[var(--secondary-600)] rounded-full text-sm font-medium mb-4">
            District Success
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
            Trusted by{" "}
            <span className="text-[var(--secondary-500)]">District Leaders</span>
          </h2>
          <p className="text-lg text-gray-600">
            Hear from superintendents and administrators who have transformed their
            district&apos;s college readiness outcomes with SureScore.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full" variant="elevated" hover="lift">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="w-10 h-10 bg-[var(--primary-100)] rounded-full flex items-center justify-center mb-4">
                    <Quote className="w-5 h-5 text-[var(--primary-500)]" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[var(--accent-500)] text-[var(--accent-500)]"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-400)] to-[var(--secondary-400)] rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.split(" ").map(n => n.charAt(0)).join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
