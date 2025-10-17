import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { Pricing } from "@/components/landing/pricing";
import { Features } from "@/components/landing/features";
import { Team } from "@/components/landing/team";
import { About } from "@/components/landing/about";
import { Services } from "@/components/landing/services";

export default function Home() {
  return (
    <main className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <section id="home">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="team">
        <Team />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </main>
  );
}
