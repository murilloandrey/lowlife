import type {
  ShopifyProduct,
  ShopifyProductOption,
  ShopifyProductVariant,
} from "@/lib/shopify-types";

const SYNTHETIC_OPTION_NAME = "Title";
const SYNTHETIC_OPTION_VALUE = "Default Title";

function isSyntheticOption(option: { name: string; values: string[] }) {
  return (
    option.name === SYNTHETIC_OPTION_NAME &&
    option.values.length === 1 &&
    option.values[0] === SYNTHETIC_OPTION_VALUE
  );
}

/** Filters out Shopify's auto-generated "Title: Default Title" option that
 * every variant-less product otherwise carries. */
export function selectableProductOptions(
  options: ShopifyProductOption[],
): ShopifyProductOption[] {
  return options.filter((option) => !isSyntheticOption(option));
}

export function needsVariantSelection(product: ShopifyProduct): boolean {
  return selectableProductOptions(product.options).length > 0;
}

export function defaultVariant(
  product: ShopifyProduct,
): ShopifyProductVariant | null {
  return (
    product.variants.find((variant) => variant.id === product.variantId) ??
    product.variants.find((variant) => variant.availableForSale) ??
    product.variants[0] ??
    null
  );
}

export function defaultSelections(
  product: ShopifyProduct,
): Record<string, string> {
  const variant = defaultVariant(product);
  const options = selectableProductOptions(product.options);
  const selections: Record<string, string> = {};
  if (!variant) return selections;
  for (const option of options) {
    const match = variant.selectedOptions.find(
      (selected) => selected.name === option.name,
    );
    if (match) selections[option.name] = match.value;
  }
  return selections;
}

export function resolveVariant(
  product: ShopifyProduct,
  selections: Record<string, string>,
): ShopifyProductVariant | null {
  const options = selectableProductOptions(product.options);
  if (options.length === 0) {
    return product.variants[0] ?? null;
  }
  if (options.some((option) => !selections[option.name])) {
    return null;
  }
  return (
    product.variants.find((variant) =>
      options.every(
        (option) =>
          variant.selectedOptions.find(
            (selected) => selected.name === option.name,
          )?.value === selections[option.name],
      ),
    ) ?? null
  );
}
