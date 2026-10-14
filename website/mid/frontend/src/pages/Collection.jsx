import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import Icon from "../components/Icons";
import useSeo from "../hooks/useSeo";
import { SITE } from "../config/site";
import { formatPrice } from "../utils/format";

const PAGE_SIZE = 24;

const SORT_OPTIONS = [
  { value: "new", label: "Newest first" },
  { value: "bestseller", label: "Bestsellers" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const PRICE_RANGES = [
  { label: "Under ₹5,000", min: "", max: "5000" },
  { label: "₹5,000 – ₹15,000", min: "5000", max: "15000" },
  { label: "₹15,000 – ₹30,000", min: "15000", max: "30000" },
  { label: "₹30,000 – ₹60,000", min: "30000", max: "60000" },
  { label: "Above ₹60,000", min: "60000", max: "" },
];

const splitParam = (v) => (v ? v.split(",").filter(Boolean) : []);

const FilterGroup = ({ title, children }) => (
  <fieldset className="border-b border-cream-300 py-5">
    <legend className="mb-3 text-sm font-semibold text-stone-900">{title}</legend>
    {children}
  </fieldset>
);

FilterGroup.propTypes = { title: PropTypes.string.isRequired, children: PropTypes.node };

const Collection = () => {
  const { fetchProducts, facets } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [retry, setRetry] = useState(0);

  const q = searchParams.get("q") || "";
  const categories = splitParam(searchParams.get("category"));
  const subCategories = splitParam(searchParams.get("subCategory"));
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const inStock = searchParams.get("inStock") === "true";
  const sort = searchParams.get("sort") || "new";

  const query = useMemo(
    () => ({ q, category: categories, subCategory: subCategories, minPrice, maxPrice, inStock: inStock ? "true" : "", sort }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchProducts({ ...query, page: 1, limit: PAGE_SIZE })
      .then(({ products: list, pagination: p }) => {
        if (cancelled) return;
        setProducts(list);
        setPagination(p);
      })
      .catch((e) => !cancelled && setError(e.message || "Could not load products"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [query, fetchProducts, retry]);

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const { products: list, pagination: p } = await fetchProducts({ ...query, page: pagination.currentPage + 1, limit: PAGE_SIZE });
      setProducts((prev) => [...prev, ...list]);
      setPagination(p);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const update = (changes) => {
    const next = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(changes)) {
      const value = Array.isArray(v) ? v.join(",") : v;
      if (value) next.set(k, value);
      else next.delete(k);
    }
    setSearchParams(next);
  };

  const toggleIn = (key, list, value) =>
    update({ [key]: list.includes(value) ? list.filter((x) => x !== value) : [...list, value] });

  const clearAll = () => setSearchParams(q ? { q } : {});

  // Page title from the active filters
  const heading = q
    ? `Results for “${q}”`
    : subCategories.length > 0 && subCategories.length <= 3 && categories.length === 0
    ? subCategories.join(" & ")
    : categories.length === 1 && subCategories.length === 0
    ? `${categories[0]} furniture`
    : "All furniture";

  useSeo({
    title: q ? `Search: ${q}` : heading,
    description: q
      ? `Furniture matching “${q}” at ${SITE.name}, Barasat.`
      : `Shop ${heading.toLowerCase()} at ${SITE.name} — showroom in ${SITE.address.locality}, Kolkata. Delivery & installation across Kolkata.`,
  });

  const chips = [
    ...categories.map((c) => ({ label: c, remove: () => toggleIn("category", categories, c) })),
    ...subCategories.map((s) => ({ label: s, remove: () => toggleIn("subCategory", subCategories, s) })),
    ...(minPrice || maxPrice
      ? [{
          label: minPrice && maxPrice ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}` : minPrice ? `Above ${formatPrice(minPrice)}` : `Under ${formatPrice(maxPrice)}`,
          remove: () => update({ minPrice: "", maxPrice: "" }),
        }]
      : []),
    ...(inStock ? [{ label: "In stock", remove: () => update({ inStock: "" }) }] : []),
  ];

  const filters = (
    <div>
      <FilterGroup title="Type">
        <div className="space-y-2">
          {facets.subCategories.map((s) => (
            <label key={s.name} className="flex cursor-pointer items-center gap-3 text-sm text-stone-700">
              <input type="checkbox" className="h-4 w-4" checked={subCategories.includes(s.name)} onChange={() => toggleIn("subCategory", subCategories, s.name)} />
              <span className="flex-1">{s.name}</span>
              <span className="text-xs text-stone-400">{s.count}</span>
            </label>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Room">
        <div className="space-y-2">
          {facets.categories.map((c) => (
            <label key={c.name} className="flex cursor-pointer items-center gap-3 text-sm text-stone-700">
              <input type="checkbox" className="h-4 w-4" checked={categories.includes(c.name)} onChange={() => toggleIn("category", categories, c.name)} />
              <span className="flex-1">{c.name}</span>
              <span className="text-xs text-stone-400">{c.count}</span>
            </label>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Price">
        <div className="space-y-2">
          {PRICE_RANGES.map((r) => (
            <label key={r.label} className="flex cursor-pointer items-center gap-3 text-sm text-stone-700">
              <input
                type="radio"
                name="price"
                className="h-4 w-4"
                checked={minPrice === r.min && maxPrice === r.max}
                onChange={() => update({ minPrice: r.min, maxPrice: r.max })}
              />
              {r.label}
            </label>
          ))}
        </div>
        <form
          className="mt-4 flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            update({ minPrice: f.get("min"), maxPrice: f.get("max") });
          }}
        >
          <label className="flex-1 text-xs text-stone-500">
            Min ₹
            <input name="min" type="number" min="0" inputMode="numeric" defaultValue={minPrice} key={`min-${minPrice}`} className="input mt-1 px-2 py-1.5" />
          </label>
          <label className="flex-1 text-xs text-stone-500">
            Max ₹
            <input name="max" type="number" min="0" inputMode="numeric" defaultValue={maxPrice} key={`max-${maxPrice}`} className="input mt-1 px-2 py-1.5" />
          </label>
          <button type="submit" className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:border-stone-900">Go</button>
        </form>
      </FilterGroup>
      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-700">
          <input type="checkbox" className="h-4 w-4" checked={inStock} onChange={() => update({ inStock: inStock ? "" : "true" })} />
          In stock / made to order only
        </label>
      </FilterGroup>
    </div>
  );

  const sortSelect = (id) => (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-stone-600">
      <span className="hidden sm:inline">Sort by</span>
      <select id={id} value={sort} onChange={(e) => update({ sort: e.target.value === "new" ? "" : e.target.value })} className="input w-auto py-2">
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ label: "Furniture", to: "/collection" }, ...(heading !== "All furniture" ? [{ label: heading }] : [])]} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">{heading}</h1>
          <p className="mt-2 text-sm text-stone-600" aria-live="polite">
            {loading ? "Loading…" : `${pagination.totalProducts} ${pagination.totalProducts === 1 ? "product" : "products"}`}
          </p>
        </div>
        <div className="hidden lg:block">{sortSelect("sort-desktop")}</div>
      </div>

      {chips.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button key={c.label} type="button" onClick={c.remove} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm text-stone-800 ring-1 ring-cream-300 hover:ring-stone-900" aria-label={`Remove filter ${c.label}`}>
              {c.label} <Icon name="close" className="h-3.5 w-3.5" />
            </button>
          ))}
          <button type="button" onClick={clearAll} className="px-2 text-sm text-stone-600 underline underline-offset-4 hover:text-stone-900">
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-10">
        <aside className="hidden w-60 shrink-0 lg:block" aria-label="Filters">
          <div className="sticky top-44 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">{filters}</div>
        </aside>

        <div className="min-w-0 flex-1">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
              {error}. <button type="button" className="underline" onClick={() => setRetry((r) => r + 1)}>Try again</button>
            </div>
          )}

          {!loading && !error && products.length === 0 ? (
            <div className="card flex flex-col items-center p-10 text-center">
              <Icon name="search" className="h-10 w-10 text-stone-400" />
              <p className="mt-4 text-lg font-medium text-stone-900">No furniture matches these filters</p>
              <p className="mt-1 max-w-md text-sm text-stone-600">
                Try removing a filter — or tell us what you&apos;re looking for. We can often make it to order.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => setSearchParams({})} className="btn-outline">Clear filters</button>
                <Link to="/custom-furniture" className="btn-primary">Request a custom piece</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
              {loading
                ? Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : products.map((p) => <ProductCard key={p._id} product={p} sizes="(min-width: 1024px) 28vw, 50vw" />)}
            </div>
          )}

          {!loading && pagination.currentPage < pagination.totalPages && (
            <div className="mt-10 flex flex-col items-center gap-2">
              <p className="text-sm text-stone-500">
                Showing {products.length} of {pagination.totalProducts}
              </p>
              <button type="button" onClick={loadMore} disabled={loadingMore} className="btn-outline">
                {loadingMore ? "Loading…" : "Show more"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter / sort bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-cream-300 bg-white p-3 lg:hidden">
        <button type="button" onClick={() => setFiltersOpen(true)} className="btn-outline flex-1 py-2.5">
          <Icon name="filter" className="h-4 w-4" /> Filters{chips.length ? ` (${chips.length})` : ""}
        </button>
        <div className="flex-1 [&_select]:w-full [&_label]:w-full">{sortSelect("sort-mobile")}</div>
      </div>
      <div className="h-16 lg:hidden" aria-hidden="true" />

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} aria-label="Close filters" />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white">
            <div className="flex items-center justify-between border-b border-cream-300 px-5 py-4">
              <p className="text-lg font-semibold">Filters</p>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <Icon name="close" className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5">{filters}</div>
            <div className="flex gap-3 border-t border-cream-300 p-4">
              <button type="button" onClick={clearAll} className="btn-outline flex-1">Clear</button>
              <button type="button" onClick={() => setFiltersOpen(false)} className="btn-primary flex-1">
                Show {pagination.totalProducts} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
