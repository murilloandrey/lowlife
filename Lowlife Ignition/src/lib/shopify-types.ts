export type ShopifyImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type ShopifyMoney = {
  amount: string;
  currencyCode: "USD";
};

export type ShopifyProduct = {
  id: string;
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

export type EventMetaobject = {
  id: string;
  handle: string;
  name: string;
  startsAt: string;
  location: string;
  timeLabel: string;
  description: string;
  ticketPrice: ShopifyMoney;
  ticketType: string;
  checkoutUrl: string;
};

export type VideoPost = {
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
