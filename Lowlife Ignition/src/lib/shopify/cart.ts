import { useCallback, useEffect, useState } from "react";
import type { ShopifyProduct } from "@/lib/shopify-types";
import { isShopifyConfigured, shopifyFetch } from "./client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_QUERY,
} from "./operations";

const CART_STORAGE_KEY = "lowlife-shopify-cart-id";

type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
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
};

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
  key: "cartCreate" | "cartLinesAdd",
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

export function useStorefrontCart() {
  const configured = isShopifyConfigured();
  const [shopifyCart, setShopifyCart] = useState<Cart | null>(null);
  const [mockCart, setMockCart] = useState<Record<string, number>>({});

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
    async (product: ShopifyProduct) => {
      if (!configured) {
        setMockCart((current) => ({
          ...current,
          [product.id]: (current[product.id] ?? 0) + 1,
        }));
        return null;
      }

      const cartId = shopifyCart?.id ?? storedCartId();
      try {
        const cart = cartId
          ? await addCartLine(cartId, product.variantId)
          : await createCart(product.variantId);
        persistCart(cart);
        setShopifyCart(cart);
        return cart.checkoutUrl;
      } catch (error) {
        if (!cartId) throw error;
        clearStoredCart();
        const cart = await createCart(product.variantId);
        persistCart(cart);
        setShopifyCart(cart);
        return cart.checkoutUrl;
      }
    },
    [configured, shopifyCart?.id],
  );

  const checkout = useCallback(() => {
    if (!configured || !shopifyCart?.checkoutUrl) return;
    window.location.assign(shopifyCart.checkoutUrl);
  }, [configured, shopifyCart?.checkoutUrl]);

  const mockCount = Object.values(mockCart).reduce(
    (total, quantity) => total + quantity,
    0,
  );

  return {
    addProduct,
    cartCount: configured ? (shopifyCart?.totalQuantity ?? 0) : mockCount,
    checkout,
    checkoutAvailable: configured && Boolean(shopifyCart?.checkoutUrl),
    isLive: configured,
  };
}
