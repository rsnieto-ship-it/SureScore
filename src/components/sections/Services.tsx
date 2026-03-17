"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container, Card, CardContent } from "@/components/ui";
import { services } from "@/content/services";

export function Services() {
  return (
    <section className="py-24 bg-gray-50">
      <Container>
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-2 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-full text-sm font-medium mb-4">
            Our Solutions
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
            Everything Your District Needs
          </h2>
          <p className="text-lg text-gray-600">
            From AI-powered test prep to Teacher Incentive Allotment data
            management — built for Texas districts.
          </p>
        </motion.div>

        {/* Services Grid - 2x2 */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={service.href}>
                <Card className="h-full group cursor-pointer" hover="lift">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-3 group-hover:text-[var(--primary-500)] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex items-center text-[var(--primary-500)] font-medium">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
