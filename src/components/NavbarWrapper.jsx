"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Quiz page manages its own focused navbar — suppress the global one
  if (pathname.startsWith("/quiz")) return null;

  // Admin pages have their own sidebar layout — no global navbar needed
  if (pathname.startsWith("/admin")) return null;

  return <Navbar />;
}
