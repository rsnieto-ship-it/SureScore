import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";

export const metadata = {
  title: "Unsubscribed — SureScore",
};

export default function UnsubscribeConfirmedPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-24 bg-white">
          <Container size="sm">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                You&apos;ve been unsubscribed
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                You will no longer receive SureScore Intel digest emails.
              </p>
              <Link
                href="/"
                className="inline-block rounded-lg bg-[var(--primary-600)] px-6 py-3 text-white font-semibold hover:bg-[var(--primary-700)] transition-colors"
              >
                Back to homepage
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
