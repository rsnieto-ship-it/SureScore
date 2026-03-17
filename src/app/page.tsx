import { Header, Footer } from "@/components/layout";
import { Hero, Services, TIACallout, Stats, Testimonials, CTA } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <TIACallout />
        <Stats />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
