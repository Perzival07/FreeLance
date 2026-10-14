import { useRef } from "react";
import PropTypes from "prop-types";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import Icon from "./Icons";

// Horizontally scrolling row of products with arrow buttons (swipe on touch)
const ProductRail = ({ products, loading = false, label }) => {
  const scroller = useRef(null);
  const scroll = (dir) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const items = loading ? Array.from({ length: 4 }) : products;

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
        role="list"
        aria-label={label}
      >
        {items.map((p, i) => (
          <div key={p?._id || i} role="listitem" className="w-[68%] shrink-0 snap-start sm:w-[40%] md:w-[30%] lg:w-[calc(25%-12px)]">
            {loading ? <ProductCardSkeleton /> : <ProductCard product={p} sizes="(min-width: 1024px) 25vw, 70vw" />}
          </div>
        ))}
      </div>
      {!loading && products.length > 4 && (
        <>
          <button type="button" onClick={() => scroll(-1)} className="absolute -left-5 top-[30%] hidden h-10 w-10 items-center justify-center rounded-full border border-cream-300 bg-white shadow-md hover:border-stone-900 lg:flex" aria-label="Scroll left">
            <Icon name="chevronLeft" />
          </button>
          <button type="button" onClick={() => scroll(1)} className="absolute -right-5 top-[30%] hidden h-10 w-10 items-center justify-center rounded-full border border-cream-300 bg-white shadow-md hover:border-stone-900 lg:flex" aria-label="Scroll right">
            <Icon name="chevronRight" />
          </button>
        </>
      )}
    </div>
  );
};

ProductRail.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  label: PropTypes.string,
};

export default ProductRail;
