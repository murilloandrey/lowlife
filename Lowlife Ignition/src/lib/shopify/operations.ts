export const PRODUCTS_QUERY = `#graphql
  query StorefrontProducts($first: Int!, $after: String) {
    products(
      first: $first
      after: $after
      sortKey: CREATED_AT
      reverse: true
    ) {
      nodes {
        id
        title
        handle
        description
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
        options {
          name
          values
        }
        variants(first: 20) {
          nodes {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
              width
              height
            }
          }
        }
        selectedOrFirstAvailableVariant {
          id
        }
      }
      pageInfo {
        hasNextPage
        endCursor
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

// Max images pulled from a "List of files" field (e.g. spotlight_build.build_photos).
const METAOBJECT_REFERENCE_LIST_SIZE = 20;

// `reference` resolves single-reference fields; `references` resolves list
// fields. Both are always valid on MetaobjectField and simply return null when
// a field isn't of that shape, so this fragment stays safe on metaobject
// definitions that don't have the newer file/list fields yet.
const METAOBJECT_FIELDS = `#graphql
  fragment StorefrontMetaobjectFields on Metaobject {
    id
    updatedAt
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
        ... on Video {
          previewImage {
            url
            altText
            width
            height
          }
          sources {
            url
            mimeType
          }
        }
        ... on GenericFile {
          url
          mimeType
        }
      }
      references(first: ${METAOBJECT_REFERENCE_LIST_SIZE}) {
        nodes {
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

export const VIDEO_POSTS_QUERY = `#graphql
  ${METAOBJECT_FIELDS}
  query StorefrontVideoPosts($first: Int!) {
    videoPosts: metaobjects(
      type: "video_post"
      first: $first
      sortKey: "updated_at"
    ) {
      nodes {
        ...StorefrontMetaobjectFields
      }
    }
  }
`;

export const HERO_SLIDES_QUERY = `#graphql
  ${METAOBJECT_FIELDS}
  query StorefrontHeroSlides($first: Int!) {
    heroSlides: metaobjects(type: "hero_slide", first: $first) {
      nodes {
        ...StorefrontMetaobjectFields
      }
    }
  }
`;

const CART_FIELDS = `#graphql
  fragment StorefrontCartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              title
              handle
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = `#graphql
  ${CART_FIELDS}
  query StorefrontCart($id: ID!) {
    cart(id: $id) {
      ...StorefrontCartFields
    }
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

export const CART_LINES_UPDATE_MUTATION = `#graphql
  ${CART_FIELDS}
  mutation StorefrontCartLinesUpdate(
    $cartId: ID!
    $lines: [CartLineUpdateInput!]!
  ) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...StorefrontCartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `#graphql
  ${CART_FIELDS}
  mutation StorefrontCartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...StorefrontCartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;
