"use client";

import { useState } from "react";
import { Send, CheckCircle, BookOpen, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { sotdTrialSchema, type SotdTrialFormData } from "@/lib/schemas";

export default function SotdTrialPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SotdTrialFormData>({
    resolver: zodResolver(sotdTrialSchema),
  });

  const onSubmit = async (data: SotdTrialFormData) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/trial/sotd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong");
      }
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-600)]">
          <Container>
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                Free 3-Week Trial
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                TSIA{" "}
                <span className="text-[var(--secondary-300)]">Strategy of the Day</span>
              </h1>
              <p className="text-xl text-white/80">
                Give your students a daily edge on the TSIA2. Try our Strategy of the Day
                free for 3 weeks with up to 2 teachers — Math or ELAR.
              </p>
            </div>
          </Container>
        </section>

        {/* Form Section */}
        <section className="py-24 bg-white">
          <Container>
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Info Sidebar */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                  What You Get
                </h2>
                <div className="space-y-6">
                  <Card hover="lift">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Daily TSIA2 Practice</h3>
                        <p className="text-gray-600 text-sm">
                          Each day your students receive a targeted strategy lesson aligned to TSIA2 Math or ELAR standards.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card hover="lift">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">3 Weeks, No Commitment</h3>
                        <p className="text-gray-600 text-sm">
                          Try it free for 3 weeks in May with up to 2 teachers. No contracts, no credit card.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 p-6 bg-[var(--primary-50)] rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">How It Works</h3>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-3">
                      <span className="font-bold text-[var(--primary-500)]">1.</span>
                      Fill out the form below
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[var(--primary-500)]">2.</span>
                      We&apos;ll send you a roster template to fill in (Student ID, First Name, Last Name, Campus)
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[var(--primary-500)]">3.</span>
                      Send back the roster and we&apos;ll set up your teachers within 48 hours
                    </li>
                  </ol>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                <Card variant="elevated">
                  <CardContent className="p-8">
                    {isSubmitted ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          You&apos;re In!
                        </h3>
                        <p className="text-gray-600 mb-2">
                          Thank you for signing up for the TSIA Strategy of the Day trial.
                        </p>
                        <p className="text-gray-600">
                          We&apos;ll send you a roster template and setup instructions shortly. Your trial will be ready within 48 hours of receiving your roster.
                        </p>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                          Start Your Free Trial
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
                                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
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
                                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                              )}
                            </div>
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
                              <p className="mt-1 text-sm text-red-500">{errors.district.message}</p>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject *
                              </label>
                              <select
                                {...register("subject")}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                              >
                                <option value="">Select Math or ELAR</option>
                                <option value="math">Math</option>
                                <option value="elar">ELAR</option>
                              </select>
                              {errors.subject && (
                                <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Start Date in May *
                              </label>
                              <input
                                {...register("startDate")}
                                type="date"
                                min="2026-05-01"
                                max="2026-05-31"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                              />
                              {errors.startDate && (
                                <p className="mt-1 text-sm text-red-500">{errors.startDate.message}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Anything Else We Should Know?
                            </label>
                            <textarea
                              {...register("notes")}
                              rows={3}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all resize-none"
                              placeholder="Number of students, specific campus, etc."
                            />
                          </div>

                          {submitError && (
                            <p className="text-sm text-red-500 text-center">{submitError}</p>
                          )}

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
                                Start My Free Trial
                                <Send className="ml-2 w-5 h-5" />
                              </>
                            )}
                          </Button>
                        </form>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
