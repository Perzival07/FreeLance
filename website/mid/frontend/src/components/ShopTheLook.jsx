import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { LOOKS } from "../config/site";
import { formatPrice, imageUrl, productUrl } from "../utils/format";
import SectionHeading from "./SectionHeading";

// One room photo + a bestseller from each of a few types in that room
const ShopTheLook = () => {
  const { facets, fetchProducts } = useContext(ShopContext);
  const [active, setActive] = useState(0);
  const [picks, setPicks] = useState({});
  const look = LOOKS[active];

  useEffect(() => {
    if (picks[active]) return;
    let cancelled = false;
    Promise.all(
      look.picks.map((sub) =>
        fetchProducts({ category: look.category, subCategory: sub, sort: "bestseller", limit: 1 })
          .then(({ products }) => products[0])
          .catch(() => null)
      )
    ).then((list) => !cancelled && setPicks((p) => ({ ...p, [active]: list.filter(Boolean) })));
    return () => {
      cancelled = true;
    };
  }, [active, look, picks, fetchProducts]);

  const photo =
    facets.combos?.find((c) => c.category === look.category && c.subCategory === look.photoOf)?.image ||
    facets.categories.find((c) => c.name === look.category)?.image;
  const products = picks[active];

  return (
    <section className="section container-site">
      <SectionHeading eyebrow="Shop the look" title="Put a room together" link={`/collection?category=${encodeURIComponent(look.category)}`} linkLabel={`All ${look.category.toLowerCase()}`} />
      <div className="no-scrollbar -mt-2 mb-6 flex gap-2 overflow-x-auto" role="tablist" aria-label="Looks">
        {LOOKS.map((l, i) => (
          <button
            key={l.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${i === active ? "bg-stone-900 text-white" : "border border-stone-300 bg-white text-stone-700 hover:border-stone-900"}`}
          >
            {l.title}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-cream-300 lg:aspect-auto">
          {photo && <img src={imageUrl(photo, 1200)} alt={look.title} loading="lazy" className="h-full w-full object-cover" />}
        </div>
        <ul className="grid grid-cols-2 gap-3">
          {(products || Array.from({ length: 4 })).map((p, i) =>
            p ? (
              <li key={p._id}>
                <Link to={productUrl(p)} className="group flex h-full flex-col rounded-lg border border-cream-300 bg-white p-2 hover:border-stone-400">
                  <img src={imageUrl(p.image?.[0], 400)} alt={p.name} loading="lazy" className="aspect-[4/3] w-full rounded object-cover" />
                  <span className="mt-2 text-xs text-stone-500">{p.subCategory}</span>
                  <span className="line-clamp-2 text-sm text-stone-900 group-hover:text-gold-800">{p.name}</span>
                  <span className="mt-auto pt-1 text-sm font-semibold text-stone-900">{formatPrice(p.price)}</span>
                </Link>
              </li>
            ) : (
              <li key={i} className="aspect-square animate-pulse rounded-lg bg-cream-300" />
            )
          )}
        </ul>
      </div>
    </section>
  );
};

export default ShopTheLook;
