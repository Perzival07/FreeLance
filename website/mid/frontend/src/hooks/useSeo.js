import { useEffect } from "react";
import { SITE } from "../config/site";

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/**
 * Per-page <title>, description, Open Graph tags, canonical URL and optional JSON-LD.
 * title: page name only — the store name is appended.
 */
const useSeo = ({ title, description, image, jsonLd } = {}) => {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} | Sofas & Furniture in Barasat, Kolkata`;
    const desc = description || SITE.description;
    const url = window.location.origin + window.location.pathname;

    document.title = fullTitle;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "website");
    if (image) setMeta("property", "og:image", image);
    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    setCanonical(url);

    let script;
    if (jsonLdString) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.page = "true";
      script.textContent = jsonLdString;
      document.head.appendChild(script);
    }
    return () => script?.remove();
  }, [title, description, image, jsonLdString]);
};

export default useSeo;
