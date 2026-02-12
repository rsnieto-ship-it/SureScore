"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Monitor, Users, BookOpen, Handshake, CheckCircle, BarChart3, Shield, Clock, Database, Zap } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { services } from "@/content/services";
import { CTA } from "@/components/sections";

const icons: { [key: string]: React.ReactNode } = {
  "online-solutions": <Monitor className="w-10 h-10" />,
  "teacher-training": <Users className="w-10 h-10" />,
  "customizable-curriculum": <BookOpen className="w-10 h-10" />,
  "district-partnership": <Handshake className="w-10 h-10" />,
  "tia-platform": <Database className="w-10 h-10" />,
  "strategy-of-the-day": <Zap className="w-10 h-10" />,
};

export default function ServicesPage() {
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
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                District Solutions
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                Comprehensive Solutions for{" "}
                <span className="text-[var(--secondary-300)]">Texas Districts</span>
              </h1>
              <p className="text-xl text-white/80">
                Partner with SureScore to boost your CCMR rating through our integrated
                approach combining technology, professional development, and customizable
                curriculum designed specifically for Texas school districts.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-white">
          <Container>
            <div className="space-y-16">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="w-20 h-20 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-3xl flex items-center justify-center mb-6">
                      {icons[service.id]}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-4">
                      {service.title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                      {service.description}
                    </p>
                    {service.features && (
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-[var(--secondary-500)] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link href={service.href}>
                      <Button>
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <Card variant="gradient" className="aspect-video flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          {icons[service.id]}
                        </div>
                        <h3 className="text-2xl font-bold">{service.title}</h3>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-gray-50">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                How We Partner with Districts
              </h2>
              <p className="text-lg text-gray-600">
                Our proven process ensures seamless implementation and measurable
                improvements in your district&apos;s CCMR outcomes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Needs Assessment",
                  description:
                    "We analyze your district's current CCMR data, student demographics, and specific goals.",
                },
                {
                  step: "02",
                  title: "Custom Solution Design",
                  description:
                    "We create a tailored implementation plan combining our solutions to meet your needs.",
                },
                {
                  step: "03",
                  title: "Implementation & Training",
                  description:
                    "We deploy the platform, train your teachers, and integrate with your existing systems.",
                },
                {
                  step: "04",
                  title: "Ongoing Support & Analysis",
                  description:
                    "We provide continuous support, progress monitoring, and strategy refinement.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold font-[family-name:var(--font-space-grotesk)] text-[var(--primary-200)] mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Why Choose SureScore */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Why Texas Districts Choose SureScore
              </h2>
              <p className="text-lg text-gray-600">
                30+ years of experience helping Texas school districts achieve
                college readiness goals.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "TEKS Aligned",
                  description: "All materials aligned with Texas Essential Knowledge and Skills standards.",
                },
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Data-Driven",
                  description: "Comprehensive analytics dashboards for administrators and teachers.",
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "Flexible Implementation",
                  description: "Solutions that adapt to your district's schedule and existing programs.",
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Dedicated Support",
                  description: "Assigned district success manager for personalized guidance.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full" hover="lift">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
