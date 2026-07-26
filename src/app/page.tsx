import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";

import Hero from "@/components/hero";
import Services from "@/components/home/Services";
import Portfolio from "@/components/home/Portfolio";
import Process from "@/components/home/Process";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Process />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </>
  );
}