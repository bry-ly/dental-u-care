import { PediatricDentistry } from "@/components/services/PediatricDentistry";
import { NavbarWrapper } from "@/components/landing/navbar-wrapper";

export default function PediatricDentistryPage() {
  return (
    <main className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <NavbarWrapper />
      <PediatricDentistry />
    </main>
  );
}
