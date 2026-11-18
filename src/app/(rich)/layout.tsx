import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";

export default function RichLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell--rich">
      <SiteHeader />
      <main className="container--wide">{children}</main>
    </div>
  );
}
