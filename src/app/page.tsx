import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";

import Hero from "@/components/hero";
import Services from "@/components/home/Services";
import Portfolio from "@/components/home/Portfolio";
import Process from "@/components/home/Process";
import Pricing from "@/components/home/Pricing";
import Outcomes from "@/components/home/Outcomes";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";

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
        <Outcomes />
        <Testimonials />
        <FAQ />
      </main>

      <Footer />
    </>
  );
}