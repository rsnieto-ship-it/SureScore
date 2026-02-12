"use client";

import { motion } from "framer-motion";
import { TrendingUp, Building2, GraduationCap, Award, CheckCircle, ArrowRight, Quote } from "lucide-react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

const caseStudies = [
  {
    district: "Valley View ISD",
    location: "South Texas",
    challenge: "CCMR rating below state average, limited college readiness resources",
    solution: "Full district partnership with online platform, teacher training, and custom curriculum",
    results: [
      { metric: "CCMR Rating", before: "42%", after: "60%", improvement: "+18%" },
      { metric: "SAT College Ready", before: "28%", after: "45%", improvement: "+17%" },
      { metric: "TSIA2 Passing", before: "35%", after: "52%", improvement: "+17%" },
    ],
    quote: "SureScore transformed our district's approach to college readiness. The results speak for themselves.",
    quotePerson: "Dr. Maria Santos, Superintendent",
  },
  {
    district: "Lone Star Consolidated ISD",
    location: "Central Texas",
    challenge: "Inconsistent test prep across campuses, limited teacher training",
    solution: "District-wide teacher training program with standardized curriculum implementation",
    results: [
      { metric: "CCMR Rating", before: "55%", after: "68%", improvement: "+13%" },
      { metric: "Teacher Confidence", before: "45%", after: "92%", improvement: "+47%" },
      { metric: "Student Engagement", before: "60%", after: "85%", improvement: "+25%" },
    ],
    quote: "Our teachers now have the tools and confidence to prepare every student for college success.",
    quotePerson: "Dr. James Wilson, Director of Curriculum",
  },
  {
    district: "Prairie Heights ISD",
    location: "North Texas",
    challenge: "Rural district with limited resources, difficulty retaining qualified teachers",
    solution: "Online solutions with virtual support and self-paced teacher training modules",
    results: [
      { metric: "CCMR Rating", before: "38%", after: "54%", improvement: "+16%" },
      { metric: "ACT Composite", before: "19.2", after: "22.1", improvement: "+2.9" },
      { metric: "College Applications", before: "45%", after: "72%", improvement: "+27%" },
    ],
    quote: "SureScore made comprehensive college prep accessible for our rural students.",
    quotePerson: "Sarah Martinez, Principal",
  },
];

export default function ResultsPage() {
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
                Proven Results
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                Real Results from{" "}
                <span className="text-[var(--secondary-300)]">Real Districts</span>
              </h1>
              <p className="text-xl text-white/80">
                See how Texas school districts have transformed their CCMR outcomes
                with SureScore&apos;s comprehensive college readiness solutions.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Overall Impact Stats */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-4">
                Our Collective Impact
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Aggregate results across our 70+ partner districts demonstrate consistent,
                measurable improvements in college readiness outcomes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: <TrendingUp className="w-8 h-8" />, value: "15%", label: "Average CCMR Improvement" },
                { icon: <Building2 className="w-8 h-8" />, value: "70+", label: "Partner Districts" },
                { icon: <GraduationCap className="w-8 h-8" />, value: "2M+", label: "Students Served" },
                { icon: <Award className="w-8 h-8" />, value: "98%", label: "District Retention Rate" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center" hover="lift">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {stat.icon}
                      </div>
                      <div className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-gray-900 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-gray-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Case Studies */}
        <section className="py-24 bg-gray-50">
          <Container>
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-[var(--secondary-100)] text-[var(--secondary-600)] rounded-full text-sm font-medium mb-4">
                Case Studies
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-4">
                District Success Stories
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Detailed looks at how specific districts have achieved exceptional results
                with SureScore solutions.
              </p>
            </motion.div>

            <div className="space-y-12">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.district}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="elevated">
                    <CardContent className="p-8">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left: District Info */}
                        <div>
                          <div className="flex items-center gap-2 text-[var(--primary-500)] text-sm font-medium mb-2">
                            <Building2 className="w-4 h-4" />
                            {study.location}
                          </div>
                          <h3 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-4">
                            {study.district}
                          </h3>

                          <div className="space-y-4 mb-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Challenge</h4>
                              <p className="text-gray-600 text-sm">{study.challenge}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Solution</h4>
                              <p className="text-gray-600 text-sm">{study.solution}</p>
                            </div>
                          </div>

                          {/* Quote */}
                          <div className="bg-[var(--primary-50)] rounded-xl p-4">
                            <Quote className="w-6 h-6 text-[var(--primary-300)] mb-2" />
                            <p className="text-gray-700 italic text-sm mb-2">&quot;{study.quote}&quot;</p>
                            <p className="text-[var(--primary-600)] font-medium text-sm">{study.quotePerson}</p>
                          </div>
                        </div>

                        {/* Right: Results */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Results</h4>
                          <div className="space-y-4">
                            {study.results.map((result) => (
                              <div
                                key={result.metric}
                                className="bg-gray-50 rounded-xl p-4"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium text-gray-900">{result.metric}</span>
                                  <span className="text-[var(--secondary-500)] font-bold">
                                    {result.improvement}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex-1">
                                    <div className="text-xs text-gray-500 mb-1">Before</div>
                                    <div className="text-lg font-[family-name:var(--font-space-grotesk)] text-gray-600">
                                      {result.before}
                                    </div>
                                  </div>
                                  <ArrowRight className="w-5 h-5 text-gray-400" />
                                  <div className="flex-1">
                                    <div className="text-xs text-gray-500 mb-1">After</div>
                                    <div className="text-lg font-[family-name:var(--font-space-grotesk)] text-[var(--primary-600)] font-bold">
                                      {result.after}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
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

        {/* Success Factors */}
        <section className="py-24 bg-white">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  What Drives Our Results
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Our success comes from a comprehensive approach that addresses
                  all aspects of college readiness preparation.
                </p>
                <ul className="space-y-4">
                  {[
                    "Data-driven diagnostic assessments identify individual student needs",
                    "TEKS-aligned curriculum ensures state standards coverage",
                    "Professional development empowers teachers with proven strategies",
                    "Ongoing support and progress monitoring enable continuous improvement",
                    "Flexible implementation adapts to each district's unique context",
                    "Strong partnerships create sustainable, long-term success",
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
                <Card variant="gradient" className="p-8 text-center">
                  <div className="text-6xl font-bold font-[family-name:var(--font-space-grotesk)] mb-4">
                    98%
                  </div>
                  <div className="text-xl font-semibold mb-2">District Retention Rate</div>
                  <p className="text-white/80 text-sm">
                    Districts that partner with SureScore continue their partnership
                    year after year, demonstrating our commitment to long-term success.
                  </p>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gray-50">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Ready to Achieve Similar Results?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join 70+ Texas districts that have transformed their CCMR outcomes
                with SureScore. Schedule a demo to learn how we can help your district.
              </p>
              <Link href="/contact">
                <Button size="lg">
                  Request a Demo
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
