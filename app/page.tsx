import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { NavbarWrapper } from "@/components/landing/navbar-wrapper";
import { Pricing } from "@/components/landing/pricing";
import { Features } from "@/components/landing/features";
import { Team } from "@/components/landing/team";
import { About } from "@/components/landing/about";
import { Services } from "@/components/landing/services";

export default function Home() {
  return (
      <main className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <NavbarWrapper />
        <section id="home" className="p-6 my-6">
          <Hero />
        </section>

        <section id="about">
          <About />
        </section>

        <section
          id="team"
          className="rounded-2xl shadow-[0_20px_60px_-15px_rgba(251,191,36,0.5)] dark:shadow-[0_20px_60px_-15px_rgba(251,191,36,0.3)] p-8 my-8"
        >
          <Team />
        </section>

        <section
          id="features"
          className="rounded-2xl shadow-[0_20px_60px_-15px_rgba(249,115,22,0.5)] dark:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.3)] p-8 my-8"
        >
          <Features />
        </section>

        <section
          id="services"
          className="rounded-2xl shadow-[0_20px_60px_-15px_rgba(59,130,246,0.5)] dark:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)] p-8 my-8"
        >
          <Services />
        </section>

        <section
          id="pricing"
          className="rounded-2xl shadow-[0_20px_60px_-15px_rgba(168,85,247,0.5)] dark:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.3)] p-8 my-8"
        >
          <Pricing />
        </section>

        <section
          id="contact"
          className="rounded-2xl p-8 my-8 shadow-[0_18px_30px_rgba(236,72,153,0.18)] dark:shadow-[0_18px_30px_rgba(236,72,153,0.12)]"
        >
          <Contact />
        </section>
        <Footer />
      </main>

  );
}
