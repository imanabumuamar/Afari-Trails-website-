import Link from "next/link";

export default function AdminForbiddenPage() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-[10px] uppercase tracking-[0.35em] text-charcoal/45">403</p>
      <h2 className="mt-4 font-serif text-3xl font-light">Access denied</h2>
      <p className="mt-4 text-sm text-charcoal/65">
        Your account is signed in, but it does not have permission to view this page.
        Ask a super admin to adjust your role.
      </p>
      <p className="mt-4 text-xs text-charcoal/45">
        If you were just made super admin, sign out and sign in again, then try{" "}
        <Link href="/admin/users" className="text-gold hover:underline">
          /admin/users
        </Link>
        .
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.2em]">
        <Link href="/admin" className="text-gold hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/homepage" className="text-gold hover:underline">
          Homepage
        </Link>
        <Link href="/" className="text-charcoal/55 hover:text-charcoal">
          View site
        </Link>
      </div>
    </div>
  );
}
