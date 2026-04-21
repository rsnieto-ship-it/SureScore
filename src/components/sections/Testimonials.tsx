"use client";

import { Container, Card, CardContent } from "@/components/ui";
import { testimonials } from "@/content/testimonials";

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <Container>
        {/* Section Header */}
        <div
          className="text-center max-w-3xl mx-auto mb-16"
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
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
            >
              <Card className="h-full" variant="elevated" hover="lift">
                <CardContent className="p-6">
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
                      <div className="text-xs text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
