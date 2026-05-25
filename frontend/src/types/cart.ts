export type CartLine = {
  slug: string;
  name: string;
  price: number;
  priceDisplay: string;
  image: string;
  quantity: number;
};

export type CartItemInput = {
  slug: string;
  name: string;
  price: number;
  priceDisplay: string;
  image: string;
};
