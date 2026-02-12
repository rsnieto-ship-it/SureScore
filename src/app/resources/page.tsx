"use client";

import { motion } from "framer-motion";
import { FileText, Video, Download, BookOpen, Users, BarChart3, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

const resourceCategories = [
  {
    id: "guides",
    title: "Implementation Guides",
    description: "Step-by-step guides for districts implementing SureScore solutions",
    icon: <BookOpen className="w-8 h-8" />,
    resources: [
      { title: "District Partnership Quick Start Guide", type: "PDF", size: "2.4 MB" },
      { title: "Teacher Training Implementation Handbook", type: "PDF", size: "3.1 MB" },
      { title: "CCMR Improvement Planning Workbook", type: "PDF", size: "1.8 MB" },
      { title: "Platform Administrator Setup Guide", type: "PDF", size: "1.2 MB" },
    ],
  },
  {
    id: "webinars",
    title: "Webinars & Training Videos",
    description: "On-demand video resources for administrators and teachers",
    icon: <Video className="w-8 h-8" />,
    resources: [
      { title: "Maximizing CCMR Outcomes with SureScore", type: "Video", duration: "45 min" },
      { title: "Data-Driven Instruction Strategies", type: "Video", duration: "30 min" },
      { title: "Platform Dashboard Deep Dive", type: "Video", duration: "25 min" },
      { title: "Teacher Best Practices Workshop", type: "Video", duration: "60 min" },
    ],
  },
  {
    id: "research",
    title: "Research & White Papers",
    description: "Evidence-based insights on college readiness and CCMR improvement",
    icon: <FileText className="w-8 h-8" />,
    resources: [
      { title: "The State of CCMR in Texas: 2024 Report", type: "PDF", size: "4.2 MB" },
      { title: "Effective Test Prep Strategies for Districts", type: "PDF", size: "2.8 MB" },
      { title: "Teacher Training Impact on Student Outcomes", type: "PDF", size: "1.9 MB" },
      { title: "Data-Driven Approaches to College Readiness", type: "PDF", size: "3.5 MB" },
    ],
  },
  {
    id: "templates",
    title: "Planning Templates",
    description: "Customizable templates for district planning and reporting",
    icon: <BarChart3 className="w-8 h-8" />,
    resources: [
      { title: "Annual CCMR Improvement Plan Template", type: "XLSX", size: "156 KB" },
      { title: "Teacher Training Schedule Template", type: "DOCX", size: "89 KB" },
      { title: "Student Progress Report Template", type: "XLSX", size: "124 KB" },
      { title: "Board Presentation Template", type: "PPTX", size: "2.1 MB" },
    ],
  },
];

const upcomingWebinars = [
  {
    title: "CCMR Strategies for the 2024-25 School Year",
    date: "January 25, 2025",
    time: "2:00 PM CST",
    presenter: "Dr. Maria Santos, Valley View ISD",
  },
  {
    title: "Leveraging Data to Drive Student Success",
    date: "February 8, 2025",
    time: "3:00 PM CST",
    presenter: "Roy Nieto, CEO, SureScore",
  },
  {
    title: "Teacher Training Best Practices Panel",
    date: "February 22, 2025",
    time: "2:00 PM CST",
    presenter: "Multiple District Leaders",
  },
];

export default function ResourcesPage() {
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
                District Resources
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                Resources for{" "}
                <span className="text-[var(--secondary-300)]">District Success</span>
              </h1>
              <p className="text-xl text-white/80">
                Access guides, webinars, research, and templates to help your district
                maximize the impact of your SureScore partnership.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Resource Categories */}
        <section className="py-24 bg-white">
          <Container>
            <div className="space-y-16">
              {resourceCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-16 h-16 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center flex-shrink-0">
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-2">
                        {category.title}
                      </h2>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {category.resources.map((resource, resourceIndex) => (
                      <motion.div
                        key={resource.title}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (categoryIndex * 0.1) + (resourceIndex * 0.05) }}
                      >
                        <Card hover="lift" className="cursor-pointer">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {resource.type === "Video" ? (
                                <Video className="w-5 h-5 text-[var(--primary-500)]" />
                              ) : (
                                <FileText className="w-5 h-5 text-[var(--primary-500)]" />
                              )}
                              <div>
                                <h3 className="font-medium text-gray-900">{resource.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {resource.type}
                                  {(resource as { size?: string }).size && ` • ${(resource as { size?: string }).size}`}
                                  {(resource as { duration?: string }).duration && ` • ${(resource as { duration?: string }).duration}`}
                                </p>
                              </div>
                            </div>
                            <Download className="w-5 h-5 text-gray-400" />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Upcoming Webinars */}
        <section className="py-24 bg-gray-50">
          <Container>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-[var(--secondary-100)] text-[var(--secondary-600)] rounded-full text-sm font-medium mb-4">
                Live Events
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-4">
                Upcoming Webinars
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join live sessions with district leaders and SureScore experts to learn
                best practices and ask questions.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {upcomingWebinars.map((webinar, index) => (
                <motion.div
                  key={webinar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full" hover="lift">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-[var(--secondary-100)] text-[var(--secondary-500)] rounded-xl flex items-center justify-center mb-4">
                        <Video className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-2">
                        {webinar.title}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p>{webinar.date} • {webinar.time}</p>
                        <p className="text-[var(--primary-500)]">{webinar.presenter}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Register Now
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Partner Portal */}
        <section className="py-24 bg-white">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Partner District Portal
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Current SureScore partner districts have access to our exclusive partner
                  portal with additional resources, support tools, and direct communication
                  channels.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Exclusive partner-only training materials",
                    "Direct access to your District Success Manager",
                    "Custom reporting and analytics dashboards",
                    "Priority support ticket system",
                    "Partner community forum and networking",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-[var(--secondary-500)] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://surescore.edis.io/Account/testlogon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    Access Partner Portal
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card variant="gradient" className="p-8">
                  <div className="text-center">
                    <Users className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Not Yet a Partner?</h3>
                    <p className="text-white/80 mb-6">
                      Learn how your district can benefit from a SureScore partnership.
                    </p>
                    <Link href="/contact">
                      <Button className="bg-white text-[var(--primary-600)] hover:bg-gray-100">
                        Request a Demo
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
