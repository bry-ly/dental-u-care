"use client";
import { Navbar } from "./navbar";
import { useEffect, useState } from "react";

export function NavbarWrapper() {
  const [user, setUser] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const session = await res.json();
          setUser(session.user);
          setIsUserAdmin(session.user?.role === "admin");
        } else {
          setUser(null);
          setIsUserAdmin(false);
        }
      } catch {
        setUser(null);
        setIsUserAdmin(false);
      }
    }
    fetchUser();
  }, []);

  return <Navbar user={user} isAdmin={isUserAdmin} />;
}
