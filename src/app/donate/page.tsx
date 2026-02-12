"use client";

import { motion } from "framer-motion";
import { Heart, Users, BookOpen, Star } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";

const impactStats = [
  { value: "500+", label: "Students Supported Annually" },
  { value: "$2M+", label: "Scholarships Awarded" },
  { value: "100%", label: "Funds Go to Students" },
];

const donationTiers = [
  {
    amount: 50,
    title: "Study Materials",
    description: "Provides practice tests and study guides for one student.",
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    amount: 100,
    title: "Tutorial Session",
    description: "Sponsors a one-on-one tutoring session for a student in need.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    amount: 200,
    title: "Full Program Access",
    description: "Gives a deserving student full access to our test prep program.",
    icon: <Star className="w-6 h-6" />,
    featured: true,
  },
  {
    amount: 500,
    title: "Scholarship Fund",
    description: "Contributes to our scholarship fund for underserved students.",
    icon: <Heart className="w-6 h-6" />,
  },
];

export default function DonatePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-[var(--primary-800)] to-[var(--secondary-600)]">
          <Container>
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                Support Student{" "}
                <span className="text-[var(--secondary-300)]">Success</span>
              </h1>
              <p className="text-xl text-white/80">
                Your donation helps provide quality test preparation to students
                who might not otherwise have access. Every dollar makes a difference.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Impact Stats */}
        <section className="py-12 bg-[var(--primary-900)]">
          <Container>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[var(--secondary-300)]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Donation Tiers */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Make a Donation
              </h2>
              <p className="text-lg text-gray-600">
                Choose a donation amount or enter a custom amount to support student
                success.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {donationTiers.map((tier, index) => (
                <motion.div
                  key={tier.amount}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`h-full ${
                      tier.featured
                        ? "border-2 border-[var(--primary-500)] relative"
                        : ""
                    }`}
                    hover="lift"
                  >
                    {tier.featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--primary-500)] text-white text-xs font-medium rounded-full">
                        Most Popular
                      </div>
                    )}
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {tier.icon}
                      </div>
                      <div className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-gray-900 mb-2">
                        ${tier.amount}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {tier.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6">
                        {tier.description}
                      </p>
                      <Button
                        className="w-full"
                        variant={tier.featured ? "primary" : "outline"}
                      >
                        Donate ${tier.amount}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Custom Amount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto"
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-center">
                    Custom Amount
                  </h3>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
                      />
                    </div>
                    <Button>Donate</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Container>
        </section>

        {/* Why Donate */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Why Your Support Matters
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Many talented students lack access to quality test preparation due
                  to financial constraints. Your donation helps level the playing
                  field and gives these students a fair chance at achieving their
                  academic dreams.
                </p>
                <ul className="space-y-4">
                  {[
                    "100% of donations go directly to student programs",
                    "Tax-deductible contributions",
                    "Transparent reporting on fund usage",
                    "Direct impact on student outcomes",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-[var(--accent-500)] flex-shrink-0 mt-0.5" />
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
                <Card className="bg-[var(--primary-50)] border-[var(--primary-200)]">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Corporate Partnerships
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Interested in making a larger impact? We partner with
                      corporations to sponsor entire programs and classrooms. Contact
                      us to learn more about corporate giving opportunities.
                    </p>
                    <Button variant="outline" className="w-full">
                      Contact Us About Partnerships
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
