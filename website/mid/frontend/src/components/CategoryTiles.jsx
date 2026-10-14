import { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { NAV_CATEGORIES } from "../config/site";
import { imageUrl } from "../utils/format";
import SectionHeading from "./SectionHeading";

// "Shop by category" — photo comes from a product in that category
const CategoryTiles = () => {
  const { facets } = useContext(ShopContext);
  const bySub = new Map(facets.subCategories.map((s) => [s.name, s]));
  const tiles = NAV_CATEGORIES.map((c) => ({ ...c, facet: bySub.get(c.subCategory) })).filter((c) => c.facet);
  const loading = facets.subCategories.length === 0;

  return (
    <section className="section container-site">
      <SectionHeading eyebrow="Shop by category" title="Everything for your home" link="/collection" linkLabel="All furniture" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-lg bg-cream-300" />)
          : tiles.map((c) => (
              <Link
                key={c.label}
                to={`/collection?subCategory=${encodeURIComponent(c.subCategory)}`}
                className="group relative block aspect-square overflow-hidden rounded-lg bg-cream-300"
              >
                <img src={imageUrl(c.facet.image, 500)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <p className="font-display text-xl font-semibold text-white sm:text-2xl">{c.label}</p>
                  <p className="text-xs text-white/85">{c.facet.count} designs</p>
                </div>
              </Link>
            ))}
        {!loading && (
          <Link to="/collection" className="flex aspect-square flex-col items-center justify-center rounded-lg border border-stone-300 bg-white p-4 text-center hover:border-stone-900">
            <span className="font-display text-xl font-semibold text-stone-900 sm:text-2xl">All furniture</span>
            <span className="mt-1 text-xs text-stone-600">{facets.subCategories.reduce((n, s) => n + s.count, 0)} designs</span>
            <span className="mt-3 flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-white">→</span>
          </Link>
        )}
      </div>
    </section>
  );
};

export default CategoryTiles;
