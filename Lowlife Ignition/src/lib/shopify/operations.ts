export const PRODUCTS_QUERY = `#graphql
  query StorefrontProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        productType
        tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 8) {
          nodes {
            url
            altText
            width
            height
          }
        }
        selectedOrFirstAvailableVariant {
          id
        }
      }
    }
  }
`;

// ShopTickets is expected to sync ticket products into this collection.
// Change this one value if the app creates a different collection handle.
export const SHOPTICKETS_COLLECTION_HANDLE = "events";

export const SHOPTICKETS_EVENT_METAFIELDS = [
  { namespace: "shoptickets", key: "event_date" },
  { namespace: "shoptickets", key: "event_time" },
  { namespace: "shoptickets", key: "event_location" },
  { namespace: "shoptickets", key: "event_address" },
  { namespace: "shoptickets", key: "ticket_type" },
] as const;

export const EVENT_TICKETS_QUERY = `#graphql
  query StorefrontEventTickets(
    $handle: String!
    $first: Int!
    $metafieldIdentifiers: [HasMetafieldsIdentifier!]!
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      products(first: $first, sortKey: COLLECTION_DEFAULT) {
        nodes {
          id
          title
          handle
          description
          availableForSale
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 8) {
            nodes {
              url
              altText
              width
              height
            }
          }
          selectedOrFirstAvailableVariant {
            id
            availableForSale
          }
          metafields(identifiers: $metafieldIdentifiers) {
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

export const ARTICLES_QUERY = `#graphql
  query StorefrontArticles($first: Int!) {
    articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
      nodes {
        handle
        title
        excerpt
        contentHtml
        publishedAt
        authorV2 {
          name
        }
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`;

const METAOBJECT_FIELDS = `#graphql
  fragment StorefrontMetaobjectFields on Metaobject {
    id
    fields {
      key
      value
      reference {
        ... on MediaImage {
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const GALLERY_QUERY = `#graphql
  ${METAOBJECT_FIELDS}
  query StorefrontCommunityImages($first: Int!) {
    gallery: metaobjects(type: "gallery_item", first: $first) {
      nodes {
        ...StorefrontMetaobjectFields
      }
    }
    spotlights: metaobjects(type: "spotlight_build", first: $first) {
      nodes {
        ...StorefrontMetaobjectFields
      }
    }
  }
`;

export const CART_QUERY = `#graphql
  query StorefrontCart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
    }
  }
`;

const CART_FIELDS = `#graphql
  fragment StorefrontCartFields on Cart {
    id
    checkoutUrl
    totalQuantity
  }
`;

export const CART_CREATE_MUTATION = `#graphql
  ${CART_FIELDS}
  mutation StorefrontCartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...StorefrontCartFields
      }
      userErrors {
        field
        message
      }
      warnings {
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `#graphql
  ${CART_FIELDS}
  mutation StorefrontCartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...StorefrontCartFields
      }
      userErrors {
        field
        message
      }
      warnings {
        message
      }
    }
  }
`;
