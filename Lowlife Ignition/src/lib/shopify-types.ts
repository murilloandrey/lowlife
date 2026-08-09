export type ShopifyImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyProductVariant = {
  id: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  selectedOptions: ShopifySelectedOption[];
  image?: ShopifyImage | null;
};

export type ShopifyProductOption = {
  name: string;
  values: string[];
};

export type ShopifyProduct = {
  id: string;
  /** Default/fallback variant for callers that don't resolve a specific
   * selection (e.g. single-variant products). Real add-to-cart flows should
   * resolve and use a variant from `variants` instead. */
  variantId: string;
  title: string;
  handle: string;
  description?: string;
  price: ShopifyMoney;
  images: ShopifyImage[];
  tags: string[];
  productType: string;
  variants: ShopifyProductVariant[];
  /** Selectable option definitions (e.g. Size, Color). Excludes Shopify's
   * synthetic "Title"/"Default Title" option for products with no real
   * variants. */
  options: ShopifyProductOption[];
};

export type ShopifyArticle = {
  handle: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  image: ShopifyImage;
  publishedAt: string;
  author: {
    name: string;
  };
};

export type GalleryMetaobject = {
  id: string;
  image: ShopifyImage;
  caption: string;
};

export type SpotlightBuild = {
  id: string;
  images: Array<{
    url: string;
    altText: string;
  }>;
  ownerName: string;
  buildNickname?: string;
  caption: string;
  fullStory: string;
  instagramHandle?: string;
  video?: ShopifyVideoPostMetaobject;
  favoriteSong?: {
    title: string;
    artist: string;
    embedUrl?: string;
  };
};

export type ShopifyTicketProduct = ShopifyProduct & {
  description: string;
  availableForSale: boolean;
  collectionHandle: string;
  startsAt: string;
  location: string;
  address: string;
  timeLabel: string;
  ticketType: string;
};

export type ShopifyVideoPostMetaobject = {
  id: string;
  platform: "tiktok" | "instagram";
  /** Instagram/TikTok post link, normalized for iframes by `embeddableUrl`. */
  embedUrl: string | null;
  /** Playable URL from an uploaded video file. Takes priority over `embedUrl`.
   * Null (and optional) while the `video_file` metaobject field is absent. */
  videoFileUrl?: string | null;
  thumbnail: ShopifyImage;
  caption: string;
};

export type EventTicket = {
  ticketId: string;
  eventName: string;
  ticketType: string;
  qrCodeUrl: string;
};
