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

export type ShopifyProduct = {
  id: string;
  variantId: string;
  title: string;
  handle: string;
  price: ShopifyMoney;
  images: ShopifyImage[];
  tags: string[];
  productType: string;
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
  embedUrl: string | null;
  thumbnail: ShopifyImage;
  caption: string;
};

export type EventTicket = {
  ticketId: string;
  eventName: string;
  ticketType: string;
  qrCodeUrl: string;
};
