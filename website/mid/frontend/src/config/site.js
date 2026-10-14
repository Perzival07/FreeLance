// Business details used across the storefront.
// Fields left empty ("" / null / []) are hidden on the site until they are filled in.

export const SITE = {
  name: "Loknath Sofa Center",
  shortName: "Loknath",
  tagline: "Sofas & furniture, made to last",
  description:
    "Loknath Sofa Center, Barasat — sofas, beds, wardrobes, dining and custom-made furniture. Visit our showroom at Bidhan Park or shop online with delivery across Kolkata.",

  phone: "+91 91239 24645",
  phoneHref: "tel:+919123924645",
  // WhatsApp number in international format without "+" (used for wa.me links)
  whatsapp: "919123924645",
  email: "loknathsofacenter@gmail.com",

  address: {
    line1: "Bidhan Park",
    locality: "Barasat",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700124",
    country: "IN",
  },
  geo: { lat: 22.7180601, lng: 88.4907312 },
  mapsUrl:
    "https://www.google.com/maps/place/Loknath+Sofa+Center/@22.7179621,88.4911163,19.6z/data=!4m6!3m5!1s0x39f8a300549ab59f:0xcaabd02a4a58e490!8m2!3d22.7180601!4d88.4907312!16s%2Fg%2F11vzy_2ywh",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230.01729385040636!2d88.49087502773321!3d22.71795455458312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8a300549ab59f%3A0xcaabd02a4a58e490!2sLoknath%20Sofa%20Center!5e0!3m2!1sen!2sin!4v1766226403147!5m2!1sen!2sin",

  // 0 = Sunday … 6 = Saturday, 24h "HH:MM"
  hours: [
    { day: 0, open: "10:00", close: "20:00" },
    { day: 1, open: "10:00", close: "20:00" },
    { day: 2, open: "10:00", close: "20:00" },
    { day: 3, open: "10:00", close: "20:00" },
    { day: 4, open: "11:00", close: "17:00" },
    { day: 5, open: "10:00", close: "20:00" },
    { day: 6, open: "10:00", close: "20:00" },
  ],

  // TODO(owner): fill in to show them on the site
  establishedYear: null,
  gstin: "",
  googleRating: null, // e.g. { value: 4.6, count: 120 }
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
  },

  // TODO(owner): confirm these service terms before going live
  warrantyText: "1-year warranty against manufacturing defects",
  returnWindowDays: 7,
  deliveryText: "Delivery & installation by our team",
  emiAvailable: false,

  showroomAmenities: [
    "Full range on display — sit, touch and compare",
    "Fabric & finish samples",
    "Cash, UPI and cards accepted",
    "Home delivery & installation",
    "Custom sizes made to order",
  ],

  deliveryAreas: [
    "Barasat",
    "Madhyamgram",
    "New Barrackpore",
    "Duttapukur",
    "Habra",
    "Rajarhat",
    "New Town",
    "Salt Lake",
    "Dum Dum",
    "Kolkata",
  ],
};

// Approximate road distance from the showroom, used for the delivery estimate on product pages.
// The exact charge is calculated at checkout from the customer's own distance.
export const DELIVERY_ESTIMATE_AREAS = [
  { area: "Barasat", km: 3 },
  { area: "Madhyamgram", km: 6 },
  { area: "Duttapukur", km: 10 },
  { area: "New Barrackpore", km: 10 },
  { area: "Dum Dum", km: 14 },
  { area: "Rajarhat / New Town", km: 15 },
  { area: "Salt Lake", km: 18 },
  { area: "Habra", km: 24 },
  { area: "Central Kolkata", km: 26 },
];

// Header navigation — maps to product types (subCategory) in the catalogue
export const NAV_CATEGORIES = [
  { label: "Sofas", subCategory: "Sofas" },
  { label: "Beds", subCategory: "Beds" },
  { label: "Wardrobes", subCategory: "Wardrobes" },
  { label: "Tables", subCategory: "Tables" },
  { label: "Chairs", subCategory: "Chairs" },
  { label: "Storage", subCategory: "Storage" },
  { label: "Shelving", subCategory: "Shelving" },
  { label: "Desks", subCategory: "Desks" },
  { label: "Lighting", subCategory: "Lighting" },
];

export const ROOMS = [
  { label: "Living Room", category: "Living Room", photoOf: "Sofas", blurb: "Sofas, coffee tables, TV units" },
  { label: "Bedroom", category: "Bedroom", photoOf: "Beds", blurb: "Beds, wardrobes, side tables" },
  { label: "Dining Room", category: "Dining Room", photoOf: "Tables", blurb: "Dining sets, chairs, sideboards" },
  { label: "Home Office", category: "Office", photoOf: "Desks", blurb: "Desks, chairs, bookshelves" },
];

export const TRENDING_SEARCHES = ["Sofa", "Bed", "Wardrobe", "Dining table", "Recliner", "Bookshelf"];

export const MATERIALS = [
  {
    name: "Sheesham wood",
    link: "/collection?q=Sheesham",
    text: "Dense Indian rosewood with a rich grain. Strong, termite-resistant and ages beautifully — ideal for beds and dining tables.",
  },
  {
    name: "Engineered wood",
    link: "/collection?q=Engineered%20wood",
    text: "Stable, affordable and available in many finishes. A smart choice for wardrobes, TV units and storage.",
  },
  {
    name: "Fabric upholstery",
    link: "/collection?subCategory=Sofas",
    text: "Breathable and comfortable for Kolkata's humidity. Choose from many colours; pick darker shades for homes with kids and pets.",
  },
  {
    name: "Leatherette",
    text: "Leather look that wipes clean in seconds. Keep it away from direct sunlight to stop cracking.",
  },
];

export const ORDER_STEPS = ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered"];

export const whatsappLink = (text = "") =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const fullAddress = () => {
  const a = SITE.address;
  return `${a.line1}, ${a.locality}, ${a.city} – ${a.pincode}, ${a.state}`;
};
