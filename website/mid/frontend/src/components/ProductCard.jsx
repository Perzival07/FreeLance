import { useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import { dimensionsToKey } from "../utils/dimensionsConverter";
import { discountPercent, formatPrice, imageSrcSet, imageUrl, isNewProduct, productUrl } from "../utils/format";
import Icon from "./Icons";
import Stars from "./Stars";

const Badge = ({ children, tone = "light" }) => (
  <span
    className={`rounded px-2 py-0.5 text-[11px] font-medium ${
      tone === "dark" ? "bg-stone-900 text-white" : tone === "gold" ? "bg-gold-500 text-stone-900" : "bg-white/95 text-stone-800"
    }`}
  >
    {children}
  </span>
);

Badge.propTypes = { children: PropTypes.node, tone: PropTypes.string };

const ProductCard = ({ product, sizes = "(min-width: 1024px) 25vw, 50vw" }) => {
  const { toggleWishlist, isWishlisted } = useContext(ShopContext);
  const dimKey = dimensionsToKey(product.dimensions);
  const saved = dimKey && isWishlisted(product._id, dimKey);
  const off = discountPercent(product.price, product.mrp);
  const outOfStock = !product.madeToOrder && (product.stock ?? 0) <= 0;
  const [img1, img2] = product.image || [];
  const href = productUrl(product);

  return (
    <article className="group relative flex flex-col">
      <Link to={href} className="relative block overflow-hidden rounded-lg bg-cream-200">
        <img
          src={imageUrl(img1, 600)}
          srcSet={imageSrcSet(img1, [400, 600, 900])}
          sizes={sizes}
          alt={product.name}
          loading="lazy"
          className={`aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03] ${outOfStock ? "opacity-60" : ""}`}
        />
        {img2 && (
          <img
            src={imageUrl(img2, 600)}
            alt=""
            loading="lazy"
            className="absolute inset-0 aspect-[4/3] w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {outOfStock && <Badge tone="dark">Out of stock</Badge>}
          {off > 0 && <Badge tone="gold">{off}% off</Badge>}
          {product.bestseller && <Badge>Bestseller</Badge>}
          {!product.bestseller && isNewProduct(product) && <Badge>New</Badge>}
          {product.madeToOrder && <Badge>Made to order</Badge>}
        </div>
      </Link>

      {dimKey && (
        <button
          type="button"
          onClick={() => toggleWishlist(product._id, dimKey)}
          className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition-colors ${saved ? "text-red-600" : "text-stone-700 hover:text-red-600"}`}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={Boolean(saved)}
        >
          <Icon name="heart" className="h-[18px] w-[18px]" filled={Boolean(saved)} />
        </button>
      )}

      <div className="flex flex-1 flex-col pt-3">
        <p className="text-xs text-stone-500">{product.subCategory}</p>
        <h3 className="mt-0.5 font-sans text-[15px] font-normal leading-snug text-stone-900">
          <Link to={href} className="line-clamp-2 hover:text-gold-800">
            {product.name}
          </Link>
        </h3>
        {product.reviewCount > 0 && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
            <Stars value={product.avgRating} className="h-3.5 w-3.5" /> ({product.reviewCount})
          </div>
        )}
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-semibold text-stone-900">{formatPrice(product.price)}</span>
          {off > 0 && <span className="text-sm text-stone-500 line-through">{formatPrice(product.mrp)}</span>}
        </p>
      </div>
    </article>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  sizes: PropTypes.string,
};

export const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[4/3] w-full rounded-lg bg-cream-300" />
    <div className="mt-3 h-3 w-1/3 rounded bg-cream-300" />
    <div className="mt-2 h-4 w-3/4 rounded bg-cream-300" />
    <div className="mt-2 h-4 w-1/4 rounded bg-cream-300" />
  </div>
);

export default ProductCard;
