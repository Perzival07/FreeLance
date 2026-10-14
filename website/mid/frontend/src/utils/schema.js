import { SITE } from "../config/site";

const DAY_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** schema.org FurnitureStore for Google local results */
export const localBusinessSchema = () => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const a = SITE.address;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: SITE.name,
    description: SITE.description,
    url: origin,
    logo: `${origin}/icon.png`,
    image: `${origin}/og-image.jpg`,
    telephone: SITE.phone.replace(/\s/g, ""),
    email: SITE.email,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: a.line1,
      addressLocality: `${a.locality}, ${a.city}`,
      addressRegion: a.state,
      postalCode: a.pincode,
      addressCountry: a.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.mapsUrl,
    openingHoursSpecification: SITE.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY_SCHEMA[h.day],
      opens: h.open,
      closes: h.close,
    })),
    areaServed: SITE.deliveryAreas,
  };
  const sameAs = Object.values(SITE.social).filter(Boolean);
  if (sameAs.length) schema.sameAs = sameAs;
  if (SITE.googleRating) {
    schema.aggregateRating = { "@type": "AggregateRating", ratingValue: SITE.googleRating.value, reviewCount: SITE.googleRating.count };
  }
  return schema;
};

export const faqSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
