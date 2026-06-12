export type CartLine = {
  slug: string;
  name: string;
  price: number;
  priceDisplay: string;
  image: string;
  quantity: number;
  selectedOptions?: Record<string, string>;
};

export type CartItemInput = {
  slug: string;
  name: string;
  price: number;
  priceDisplay: string;
  image: string;
  selectedOptions?: Record<string, string>;
};

export function cartLineKey(line: {
  slug: string;
  selectedOptions?: Record<string, string>;
}): string {
  const opts = line.selectedOptions;
  if (!opts || Object.keys(opts).length === 0) return line.slug;
  return `${line.slug}:${JSON.stringify(opts)}`;
}
