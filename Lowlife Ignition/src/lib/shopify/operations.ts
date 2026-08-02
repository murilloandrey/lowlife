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
    handle
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

export const EVENTS_QUERY = `#graphql
  ${METAOBJECT_FIELDS}
  query StorefrontEvents($first: Int!) {
    events: metaobjects(type: "event", first: $first) {
      nodes {
        ...StorefrontMetaobjectFields
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
    videoPosts: metaobjects(type: "video_post", first: $first) {
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
