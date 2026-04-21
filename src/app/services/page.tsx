"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { services } from "@/content/services";
import { CTA } from "@/components/sections";

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-600)]">
          <Container>
            <div
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                Solutions for{" "}
                <span className="text-[var(--secondary-300)]">Texas Districts</span>
              </h1>
              <p className="text-xl text-white/80">
                From AI-powered test prep to Teacher Incentive Allotment data
                management — two platforms, one mission: district success.
              </p>
            </div>
          </Container>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-white">
          <Container>
            <div className="space-y-16 max-w-4xl mx-auto">
              {services.map((service, index) => (
                <div
                  key={service.id}
                >
                  <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {service.description}
                  </p>
                  {service.features && (
                    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mb-8">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="text-[var(--secondary-500)] mt-1">&#10003;</span>
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
                  {index < services.length - 1 && (
                    <hr className="mt-16 border-gray-100" />
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                How We Partner with Districts
              </h2>
              <p className="text-lg text-gray-600">
                Our proven process ensures seamless implementation and measurable
                improvements in your district&apos;s outcomes.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Needs Assessment",
                  description:
                    "We analyze your district's current data, student demographics, and specific goals.",
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
                  title: "Ongoing Support",
                  description:
                    "Continuous support, progress monitoring, and strategy refinement.",
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className="text-center"
                >
                  <div className="text-5xl font-bold font-[family-name:var(--font-space-grotesk)] text-[var(--primary-200)] mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
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
