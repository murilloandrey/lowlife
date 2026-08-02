import { useCallback, useEffect, useState } from "react";
import type {
  ShopifyImage,
  ShopifyMoney,
  ShopifyProduct,
} from "@/lib/shopify-types";
import { isShopifyConfigured, shopifyFetch } from "./client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
} from "./operations";

const CART_STORAGE_KEY = "lowlife-shopify-cart-id";

type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: ShopifyMoney };
  merchandise: {
    id: string;
    title: string;
    price: ShopifyMoney;
    product: {
      title: string;
      handle: string;
      featuredImage: ShopifyImage | null;
    };
  };
};

type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: ShopifyMoney };
  lines: { nodes: CartLine[] };
};

type CartUserError = {
  message: string;
};

type CartQueryResponse = {
  cart: Cart | null;
};

type CartMutationResponse = {
  cartCreate?: {
    cart: Cart | null;
    userErrors: CartUserError[];
  };
  cartLinesAdd?: {
    cart: Cart | null;
    userErrors: CartUserError[];
  };
  cartLinesUpdate?: {
    cart: Cart | null;
    userErrors: CartUserError[];
  };
  cartLinesRemove?: {
    cart: Cart | null;
    userErrors: CartUserError[];
  };
};

export type DisplayCartLine = {
  id: string;
  variantId: string;
  title: string;
  image: ShopifyImage | null;
  unitPrice: ShopifyMoney;
  quantity: number;
  lineTotal: ShopifyMoney;
};

export function formatMoney(money: ShopifyMoney) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(money.amount));
}

function storedCartId() {
  return typeof window === "undefined"
    ? null
    : window.localStorage.getItem(CART_STORAGE_KEY);
}

function persistCart(cart: Cart) {
  window.localStorage.setItem(CART_STORAGE_KEY, cart.id);
}

function clearStoredCart() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  }
}

function mutationCart(
  payload: CartMutationResponse,
  key: "cartCreate" | "cartLinesAdd" | "cartLinesUpdate" | "cartLinesRemove",
) {
  const result = payload[key];
  if (!result?.cart || result.userErrors.length > 0) {
    throw new Error(
      result?.userErrors.map((error) => error.message).join("; ") ||
        "Shopify did not return a cart.",
    );
  }
  return result.cart;
}

async function createCart(variantId: string) {
  const payload = await shopifyFetch<CartMutationResponse>(
    CART_CREATE_MUTATION,
    {
      input: {
        lines: [{ merchandiseId: variantId, quantity: 1 }],
      },
    },
  );
  return mutationCart(payload, "cartCreate");
}

async function addCartLine(cartId: string, variantId: string) {
  const payload = await shopifyFetch<CartMutationResponse>(
    CART_LINES_ADD_MUTATION,
    {
      cartId,
      lines: [{ merchandiseId: variantId, quantity: 1 }],
    },
  );
  return mutationCart(payload, "cartLinesAdd");
}

async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
) {
  const payload = await shopifyFetch<CartMutationResponse>(
    CART_LINES_UPDATE_MUTATION,
    {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  );
  return mutationCart(payload, "cartLinesUpdate");
}

async function removeCartLine(cartId: string, lineId: string) {
  const payload = await shopifyFetch<CartMutationResponse>(
    CART_LINES_REMOVE_MUTATION,
    {
      cartId,
      lineIds: [lineId],
    },
  );
  return mutationCart(payload, "cartLinesRemove");
}

function cartLineToDisplayLine(line: CartLine): DisplayCartLine {
  return {
    id: line.id,
    variantId: line.merchandise.id,
    title: line.merchandise.product.title,
    image: line.merchandise.product.featuredImage,
    unitPrice: line.merchandise.price,
    quantity: line.quantity,
    lineTotal: line.cost.totalAmount,
  };
}

type MockCart = Record<
  string,
  { product: ShopifyProduct; variantId: string; quantity: number }
>;

function mockCartLineTitle(product: ShopifyProduct, variantId: string) {
  const variant = product.variants.find((v) => v.id === variantId);
  const variantLabel = variant?.selectedOptions
    .map((option) => option.value)
    .join(" / ");
  return variantLabel ? `${product.title} — ${variantLabel}` : product.title;
}

function mockCartToDisplayLines(mockCart: MockCart): DisplayCartLine[] {
  return Object.entries(mockCart).map(([lineId, entry]) => {
    const variant = entry.product.variants.find(
      (v) => v.id === entry.variantId,
    );
    const unitPrice = variant?.price ?? entry.product.price;
    return {
      id: lineId,
      variantId: entry.variantId,
      title: mockCartLineTitle(entry.product, entry.variantId),
      image: entry.product.images[0] ?? null,
      unitPrice,
      quantity: entry.quantity,
      lineTotal: {
        amount: String(Number(unitPrice.amount) * entry.quantity),
        currencyCode: unitPrice.currencyCode,
      },
    };
  });
}

function mockSubtotal(lines: DisplayCartLine[]): ShopifyMoney {
  const currencyCode = lines[0]?.unitPrice.currencyCode ?? "USD";
  const amount = lines.reduce(
    (total, line) => total + Number(line.lineTotal.amount),
    0,
  );
  return { amount: String(amount), currencyCode };
}

export function useStorefrontCart() {
  const configured = isShopifyConfigured();
  const [shopifyCart, setShopifyCart] = useState<Cart | null>(null);
  const [mockCart, setMockCart] = useState<MockCart>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (!configured) return;
    const cartId = storedCartId();
    if (!cartId) return;

    void shopifyFetch<CartQueryResponse>(CART_QUERY, { id: cartId })
      .then((data) => {
        if (data.cart) {
          setShopifyCart(data.cart);
        } else {
          clearStoredCart();
        }
      })
      .catch((error) => {
        console.warn("Stored Shopify cart could not be restored.", error);
        clearStoredCart();
      });
  }, [configured]);

  const addProduct = useCallback(
    async (product: ShopifyProduct, variantId?: string) => {
      const resolvedVariantId = variantId ?? product.variantId;

      if (!configured) {
        const lineId = `${product.id}::${resolvedVariantId}`;
        setMockCart((current) => ({
          ...current,
          [lineId]: {
            product,
            variantId: resolvedVariantId,
            quantity: (current[lineId]?.quantity ?? 0) + 1,
          },
        }));
        setIsCartOpen(true);
        return null;
      }

      const cartId = shopifyCart?.id ?? storedCartId();
      try {
        const cart = cartId
          ? await addCartLine(cartId, resolvedVariantId)
          : await createCart(resolvedVariantId);
        persistCart(cart);
        setShopifyCart(cart);
        setIsCartOpen(true);
        return cart.checkoutUrl;
      } catch (error) {
        if (!cartId) throw error;
        clearStoredCart();
        const cart = await createCart(resolvedVariantId);
        persistCart(cart);
        setShopifyCart(cart);
        setIsCartOpen(true);
        return cart.checkoutUrl;
      }
    },
    [configured, shopifyCart?.id],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!configured) {
        setMockCart((current) => {
          if (quantity <= 0) {
            const { [lineId]: _removed, ...rest } = current;
            return rest;
          }
          const existing = current[lineId];
          if (!existing) return current;
          return { ...current, [lineId]: { ...existing, quantity } };
        });
        return;
      }

      if (!shopifyCart) return;
      const cart =
        quantity <= 0
          ? await removeCartLine(shopifyCart.id, lineId)
          : await updateCartLine(shopifyCart.id, lineId, quantity);
      persistCart(cart);
      setShopifyCart(cart);
    },
    [configured, shopifyCart],
  );

  const removeLine = useCallback(
    (lineId: string) => updateQuantity(lineId, 0),
    [updateQuantity],
  );

  const checkout = useCallback(() => {
    if (!configured || !shopifyCart?.checkoutUrl) return;
    window.location.assign(shopifyCart.checkoutUrl);
  }, [configured, shopifyCart?.checkoutUrl]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const lines = configured
    ? (shopifyCart?.lines.nodes.map(cartLineToDisplayLine) ?? [])
    : mockCartToDisplayLines(mockCart);

  const mockCount = Object.values(mockCart).reduce(
    (total, entry) => total + entry.quantity,
    0,
  );

  const subtotal = configured
    ? (shopifyCart?.cost.subtotalAmount ?? null)
    : lines.length > 0
      ? mockSubtotal(lines)
      : null;

  return {
    addProduct,
    updateQuantity,
    removeLine,
    lines,
    subtotal,
    cartCount: configured ? (shopifyCart?.totalQuantity ?? 0) : mockCount,
    checkout,
    checkoutAvailable: configured && Boolean(shopifyCart?.checkoutUrl),
    isLive: configured,
    isCartOpen,
    openCart,
    closeCart,
  };
}
