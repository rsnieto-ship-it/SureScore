import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const digest = await prisma.digest.findUnique({
    where: { id },
    select: {
      id: true,
      weekOf: true,
      subject: true,
      htmlContent: true,
      status: true,
    },
  });

  if (!digest || !digest.htmlContent) {
    notFound();
  }

  const date = new Date(digest.weekOf);
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-12 bg-gray-50 border-b">
          <Container>
            <div className="max-w-4xl mx-auto">
              <Link
                href="/newsletter"
                className="inline-flex items-center text-sm text-gray-500 hover:text-[var(--primary-600)] mb-4 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                All Newsletters
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900">
                {digest.subject || `SureScore Intel — ${formatted}`}
              </h1>
              <p className="text-gray-500 mt-2">{formatted}</p>
            </div>
          </Container>
        </section>

        <section className="py-12 bg-[#f4f4f0]">
          <Container>
            <div className="max-w-[640px] mx-auto">
              <div
                dangerouslySetInnerHTML={{ __html: digest.htmlContent }}
                className="newsletter-embed"
              />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
