"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BanyeliPresence() {
  const pathname = usePathname();
  if (pathname === "/dashboard" || pathname === "/ask") return null;

  return <aside className="global-banyeli" aria-label="Banyeli is with you">
    <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
      <source src="/banyeli-chief-of-staff.mp4" type="video/mp4" />
    </video>
    <div className="global-banyeli-fade" />
    <Link href="/ask" className="global-banyeli-label"><b>Banyeli</b></Link>
  </aside>;
}
