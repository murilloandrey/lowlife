import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";
import gallery9 from "@/assets/gallery-9.jpg";
import gallery10 from "@/assets/gallery-10.jpg";
import gallery11 from "@/assets/gallery-11.jpg";
import gallery12 from "@/assets/gallery-12.jpg";
import gallery13 from "@/assets/gallery-13.jpg";
import productAnime from "@/assets/product-anime.jpg";
import productBanner from "@/assets/product-banner.jpg";
import productJersey from "@/assets/product-jersey.jpg";
import productPlate from "@/assets/product-plate.jpg";
import productStickers from "@/assets/product-stickers.jpg";
import productTee from "@/assets/product-tee.jpg";

import type {
  GalleryMetaobject,
  ShopifyArticle,
  ShopifyEventMetaobject,
  ShopifyProduct,
  ShopifyVideoPostMetaobject,
  SpotlightBuild,
} from "@/lib/shopify-types";

export const PRODUCTS = [
  {
    id: "gid://shopify/Product/tee",
    variantId: "gid://shopify/ProductVariant/tee",
    title: "Lowlife Tee",
    handle: "lowlife-tee",
    productType: "Apparel",
    price: { amount: "30.00", currencyCode: "USD" },
    images: [{ url: productTee, altText: "Black Lowlife graphic tee" }],
    tags: ["Best Seller"],
  },
  {
    id: "gid://shopify/Product/jersey",
    variantId: "gid://shopify/ProductVariant/jersey",
    title: "Lowlife Fam Jersey",
    handle: "lowlife-fam-jersey",
    productType: "Apparel",
    price: { amount: "45.00", currencyCode: "USD" },
    images: [{ url: productJersey, altText: "Lowlife Fam jersey" }],
    tags: ["Limited Drop"],
  },
  {
    id: "gid://shopify/Product/banner",
    variantId: "gid://shopify/ProductVariant/banner",
    title: "Windshield Banner",
    handle: "windshield-banner",
    productType: "Auto",
    price: { amount: "25.00", currencyCode: "USD" },
    images: [{ url: productBanner, altText: "Lowlife windshield banner" }],
    tags: ["New"],
  },
  {
    id: "gid://shopify/Product/plate",
    variantId: "gid://shopify/ProductVariant/plate",
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
    variantId: "gid://shopify/ProductVariant/anime",
    title: "Anime Tee",
    handle: "anime-tee",
    productType: "Apparel",
    price: { amount: "30.00", currencyCode: "USD" },
    images: [{ url: productAnime, altText: "Lowlife anime graphic tee" }],
    tags: ["Limited Drop"],
  },
  {
    id: "gid://shopify/Product/stickers",
    variantId: "gid://shopify/ProductVariant/stickers",
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
] satisfies ShopifyEventMetaobject[];

export const GALLERY = [
  {
    id: "gid://shopify/Metaobject/gallery-1",
    image: {
      url: gallery1,
      altText: "Two lowered coupes parked beside a weathered brick building",
    },
    caption: "Low and clean against the old brick.",
  },
  {
    id: "gid://shopify/Metaobject/gallery-2",
    image: {
      url: gallery2,
      altText: "Lowered blue widebody Camaro parked on a city street",
    },
    caption: "Widebody Camaro sitting curbside.",
  },
  {
    id: "gid://shopify/Metaobject/gallery-3",
    image: {
      url: gallery3,
      altText: "Green Audi and orange Infiniti displayed at a daytime meet",
    },
    caption: "Color and fitment at the daytime showcase.",
  },
  {
    id: "gid://shopify/Metaobject/gallery-4",
    image: {
      url: gallery4,
      altText: "Blue widebody Honda Civic displayed among vendor booths",
    },
    caption: "Show build in the middle of vendor row.",
  },
  {
    id: "gid://shopify/Metaobject/gallery-5",
    image: {
      url: gallery5,
      altText: "Turquoise lowered Lexus GS parked downtown",
    },
    caption: "A downtown stance with deep-dish wheels.",
  },
  {
    id: "gid://shopify/Metaobject/gallery-6",
    image: {
      url: gallery6,
      altText: "Red widebody Lamborghini at an outdoor car show",
    },
    caption: "Track-bred lines at the outdoor show.",
  },
  {
    id: "gid://shopify/Metaobject/gallery-7",
    image: {
      url: gallery7,
      altText: "White modified Nissan photographed from above",
    },
    caption: "A clean build from a different angle.",
  },
  {
    id: "gid://shopify/Metaobject/gallery-8",
    image: {
      url: gallery8,
      altText: "Red lowered BMW coupe inside a working garage",
    },
    caption: "Garage-built and ready for the street.",
  },
  {
    id: "gid://shopify/Metaobject/gallery-11",
    image: {
      url: gallery11,
      altText: "White Nissan Skyline at a raceway gathering",
    },
    caption: "Golden hour at the raceway.",
  },
  {
    id: "gid://shopify/Metaobject/gallery-12",
    image: {
      url: gallery12,
      altText: "Silver lowered Nissan 350Z at an evening meet",
    },
    caption: "The evening lineup starts low.",
  },
] satisfies GalleryMetaobject[];

export const SPOTLIGHT_BUILDS = [
  {
    id: "gid://shopify/Metaobject/spotlight-build-1",
    images: [
      {
        url: gallery9,
        altText: "Red modified Nissan 180SX parked on a wet street",
      },
    ],
    // TODO(owner-data): Owner name and build nickname TBD — confirm with client.
    ownerName: "Member Build",
    // TODO(owner-data): Replace this fallback with the owner's approved story.
    caption: "Owner and build details coming soon.",
    fullStory:
      "This full build story is ready for the owner's history, process, and favorite details once the client supplies and approves them.",
    video: {
      id: "spotlight-video-1",
      platform: "instagram",
      embedUrl: null,
      thumbnail: {
        url: gallery9,
        altText: "Video placeholder for the red Nissan 180SX",
      },
      caption: "Build video coming soon.",
    },
  },
  {
    id: "gid://shopify/Metaobject/spotlight-build-2",
    images: [
      {
        url: gallery10,
        altText: "Red Mazda RX-7 displayed in a bright studio",
      },
    ],
    // TODO(owner-data): Owner name and build nickname TBD — confirm with client.
    ownerName: "Member Build",
    // TODO(owner-data): Replace this fallback with the owner's approved story.
    caption: "Owner and build details coming soon.",
    fullStory:
      "This full build story is ready for the owner's history, process, and favorite details once the client supplies and approves them.",
    video: {
      id: "spotlight-video-2",
      platform: "tiktok",
      embedUrl: null,
      thumbnail: {
        url: gallery10,
        altText: "Video placeholder for the red Mazda RX-7",
      },
      caption: "Build video coming soon.",
    },
  },
  {
    id: "gid://shopify/Metaobject/spotlight-build-3",
    images: [
      {
        url: gallery13,
        altText: "White Acura NSX beneath colorful neon signs at night",
      },
    ],
    // TODO(owner-data): Owner name and build nickname TBD — confirm with client.
    ownerName: "Member Build",
    // TODO(owner-data): Replace this fallback with the owner's approved story.
    caption: "Owner and build details coming soon.",
    fullStory:
      "This full build story is ready for the owner's history, process, and favorite details once the client supplies and approves them.",
    video: {
      id: "spotlight-video-3",
      platform: "instagram",
      embedUrl: null,
      thumbnail: {
        url: gallery13,
        altText: "Video placeholder for the white Acura NSX",
      },
      caption: "Build video coming soon.",
    },
  },
] satisfies SpotlightBuild[];

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
      altText: "White modified Nissan photographed from above",
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
      altText: "Green Audi and orange Infiniti at a daytime meet",
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
    image: { url: gallery5, altText: "Turquoise lowered Lexus GS downtown" },
    publishedAt: "2026-03-09T12:00:00Z",
    author: { name: "Lowlife Editorial" },
  },
  {
    handle: "houston-after-dark",
    title: "Houston After Dark",
    excerpt: "A photo diary from the streets that raised the brand.",
    contentHtml: "<p>Houston after sundown, seen through the Lowlife lens.</p>",
    image: { url: gallery8, altText: "Red lowered BMW inside a garage" },
    publishedAt: "2026-02-24T12:00:00Z",
    author: { name: "Lowlife Editorial" },
  },
] satisfies ShopifyArticle[];

export const VIDEO_POSTS = [
  {
    id: "video-1",
    platform: "instagram",
    embedUrl: null,
    thumbnail: {
      url: gallery1,
      altText: "Two lowered coupes beside a weathered brick building",
    },
    caption: "Roll-in hour hits different in Houston.",
  },
  {
    id: "video-2",
    platform: "tiktok",
    embedUrl: null,
    thumbnail: {
      url: gallery2,
      altText: "Lowered blue widebody Camaro on a city street",
    },
    caption: "Fitment check. No shortcuts.",
  },
  {
    id: "video-3",
    platform: "instagram",
    embedUrl: null,
    thumbnail: {
      url: gallery4,
      altText: "Blue widebody Honda Civic among vendor booths",
    },
    caption: "The people make the meet.",
  },
  {
    id: "video-4",
    platform: "tiktok",
    embedUrl: null,
    thumbnail: {
      url: gallery6,
      altText: "Red widebody Lamborghini at an outdoor show",
    },
    caption: "Built for the parking-lot lights.",
  },
  {
    id: "video-5",
    platform: "instagram",
    embedUrl: null,
    thumbnail: {
      url: gallery8,
      altText: "Red lowered BMW inside a working garage",
    },
    caption: "One night. A hundred stories.",
  },
] satisfies ShopifyVideoPostMetaobject[];

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
