"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, CheckCircle, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";

const bookingSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  parentName: z.string().min(2, "Parent/Guardian name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  program: z.string().min(1, "Please select a program"),
  grade: z.string().min(1, "Please select a grade level"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    setIsSubmitted(true);
  };

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
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                Free Consultation
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                Book Your{" "}
                <span className="text-[var(--secondary-300)]">Session</span>
              </h1>
              <p className="text-xl text-white/80">
                Schedule a free consultation to discuss your goals and find the
                perfect program for your needs.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Booking Section */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div className="grid lg:grid-cols-3 gap-12">
              {/* What to Expect */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  What to Expect
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: <Calendar className="w-6 h-6" />,
                      title: "30-Minute Consultation",
                      description: "A focused discussion about your academic goals and needs.",
                    },
                    {
                      icon: <User className="w-6 h-6" />,
                      title: "Personalized Assessment",
                      description: "We'll evaluate your current level and identify areas for improvement.",
                    },
                    {
                      icon: <Clock className="w-6 h-6" />,
                      title: "Custom Recommendations",
                      description: "Receive a tailored program recommendation based on your goals.",
                    },
                  ].map((item, index) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-12 h-12 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-xl flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Card className="mt-8 bg-[var(--primary-50)] border-[var(--primary-200)]">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2">
                      Already know what you need?
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Take our free diagnostic test to get started right away.
                    </p>
                    <a
                      href="https://surescore.edis.io/Account/testlogon"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        Take Diagnostic Test
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Booking Form */}
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
                          Booking Confirmed!
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Thank you for scheduling a consultation. We&apos;ll send you a
                          confirmation email with all the details shortly.
                        </p>
                        <p className="text-sm text-gray-500">
                          Check your email for next steps and a calendar invite.
                        </p>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                          Schedule Your Consultation
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Student Name *
                              </label>
                              <input
                                {...register("studentName")}
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                                placeholder="Student's full name"
                              />
                              {errors.studentName && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.studentName.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Parent/Guardian Name *
                              </label>
                              <input
                                {...register("parentName")}
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                                placeholder="Parent or guardian name"
                              />
                              {errors.parentName && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.parentName.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                              </label>
                              <input
                                {...register("email")}
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                                placeholder="your@email.com"
                              />
                              {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                              </label>
                              <input
                                {...register("phone")}
                                type="tel"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                                placeholder="(123) 456-7890"
                              />
                              {errors.phone && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.phone.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Program Interest *
                              </label>
                              <select
                                {...register("program")}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                              >
                                <option value="">Select a program</option>
                                <option value="sat-act">SAT & ACT Prep</option>
                                <option value="advanced">Advanced Prep</option>
                                <option value="tsia2">TSIA2 Prep</option>
                                <option value="psat">PSAT Prep</option>
                                <option value="unsure">Not sure yet</option>
                              </select>
                              {errors.program && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.program.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Grade Level *
                              </label>
                              <select
                                {...register("grade")}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                              >
                                <option value="">Select grade</option>
                                <option value="8">8th Grade</option>
                                <option value="9">9th Grade (Freshman)</option>
                                <option value="10">10th Grade (Sophomore)</option>
                                <option value="11">11th Grade (Junior)</option>
                                <option value="12">12th Grade (Senior)</option>
                              </select>
                              {errors.grade && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.grade.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Preferred Time *
                            </label>
                            <select
                              {...register("preferredTime")}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                            >
                              <option value="">Select preferred time</option>
                              <option value="morning">Morning (9AM - 12PM)</option>
                              <option value="afternoon">Afternoon (12PM - 4PM)</option>
                              <option value="evening">Evening (4PM - 7PM)</option>
                              <option value="weekend">Weekend</option>
                            </select>
                            {errors.preferredTime && (
                              <p className="mt-1 text-sm text-red-500">
                                {errors.preferredTime.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Additional Notes
                            </label>
                            <textarea
                              {...register("notes")}
                              rows={4}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all resize-none"
                              placeholder="Tell us about your goals, current scores, or any questions..."
                            />
                          </div>

                          <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              "Booking..."
                            ) : (
                              <>
                                Book Consultation
                                <Calendar className="ml-2 w-5 h-5" />
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
