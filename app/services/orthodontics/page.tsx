import { Orthodontics } from "@/components/services/Orthodontics";
import { NavbarWrapper } from "@/components/landing/navbar-wrapper";

export default function OrthodonticsPage() {
  return (
    <main className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <NavbarWrapper />
      <Orthodontics />
    </main>
  );
}
