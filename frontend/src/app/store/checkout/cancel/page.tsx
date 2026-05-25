import Link from "next/link";
import { ROUTES } from "@/config/routes";

export const metadata = {
  title: "Checkout cancelled",
  robots: { index: false },
};

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-beige pt-28">
      <div className="mx-auto max-w-lg px-6 py-24 text-center lg:px-10">
        <h1 className="font-serif text-4xl font-light text-charcoal">
          Checkout cancelled
        </h1>
        <p className="mt-6 text-sm text-charcoal/60">
          Your cart is unchanged. You can return to checkout when you&apos;re
          ready.
        </p>
        <Link
          href={ROUTES.storeCart}
          className="mt-10 inline-block bg-charcoal px-8 py-3 text-xs uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
}
