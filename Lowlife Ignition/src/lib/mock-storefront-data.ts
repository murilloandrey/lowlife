import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";
import productAnime from "@/assets/product-anime.jpg";
import productBanner from "@/assets/product-banner.jpg";
import productJersey from "@/assets/product-jersey.jpg";
import productPlate from "@/assets/product-plate.jpg";
import productStickers from "@/assets/product-stickers.jpg";
import productTee from "@/assets/product-tee.jpg";

import type {
  EventMetaobject,
  GalleryMetaobject,
  ShopifyArticle,
  ShopifyProduct,
  VideoPost,
} from "@/lib/shopify-types";

export const PRODUCTS = [
  {
    id: "gid://shopify/Product/tee",
    title: "Lowlife Tee",
    handle: "lowlife-tee",
    productType: "Apparel",
    price: { amount: "30.00", currencyCode: "USD" },
    images: [{ url: productTee, altText: "Black Lowlife graphic tee" }],
    tags: ["Best Seller"],
  },
  {
    id: "gid://shopify/Product/jersey",
    title: "Lowlife Fam Jersey",
    handle: "lowlife-fam-jersey",
    productType: "Apparel",
    price: { amount: "45.00", currencyCode: "USD" },
    images: [{ url: productJersey, altText: "Lowlife Fam jersey" }],
    tags: ["Limited Drop"],
  },
  {
    id: "gid://shopify/Product/banner",
    title: "Windshield Banner",
    handle: "windshield-banner",
    productType: "Auto",
    price: { amount: "25.00", currencyCode: "USD" },
    images: [{ url: productBanner, altText: "Lowlife windshield banner" }],
    tags: ["New"],
  },
  {
    id: "gid://shopify/Product/plate",
    title: "Chain Plate",
    handle: "chain-plate",
    productType: "Accessory",
    price: { amount: "20.00", currencyCode: "USD" },
    images: [
      { url: productPlate, altText: "Lowlife chain license plate frame" },
    ],
    tags: [],
  },
  {
    id: "gid://shopify/Product/anime",
    title: "Anime Tee",
    handle: "anime-tee",
    productType: "Apparel",
    price: { amount: "30.00", currencyCode: "USD" },
    images: [{ url: productAnime, altText: "Lowlife anime graphic tee" }],
    tags: ["Limited Drop"],
  },
  {
    id: "gid://shopify/Product/stickers",
    title: "Sticker Pack",
    handle: "sticker-pack",
    productType: "Accessory",
    price: { amount: "15.00", currencyCode: "USD" },
    images: [{ url: productStickers, altText: "Lowlife sticker pack" }],
    tags: ["Best Seller"],
  },
] satisfies ShopifyProduct[];

export const EVENTS = [
  {
    id: "gid://shopify/Metaobject/event-1",
    handle: "lowlife-night-meet",
    name: "Lowlife Night Meet",
    startsAt: "2026-04-12T21:00:00-05:00",
    location: "Houston, TX",
    timeLabel: "9:00 PM — 1:00 AM",
    ticketPrice: { amount: "15.00", currencyCode: "USD" },
    ticketType: "General Admission",
    checkoutUrl: "https://example.com/tickets/lowlife-night-meet",
    description:
      "The signature Lowlife takeover. Custom builds, vendor booths, and the loudest speakers in H-Town.",
  },
  {
    id: "gid://shopify/Metaobject/event-2",
    handle: "texas-car-culture-showcase",
    name: "Texas Car Culture Showcase",
    startsAt: "2026-05-03T17:00:00-05:00",
    location: "Dallas, TX",
    timeLabel: "5:00 PM — 11:00 PM",
    ticketPrice: { amount: "25.00", currencyCode: "USD" },
    ticketType: "Show Pass",
    checkoutUrl: "https://example.com/tickets/texas-showcase",
    description:
      "Statewide showcase — lowriders, JDM, euro, and everything between under one roof.",
  },
  {
    id: "gid://shopify/Metaobject/event-3",
    handle: "low-clean-sunday",
    name: "Low & Clean Sunday",
    startsAt: "2026-05-18T14:00:00-05:00",
    location: "San Antonio, TX",
    timeLabel: "2:00 PM — 8:00 PM",
    ticketPrice: { amount: "10.00", currencyCode: "USD" },
    ticketType: "Cruise-In Pass",
    checkoutUrl: "https://example.com/tickets/low-clean-sunday",
    description:
      "Chill Sunday cruise-in. Slammed, stanced, and static builds welcome.",
  },
] satisfies EventMetaobject[];

export const GALLERY = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
].map((url, index) => ({
  id: `gid://shopify/Metaobject/gallery-${index + 1}`,
  image: { url, altText: `Lowlife meet photo ${index + 1}` },
  caption: `From the Lowlife community — Houston meet ${index + 1}`,
})) satisfies GalleryMetaobject[];

export const ARTICLES = [
  {
    handle: "midnight-candy-64-impala",
    title: "Midnight Candy: Marcus Reyes' '64 Impala",
    excerpt:
      "A three-year garage build, a hand-mixed magenta fade, and the Houston nights that shaped every detail.",
    contentHtml:
      "<p>Marcus Reyes built his Impala one late night at a time, chasing a silhouette that looked just as sharp under parking-lot lights as it did rolling down the boulevard.</p>",
    image: {
      url: gallery7,
      altText: "Featured custom lowrider at a Lowlife meet",
    },
    publishedAt: "2026-03-28T12:00:00Z",
    author: { name: "Lowlife Editorial" },
  },
  {
    handle: "five-builds-night-meet",
    title: "Five Builds That Owned the Night Meet",
    excerpt:
      "From immaculate paint to impossible fitment, these were the cars nobody stopped talking about.",
    contentHtml: "<p>A field report from our latest Houston night meet.</p>",
    image: {
      url: gallery3,
      altText: "Cars lined up at the Lowlife night meet",
    },
    publishedAt: "2026-03-18T12:00:00Z",
    author: { name: "Lowlife Editorial" },
  },
  {
    handle: "garage-profile-lexi-civic",
    title: "Garage Profile: Lexi's Static Civic",
    excerpt:
      "Clean lines, daily miles, and a no-shortcuts approach to getting low.",
    contentHtml:
      "<p>Lexi walks us through a daily-driven build made to be used.</p>",
    image: { url: gallery5, altText: "Static Honda Civic at a car meet" },
    publishedAt: "2026-03-09T12:00:00Z",
    author: { name: "Lowlife Editorial" },
  },
  {
    handle: "houston-after-dark",
    title: "Houston After Dark",
    excerpt: "A photo diary from the streets that raised the brand.",
    contentHtml: "<p>Houston after sundown, seen through the Lowlife lens.</p>",
    image: { url: gallery8, altText: "Houston car culture after dark" },
    publishedAt: "2026-02-24T12:00:00Z",
    author: { name: "Lowlife Editorial" },
  },
] satisfies ShopifyArticle[];

export const VIDEO_POSTS = [
  {
    id: "video-1",
    platform: "instagram",
    embedUrl: null,
    thumbnail: { url: gallery1, altText: "Cars rolling into a Lowlife meet" },
    caption: "Roll-in hour hits different in Houston.",
  },
  {
    id: "video-2",
    platform: "tiktok",
    embedUrl: null,
    thumbnail: { url: gallery2, altText: "Low car detail at night" },
    caption: "Fitment check. No shortcuts.",
  },
  {
    id: "video-3",
    platform: "instagram",
    embedUrl: null,
    thumbnail: { url: gallery4, altText: "Crowd around featured cars" },
    caption: "The people make the meet.",
  },
  {
    id: "video-4",
    platform: "tiktok",
    embedUrl: null,
    thumbnail: {
      url: gallery6,
      altText: "Custom car under parking lot lights",
    },
    caption: "Built for the parking-lot lights.",
  },
  {
    id: "video-5",
    platform: "instagram",
    embedUrl: null,
    thumbnail: { url: gallery8, altText: "Night meet recap" },
    caption: "One night. A hundred stories.",
  },
] satisfies VideoPost[];

export const RAFFLES = [
  {
    id: "r1",
    title: "Merch Bundle Raffle",
    prize: "$250 Lowlife Bundle",
    ends: "Ends Apr 30",
    tag: "Active",
  },
  {
    id: "r2",
    title: "Event Ticket Giveaway",
    prize: "2× Night Meet Passes",
    ends: "Ends Apr 10",
    tag: "Ending Soon",
  },
  {
    id: "r3",
    title: "Limited Banner Drop",
    prize: "Numbered 1/50 Banner",
    ends: "Ends May 05",
    tag: "Active",
  },
] as const;
