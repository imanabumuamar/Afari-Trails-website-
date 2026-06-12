import type { ReactNode } from "react";

export default function AdminStoreLayout({ children }: { children: ReactNode }) {
  return <div className="space-y-8">{children}</div>;
}
