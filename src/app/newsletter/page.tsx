import Link from "next/link";
import { prisma } from "@/lib/db";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";
import { CTA } from "@/components/sections";

export const dynamic = "force-dynamic";

export default async function NewsletterArchivePage() {
  const digests = await prisma.digest.findMany({
    where: {
      status: { in: ["SENT_COMPLETE", "SENT_BATCH_1", "APPROVED"] },
      htmlContent: { not: null },
    },
    orderBy: { weekOf: "desc" },
    select: {
      id: true,
      weekOf: true,
      subject: true,
      createdAt: true,
      _count: { select: { sends: true } },
    },
  });

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-600)]">
          <Container>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                SureScore{" "}
                <span className="text-[var(--secondary-300)]">Intel</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Weekly college admissions and TSIA trends that matter for Texas
                educators and families. Browse our past editions below.
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-white text-[var(--primary-600)] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </Link>
            </div>
          </Container>
        </section>

        {/* Archive List */}
        <section className="py-24 bg-white">
          <Container>
            <div className="max-w-4xl mx-auto">
              {digests.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                  No newsletters published yet. Check back soon!
                </p>
              ) : (
                <div className="space-y-4">
                  {digests.map((digest) => {
                    const date = new Date(digest.weekOf);
                    const formatted = date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                    return (
                      <Link
                        key={digest.id}
                        href={`/newsletter/${digest.id}`}
                        className="block group"
                      >
                        <div className="flex items-center gap-6 p-6 rounded-xl border border-gray-100 hover:border-[var(--primary-300)] hover:shadow-md transition-all">
                          <div className="flex-shrink-0 w-16 h-16 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-xl flex flex-col items-center justify-center">
                            <span className="text-xs font-bold uppercase">
                              {date.toLocaleDateString("en-US", {
                                month: "short",
                              })}
                            </span>
                            <span className="text-xl font-bold leading-none">
                              {date.getDate()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--primary-600)] transition-colors truncate">
                              {digest.subject || `SureScore Intel — ${formatted}`}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatted}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-gray-400 group-hover:text-[var(--primary-600)] transition-colors">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
