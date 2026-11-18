import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";

export default function PlainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell--plain">
      <SiteHeader />
      <main className="container">{children}</main>
    </div>
  );
}
