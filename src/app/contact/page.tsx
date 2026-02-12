"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, Building2, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  district: z.string().min(2, "Please enter your district name"),
  role: z.string().min(1, "Please select your role"),
  interest: z.string().min(1, "Please select your primary interest"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    setIsSubmitted(true);
  };

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
                Connect With Us
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                Request a{" "}
                <span className="text-[var(--secondary-300)]">Demo</span>
              </h1>
              <p className="text-xl text-white/80">
                Ready to boost your district&apos;s CCMR rating? Schedule a demo to see
                how SureScore can help your students become college ready.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-white">
          <Container>
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  Contact Our District Partnerships Team
                </h2>
                <div className="space-y-6">
                  <Card hover="lift">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                        <a
                          href="mailto:info@surescore.com"
                          className="text-[var(--primary-500)] hover:underline"
                        >
                          info@surescore.com
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card hover="lift">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                        <a
                          href="tel:+18885458378"
                          className="text-[var(--primary-500)] hover:underline"
                        >
                          888-545-TEST (8378)
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card hover="lift">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                        <p className="text-gray-600">4301 W Wm Cannon, Ste. B150, Austin, Texas 78749</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                  <a
                    href="https://surescore.edis.io/Account/testlogon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card hover="lift">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-[var(--primary-500)]" />
                        <span className="font-medium text-gray-700">Login</span>
                      </CardContent>
                    </Card>
                  </a>
                  <Link href="/results">
                    <Card hover="lift">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[var(--primary-500)]" />
                        <span className="font-medium text-gray-700">View Results</span>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card variant="elevated">
                  <CardContent className="p-8">
                    {isSubmitted ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Request Received!
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Thank you for your interest. A member of our district partnerships
                          team will contact you within 24 hours to schedule your demo.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} variant="outline">
                          Submit Another Request
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                          Request a District Demo
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Name *
                              </label>
                              <input
                                {...register("name")}
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                                placeholder="Dr. Jane Smith"
                              />
                              {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.name.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                              </label>
                              <input
                                {...register("email")}
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                                placeholder="jsmith@district.edu"
                              />
                              {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                              </label>
                              <input
                                {...register("phone")}
                                type="tel"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                                placeholder="(512) 555-0123"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                District Name *
                              </label>
                              <input
                                {...register("district")}
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                                placeholder="Austin ISD"
                              />
                              {errors.district && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.district.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Role *
                              </label>
                              <select
                                {...register("role")}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                              >
                                <option value="">Select your role</option>
                                <option value="superintendent">Superintendent</option>
                                <option value="assistant-superintendent">Assistant Superintendent</option>
                                <option value="curriculum-director">Director of Curriculum</option>
                                <option value="principal">Principal</option>
                                <option value="counselor">Counselor</option>
                                <option value="teacher">Teacher</option>
                                <option value="other">Other</option>
                              </select>
                              {errors.role && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.role.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primary Interest *
                              </label>
                              <select
                                {...register("interest")}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                              >
                                <option value="">Select your interest</option>
                                <option value="online-solutions">Online Solutions</option>
                                <option value="teacher-training">Teacher Training</option>
                                <option value="curriculum">Customizable Curriculum</option>
                                <option value="partnership">Full District Partnership</option>
                                <option value="general">General Information</option>
                              </select>
                              {errors.interest && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.interest.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tell Us About Your District&apos;s Needs *
                            </label>
                            <textarea
                              {...register("message")}
                              rows={5}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all resize-none"
                              placeholder="Share your district's CCMR goals, current challenges, and what you're hoping to achieve..."
                            />
                            {errors.message && (
                              <p className="mt-1 text-sm text-red-500">
                                {errors.message.message}
                              </p>
                            )}
                          </div>

                          <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              "Submitting..."
                            ) : (
                              <>
                                Request Demo
                                <Send className="ml-2 w-5 h-5" />
                              </>
                            )}
                          </Button>
                        </form>
                      </>
                    )}
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
