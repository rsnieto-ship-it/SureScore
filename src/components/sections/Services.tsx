"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Monitor, Users, BookOpen, Handshake, Database, Zap } from "lucide-react";
import { Container, Card, CardContent } from "@/components/ui";
import { services } from "@/content/services";

const icons: { [key: string]: React.ReactNode } = {
  "online-solutions": <Monitor className="w-8 h-8" />,
  "teacher-training": <Users className="w-8 h-8" />,
  "customizable-curriculum": <BookOpen className="w-8 h-8" />,
  "district-partnership": <Handshake className="w-8 h-8" />,
  "tia-platform": <Database className="w-8 h-8" />,
  "strategy-of-the-day": <Zap className="w-8 h-8" />,
};

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
            District Solutions
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
            Comprehensive Solutions for{" "}
            <span className="text-[var(--primary-500)]">Texas Districts</span>
          </h2>
          <p className="text-lg text-gray-600">
            Partner with us to boost your CCMR rating through our integrated approach
            combining technology, professional development, and customizable curriculum.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="w-16 h-16 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--primary-500)] group-hover:text-white transition-colors">
                      {icons[service.id]}
                    </div>
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

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/services"
            className="inline-flex items-center text-[var(--primary-500)] font-semibold hover:text-[var(--primary-600)] transition-colors"
          >
            Explore All Solutions
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
