import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { AdminSignOut } from "@/components/admin/AdminSignOut";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-beige text-charcoal">
      <header className="border-b border-charcoal/10 bg-ivory">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-charcoal/45">
              Afari Trails
            </p>
            <h1 className="font-serif text-2xl font-light">Content admin</h1>
          </div>
          <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.2em]">
            <Link href="/admin/homepage" className="hover:text-gold">
              Homepage
            </Link>
            <Link href="/" className="text-charcoal/55 hover:text-charcoal">
              View site →
            </Link>
            {session?.user && (
              <span className="text-charcoal/45">{session.user.email}</span>
            )}
            <AdminSignOut />
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
