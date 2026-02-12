"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calculator,
  Calendar,
  FileText,
  GraduationCap,
  Users,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

const tools = [
  {
    icon: <Calculator className="w-8 h-8" />,
    title: "College Cost Calculator",
    description:
      "Estimate the true cost of attendance at different universities, including tuition, fees, room, and board.",
    link: "https://bigfuture.collegeboard.org/pay-for-college/college-costs/college-costs-calculator",
    external: true,
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Application Timeline",
    description:
      "Stay on track with our comprehensive college application timeline, from junior year through decision day.",
    link: "/college-tools/timeline",
    external: false,
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Essay Writing Tips",
    description:
      "Learn how to craft compelling college essays that showcase your unique story and stand out to admissions officers.",
    link: "/blog/college-essay-tips",
    external: false,
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "SAT/ACT Score Comparison",
    description:
      "Compare your SAT and ACT scores to understand which test showcases your abilities better.",
    link: "https://www.act.org/content/act/en/products-and-services/the-act/scores/act-sat-concordance.html",
    external: true,
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Scholarship Finder",
    description:
      "Discover scholarships you qualify for based on your academic profile, interests, and background.",
    link: "https://bigfuture.collegeboard.org/scholarship-search",
    external: true,
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "College Match Tool",
    description:
      "Find colleges that match your preferences for size, location, majors, and campus culture.",
    link: "https://bigfuture.collegeboard.org/college-search",
    external: true,
  },
];

const resources = [
  {
    title: "For Parents",
    description: "Resources to help parents support their students through the college prep journey.",
    href: "/college-tools/parent-resources",
    items: [
      "Understanding the test prep timeline",
      "How to support without overwhelming",
      "Financial aid and scholarship guidance",
      "Communication tips for test anxiety",
    ],
  },
  {
    title: "For Minority Students",
    description: "Special resources and opportunities for underrepresented students.",
    href: "/college-tools/minority-resources",
    items: [
      "Diversity scholarships database",
      "First-generation student resources",
      "Cultural organizations at colleges",
      "Mentorship programs",
    ],
  },
];

export default function CollegeToolsPage() {
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
                Resources
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                College{" "}
                <span className="text-[var(--secondary-300)]">Tools</span>
              </h1>
              <p className="text-xl text-white/80">
                Free resources to help you navigate the college preparation and
                application process successfully.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Tools Grid */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Essential Tools
              </h2>
              <p className="text-lg text-gray-600">
                Helpful tools and calculators to make your college journey easier.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {tool.external ? (
                    <a href={tool.link} target="_blank" rel="noopener noreferrer">
                      <Card className="h-full group cursor-pointer" hover="lift">
                        <CardContent className="p-6">
                          <div className="w-14 h-14 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[var(--primary-500)] group-hover:text-white transition-colors">
                            {tool.icon}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            {tool.title}
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </h3>
                          <p className="text-gray-600 text-sm">{tool.description}</p>
                        </CardContent>
                      </Card>
                    </a>
                  ) : (
                    <Link href={tool.link}>
                      <Card className="h-full group cursor-pointer" hover="lift">
                        <CardContent className="p-6">
                          <div className="w-14 h-14 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[var(--primary-500)] group-hover:text-white transition-colors">
                            {tool.icon}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {tool.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{tool.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Resource Categories */}
        <section className="py-24 bg-gray-50">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Specialized Resources
              </h2>
              <p className="text-lg text-gray-600">
                Targeted resources for specific audiences and needs.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full" variant="elevated">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-4">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 mb-6">{resource.description}</p>
                      <ul className="space-y-3 mb-6">
                        {resource.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-gray-700">
                            <span className="w-1.5 h-1.5 bg-[var(--primary-500)] rounded-full mt-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link href={resource.href}>
                        <Button variant="outline" className="w-full">
                          Explore Resources
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Diagnostic Test CTA */}
        <section className="py-24 bg-white">
          <Container size="md">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card variant="gradient" className="p-12">
                <h2 className="text-3xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-4">
                  Ready to See Where You Stand?
                </h2>
                <p className="text-white/80 mb-8 max-w-xl mx-auto">
                  Take our free diagnostic test to identify your strengths and areas
                  for improvement. Get personalized recommendations for your test
                  prep journey.
                </p>
                <a
                  href="https://surescore.edis.io/Account/testlogon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-white text-[var(--primary-600)] hover:bg-gray-100"
                  >
                    Take Free Diagnostic Test
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              </Card>
            </motion.div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
