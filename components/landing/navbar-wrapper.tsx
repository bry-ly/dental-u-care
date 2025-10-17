import { getCurrentUser, isAdmin } from "@/lib/auth-server";
import { Navbar } from "./navbar";

export async function NavbarWrapper() {
  const user = await getCurrentUser();
  const isUserAdmin = user ? await isAdmin() : false;

  return <Navbar user={user} isAdmin={isUserAdmin} />;
}
