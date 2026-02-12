import { Header, Footer } from "@/components/layout";
import { Hero, Services, Stats, Testimonials, CTA } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Stats />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
