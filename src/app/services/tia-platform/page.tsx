"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Database, Link2, BarChart3, AlertTriangle, FileSpreadsheet, UserCheck } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { CTA } from "@/components/sections";

export default function TIAPlatformPage() {
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
                  TIA Data{" "}
                  <span className="text-[var(--secondary-300)]">Platform</span>
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  Streamline your Teacher Incentive Allotment workflows with automated
                  roster matching, multi-vendor assessment integration, TEA-aligned growth
                  calculations, and submission-ready output files.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-white text-[var(--primary-600)] hover:bg-gray-100">
                      Request a Demo
                    </Button>
                  </Link>
                  <a href="https://surescore.edis.io/Account/testlogon" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary-600)]">
                      Login
                    </Button>
                  </a>
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
                    <Database className="w-16 h-16 mx-auto mb-4 text-[var(--secondary-300)]" />
                    <div className="text-5xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                      7
                    </div>
                    <div className="text-white/80">Assessment Vendors</div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Platform Features */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Platform Features
              </h2>
              <p className="text-lg text-gray-600">
                Everything your district needs to manage TIA data workflows
                efficiently and submit with confidence.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Link2 className="w-8 h-8" />,
                  title: "Automatic Roster Matching",
                  description: "Eliminates manual spreadsheet matching by automatically linking student rosters to assessment records across all vendors.",
                },
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Growth Model Calculations",
                  description: "TEA-aligned growth calculations built in for all supported vendors, removing the need for manual formulas.",
                },
                {
                  icon: <AlertTriangle className="w-8 h-8" />,
                  title: "Error & Gap Flagging",
                  description: "Catches missing data, mismatched records, and formatting issues before you submit to TEA.",
                },
                {
                  icon: <FileSpreadsheet className="w-8 h-8" />,
                  title: "30-Column TEA Output",
                  description: "Generates the exact 30-column file format TEA requires, ready to upload without manual formatting.",
                },
                {
                  icon: <UserCheck className="w-8 h-8" />,
                  title: "Roster Verification Portal",
                  description: "Teachers self-verify their rosters through a dedicated portal, reducing administrative back-and-forth.",
                },
                {
                  icon: <Database className="w-8 h-8" />,
                  title: "Multi-Vendor Integration",
                  description: "Supports iReady, NWEA MAP, STAAR, TeachTown, Exploros, YouScience, and TSIA2 assessment data.",
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
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mb-4">
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

        {/* Before vs After */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  How Districts Managed TIA Before
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Traditional TIA data workflows are time-consuming, error-prone,
                  and require significant manual effort.
                </p>
                <ul className="space-y-4">
                  {[
                    "Manual roster-to-assessment matching in spreadsheets",
                    "Separate data exports from each assessment vendor",
                    "Hand-built growth calculations with custom formulas",
                    "No automated error detection before submission",
                    "Time-consuming back-and-forth with teachers for roster verification",
                    "Manual formatting to meet TEA's 30-column file spec",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold">&times;</span>
                      </div>
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
                  With TIA Platform
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  SureScore&apos;s TIA Platform automates the entire workflow from
                  data ingestion to TEA submission.
                </p>
                <ul className="space-y-4">
                  {[
                    "Automatic roster-to-assessment linking across all vendors",
                    "Single platform integrates data from 12 assessment providers",
                    "TEA-aligned growth models calculated automatically",
                    "Built-in error and gap detection flags issues early",
                    "Self-service Roster Verification Portal for teachers",
                    "One-click generation of submission-ready 30-column TEA files",
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

        {/* Stats */}
        <section className="py-24 bg-[var(--primary-600)]">
          <Container>
            <div className="grid md:grid-cols-4 gap-8 text-center text-white">
              {[
                { value: "12", label: "Assessment Vendors" },
                { value: "30", label: "Column TEA Output" },
                { value: "TEA", label: "Aligned Calculations" },
                { value: "Self", label: "Service Portal" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-space-grotesk)] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/80">{stat.label}</div>
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
