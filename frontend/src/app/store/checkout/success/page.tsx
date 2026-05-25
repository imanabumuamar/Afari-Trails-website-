import Link from "next/link";
import { ClearCartOnSuccess } from "@/components/store/ClearCartOnSuccess";
import { ROUTES } from "@/config/routes";

export const metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;

  return (
    <div className="min-h-screen bg-beige pt-28">
      <ClearCartOnSuccess />
      <div className="mx-auto max-w-lg px-6 py-24 text-center lg:px-10">
        <p className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
          Thank you
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          Your order is confirmed
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-charcoal/65">
          We&apos;ve received your payment
          {sessionId ? " and will send a confirmation email shortly" : ""}. Your
          expedition essentials are on their way.
        </p>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={ROUTES.store}
            className="bg-charcoal px-8 py-3 text-xs uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
          >
            Continue shopping
          </Link>
          <Link
            href={ROUTES.contact}
            className="text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:text-charcoal"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
