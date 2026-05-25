import { CartPageClient } from "@/components/store/CartPageClient";

export const metadata = {
  title: "Cart",
  description: "Review your Afari Trails store cart before checkout.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-beige pt-28">
      <CartPageClient />
    </div>
  );
}
