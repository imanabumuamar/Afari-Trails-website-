import type { Product, ProductOption } from "@/types/store-content";

export function normalizeProductOption(option: ProductOption): ProductOption | null {
  const name = option.name?.trim() ?? "";
  const values = Array.isArray(option.values)
    ? [...new Set(option.values.map((v) => v.trim()).filter(Boolean))]
    : [];
  if (!name || values.length === 0) return null;
  return { name, values };
}

export function normalizeProductOptions(
  options: ProductOption[] | undefined,
): ProductOption[] {
  if (!Array.isArray(options)) return [];
  return options
    .map((option) => normalizeProductOption(option))
    .filter((option): option is ProductOption => !!option);
}

export function normalizeProduct(product: Product): Product {
  return {
    ...product,
    options: normalizeProductOptions(product.options),
  };
}

export function normalizeProducts(products: Product[]): Product[] {
  return products.map(normalizeProduct);
}
