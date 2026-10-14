import { SITE } from "../config/site";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** ₹45,000 */
export const formatPrice = (value) => `₹${inr.format(Number(value) || 0)}`;

/** Percentage off when MRP is higher than the selling price, else 0 */
export const discountPercent = (price, mrp) => {
  const p = Number(price);
  const m = Number(mrp);
  if (!m || !p || m <= p) return 0;
  return Math.round(((m - p) / m) * 100);
};

export const slugify = (str) =>
  String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** /product/3-seater-chesterfield-sofa-66a1f… — the id at the end is what the page reads */
export const productUrl = (product) => {
  const slug = product?.slug || slugify(product?.name);
  return `/product/${slug}${slug ? "-" : ""}${product?._id}`;
};

/** Accepts "<slug>-<id>" or a bare id */
export const productIdFromParam = (param) => {
  const match = String(param || "").match(/([0-9a-f]{24})$/i);
  return match ? match[1] : String(param || "");
};

/** Resized, auto-format Cloudinary URL; other URLs are returned unchanged */
export const imageUrl = (url, width = 600) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
};

export const imageSrcSet = (url, widths = [400, 800, 1200]) => {
  if (!url || !url.includes("res.cloudinary.com")) return undefined;
  return widths.map((w) => `${imageUrl(url, w)} ${w}w`).join(", ");
};

export const isNewProduct = (product, days = 30) => {
  const t = new Date(product?.date).getTime();
  return Number.isFinite(t) && Date.now() - t < days * 24 * 60 * 60 * 1000;
};

export const stockLabel = (product) => {
  const stock = Number(product?.stock ?? 0);
  if (product?.madeToOrder) return { text: "Made to order", tone: "neutral" };
  if (stock <= 0) return { text: "Out of stock", tone: "bad" };
  if (stock <= 3) return { text: "Only a few left", tone: "warn" };
  return { text: "In stock", tone: "good" };
};

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const formatTime = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}${m ? `:${String(m).padStart(2, "0")}` : ""} ${suffix}`;
};

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Showroom status in India time, whatever the visitor's timezone */
export const showroomStatus = (now = new Date()) => {
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const today = SITE.hours.find((h) => h.day === ist.getDay());
  const minutes = ist.getHours() * 60 + ist.getMinutes();
  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, text: `Open now · until ${formatTime(today.close)}` };
  }
  if (today && minutes < toMinutes(today.open)) {
    return { open: false, text: `Closed · opens ${formatTime(today.open)} today` };
  }
  const tomorrow = SITE.hours.find((h) => h.day === (ist.getDay() + 1) % 7);
  return { open: false, text: tomorrow ? `Closed · opens ${formatTime(tomorrow.open)} tomorrow` : "Closed" };
};

/** "10 AM – 8 PM (Thu 11 AM – 5 PM)" — the most common hours, with exceptions in brackets */
export const hoursSummary = () => {
  const groups = {};
  for (const h of SITE.hours) {
    const key = `${formatTime(h.open)} – ${formatTime(h.close)}`;
    (groups[key] ||= []).push(h.day);
  }
  const [main, ...others] = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  if (!main) return "";
  const exceptions = others.map(([time, days]) => `${days.map((d) => DAY_NAMES[d].slice(0, 3)).join(", ")} ${time}`);
  return exceptions.length ? `${main[0]} (${exceptions.join("; ")})` : `Daily ${main[0]}`;
};
