"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Handshake, BarChart3, Users, BookOpen, Monitor, Award, Phone, Mail } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

export default function DistrictPartnershipPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-600)]">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href="/services"
                  className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back to Solutions
                </Link>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                  District{" "}
                  <span className="text-[var(--secondary-300)]">Partnership</span>
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  An end-to-end partnership model combining online solutions, teacher
                  training, and curriculum to maximize your district&apos;s CCMR outcomes
                  with dedicated support every step of the way.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-white text-[var(--primary-600)] hover:bg-gray-100">
                      Become a Partner
                    </Button>
                  </Link>
                  <Link href="/results">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary-600)]">
                      View Partner Results
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:block"
              >
                <Card variant="glass" className="p-8 text-white">
                  <div className="text-center">
                    <Handshake className="w-16 h-16 mx-auto mb-4 text-[var(--secondary-300)]" />
                    <div className="text-5xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                      70+
                    </div>
                    <div className="text-white/80">Partner Districts</div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* What's Included */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Complete Partnership Package
              </h2>
              <p className="text-lg text-gray-600">
                Our comprehensive partnership combines all SureScore solutions with
                dedicated support for maximum impact on your CCMR outcomes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Monitor className="w-8 h-8" />,
                  title: "Online Platform",
                  description: "Full access to our digital learning platform for all students district-wide.",
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Teacher Training",
                  description: "Comprehensive professional development for all participating educators.",
                },
                {
                  icon: <BookOpen className="w-8 h-8" />,
                  title: "Custom Curriculum",
                  description: "Tailored curriculum materials aligned to your district's needs.",
                },
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Data & Analytics",
                  description: "Advanced reporting and analytics dashboards for administrators.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full" hover="lift">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Partnership Benefits */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Partnership Benefits
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Partner districts receive exclusive benefits designed to ensure
                  long-term success in achieving CCMR goals.
                </p>
                <ul className="space-y-4">
                  {[
                    "Dedicated District Success Manager",
                    "Priority technical support (4-hour response)",
                    "Quarterly strategy and progress reviews",
                    "Annual curriculum updates included",
                    "Unlimited teacher training seats",
                    "Custom reporting and board presentations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[var(--secondary-500)] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Implementation Support
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  We guide your district through every phase of implementation
                  to ensure smooth adoption and measurable results.
                </p>
                <ul className="space-y-4">
                  {[
                    "Detailed implementation timeline",
                    "SIS integration and rostering support",
                    "On-site kickoff sessions",
                    "Ongoing coaching for teachers",
                    "Mid-year data analysis and adjustments",
                    "Year-end CCMR impact report",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[var(--secondary-500)] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Partnership Tiers */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Partnership Options
              </h2>
              <p className="text-lg text-gray-600">
                Flexible partnership structures designed to meet the needs of
                districts of all sizes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Essentials",
                  description: "Foundation partnership for districts getting started with comprehensive test prep.",
                  features: [
                    "Online platform access",
                    "Core curriculum materials",
                    "Virtual teacher training",
                    "Email support",
                    "Standard reporting",
                  ],
                },
                {
                  title: "Professional",
                  description: "Enhanced partnership with dedicated support and advanced features.",
                  features: [
                    "Everything in Essentials",
                    "Custom curriculum options",
                    "On-site training sessions",
                    "Dedicated success manager",
                    "Advanced analytics",
                  ],
                  featured: true,
                },
                {
                  title: "Enterprise",
                  description: "Comprehensive partnership for large districts with complex needs.",
                  features: [
                    "Everything in Professional",
                    "Multi-year planning",
                    "Executive strategy sessions",
                    "Custom integrations",
                    "White-glove support",
                  ],
                },
              ].map((tier, index) => (
                <motion.div
                  key={tier.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`h-full ${tier.featured ? "ring-2 ring-[var(--primary-500)]" : ""}`}
                    variant="elevated"
                  >
                    <CardContent className="p-8">
                      {tier.featured && (
                        <span className="inline-block px-3 py-1 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-full text-xs font-medium mb-4">
                          Most Popular
                        </span>
                      )}
                      <h3 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-2">
                        {tier.title}
                      </h3>
                      <p className="text-gray-600 mb-6">{tier.description}</p>
                      <ul className="space-y-3 mb-8">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-[var(--secondary-500)]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link href="/contact">
                        <Button
                          className="w-full"
                          variant={tier.featured ? "primary" : "outline"}
                        >
                          Get Started
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-gray-50">
          <Container>
            <motion.div
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Award className="w-16 h-16 text-[var(--primary-500)] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Ready to Partner with SureScore?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Contact our district partnerships team to discuss how we can help
                your district achieve its CCMR goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a
                  href="tel:+18885458378"
                  className="inline-flex items-center justify-center gap-2 text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium"
                >
                  <Phone className="w-5 h-5" />
                  888-545-TEST (8378)
                </a>
                <a
                  href="mailto:info@surescore.com"
                  className="inline-flex items-center justify-center gap-2 text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium"
                >
                  <Mail className="w-5 h-5" />
                  info@surescore.com
                </a>
              </div>
              <Link href="/contact">
                <Button size="lg">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
