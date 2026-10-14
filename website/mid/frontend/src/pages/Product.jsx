import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductRail from "../components/ProductRail";
import Accordion from "../components/Accordion";
import LeadForm from "../components/LeadForm";
import Stars from "../components/Stars";
import Icon, { WhatsAppIcon } from "../components/Icons";
import SectionHeading from "../components/SectionHeading";
import useSeo from "../hooks/useSeo";
import { DELIVERY_ESTIMATE_AREAS, SITE, whatsappLink } from "../config/site";
import { formatDimensions, dimensionsToKey } from "../utils/dimensionsConverter";
import {
  discountPercent,
  formatPrice,
  imageSrcSet,
  imageUrl,
  productIdFromParam,
  productUrl,
  stockLabel,
} from "../utils/format";
import { addRecentlyViewed, getRecentlyViewed } from "../utils/recentlyViewed";

const STOCK_TONE = {
  good: "text-green-700",
  warn: "text-amber-700",
  bad: "text-red-700",
  neutral: "text-stone-700",
};

const Gallery = ({ images, name }) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const scroller = useRef(null);

  // Sync dots with swipe position on mobile
  const onScroll = () => {
    const el = scroller.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  const show = (i) => {
    setActive(i);
    const el = scroller.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % images.length);
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, images.length]);

  return (
    <div className="flex flex-col-reverse gap-3 self-start lg:sticky lg:top-44 lg:flex-row lg:items-start">
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto lg:max-h-[560px] lg:w-20 lg:flex-col lg:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => show(i)}
              className={`w-16 shrink-0 overflow-hidden rounded-md border-2 lg:w-full ${i === active ? "border-stone-900" : "border-transparent hover:border-cream-400"}`}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
            >
              <img src={imageUrl(img, 160)} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative h-fit min-w-0 flex-1">
        <div ref={scroller} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-lg bg-cream-200">
          {images.map((img, i) => (
            <button key={img + i} type="button" onClick={() => setLightbox(true)} className="w-full shrink-0 snap-center cursor-zoom-in" aria-label="Open full-screen image">
              <img
                src={imageUrl(img, 1000)}
                srcSet={imageSrcSet(img, [600, 1000, 1600])}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt={i === 0 ? name : `${name} — view ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                // eslint-disable-next-line react/no-unknown-property -- React 18 needs the lowercase attribute
                fetchpriority={i === 0 ? "high" : undefined}
                className="aspect-[4/3] w-full object-cover"
              />
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs text-stone-700">
          <Icon name="zoom" className="h-3.5 w-3.5" /> Tap to zoom
        </span>
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 lg:hidden">
            {images.map((img, i) => (
              <span key={img + i} className={`h-1.5 rounded-full ${i === active ? "w-5 bg-stone-900" : "w-1.5 bg-white"}`} />
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95" role="dialog" aria-modal="true" aria-label={`${name} images`}>
          <button type="button" onClick={() => setLightbox(false)} className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close">
            <Icon name="close" className="h-6 w-6" />
          </button>
          {images.length > 1 && (
            <>
              <button type="button" onClick={() => setActive((a) => (a - 1 + images.length) % images.length)} className="absolute left-3 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Previous image">
                <Icon name="chevronLeft" className="h-6 w-6" />
              </button>
              <button type="button" onClick={() => setActive((a) => (a + 1) % images.length)} className="absolute right-3 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Next image">
                <Icon name="chevronRight" className="h-6 w-6" />
              </button>
            </>
          )}
          <div className="h-full w-full overflow-auto">
            <img src={imageUrl(images[active], 2000)} alt={name} className="m-auto min-h-full max-w-none object-contain sm:max-w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

Gallery.propTypes = { images: PropTypes.arrayOf(PropTypes.string).isRequired, name: PropTypes.string.isRequired };

const DeliveryEstimate = ({ backendUrl }) => {
  const [area, setArea] = useState("");
  const [fee, setFee] = useState(null);

  useEffect(() => {
    const match = DELIVERY_ESTIMATE_AREAS.find((a) => a.area === area);
    if (!match) {
      setFee(null);
      return;
    }
    let cancelled = false;
    axios
      .post(`${backendUrl}/delivery/calculate`, { distance: match.km })
      .then(({ data }) => !cancelled && data.success && setFee(data.fee))
      .catch(() => !cancelled && setFee(null));
    return () => {
      cancelled = true;
    };
  }, [area, backendUrl]);

  return (
    <div className="rounded-lg border border-cream-300 bg-cream-50 p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-stone-900">
        <Icon name="truck" className="h-4 w-4 text-gold-800" /> Delivery & installation
      </p>
      <label htmlFor="delivery-area" className="mt-3 block text-xs text-stone-600">Estimate the charge for your area</label>
      <select id="delivery-area" value={area} onChange={(e) => setArea(e.target.value)} className="input mt-1 py-2">
        <option value="">Choose your area</option>
        {DELIVERY_ESTIMATE_AREAS.map((a) => (
          <option key={a.area}>{a.area}</option>
        ))}
      </select>
      {fee !== null && (
        <p className="mt-2 text-sm text-stone-700" aria-live="polite">
          About <strong>{formatPrice(fee)}</strong> for delivery, carrying and installation (ground floor / lift). Exact charge is shown at checkout.
        </p>
      )}
      <p className="mt-2 text-xs text-stone-500">Usually delivered in 3–7 days in Kolkata. Made-to-order pieces take longer — we&apos;ll confirm the date.</p>
    </div>
  );
};

DeliveryEstimate.propTypes = { backendUrl: PropTypes.string.isRequired };

const RatingBreakdown = ({ reviews }) => {
  const counts = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => r.rating === n).length }));
  return (
    <div className="space-y-1.5">
      {counts.map(({ n, c }) => (
        <div key={n} className="flex items-center gap-2 text-sm">
          <span className="w-8 text-stone-600">{n} ★</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-300">
            <div className="h-full bg-gold-600" style={{ width: `${reviews.length ? (c / reviews.length) * 100 : 0}%` }} />
          </div>
          <span className="w-6 text-right text-stone-500">{c}</span>
        </div>
      ))}
    </div>
  );
};

RatingBreakdown.propTypes = { reviews: PropTypes.array.isRequired };

const Product = () => {
  const { productId: param } = useParams();
  const productId = productIdFromParam(param);
  const routerNavigate = useNavigate();
  const { productCache, addToCart, fetchProductById, fetchProducts, ensureProducts, token, toggleWishlist, isWishlisted, backendUrl } =
    useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [related, setRelated] = useState(null);
  const [recentIds, setRecentIds] = useState([]);

  // Load product (cached copy first, then fresh from the server)
  useEffect(() => {
    let cancelled = false;
    const cached = productCache[productId];
    if (cached) {
      setProduct(cached);
      setLoading(false);
    } else {
      setProduct(null);
      setLoading(true);
    }
    fetchProductById(productId).then((p) => {
      if (cancelled) return;
      if (p) setProduct(p);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, fetchProductById]);

  // Canonical URL with the product name in it
  useEffect(() => {
    if (product && param !== productUrl(product).replace("/product/", "")) {
      routerNavigate(productUrl(product), { replace: true });
    }
  }, [product, param, routerNavigate]);

  useEffect(() => {
    if (!productId) return;
    setRecentIds(getRecentlyViewed().filter((id) => id !== productId).slice(0, 8));
    addRecentlyViewed(productId);
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    if (recentIds.length) ensureProducts(recentIds);
  }, [recentIds, ensureProducts]);

  const loadReviews = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/review/product/${productId}`);
      if (data.success) {
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating ?? 0);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, backendUrl]);

  useEffect(() => {
    if (!product) return;
    let cancelled = false;
    setRelated(null);
    fetchProducts({ subCategory: product.subCategory, exclude: product._id, limit: 12, sort: "bestseller" })
      .then(({ products }) => !cancelled && setRelated(products))
      .catch(() => !cancelled && setRelated([]));
    return () => {
      cancelled = true;
    };
  }, [product?._id, product?.subCategory, fetchProducts]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitReview = async (e) => {
    e.preventDefault();
    const text = reviewComment.trim();
    if (text.length < 3) {
      toast.error("Please write a short comment (at least 3 characters)");
      return;
    }
    setReviewSubmitting(true);
    try {
      const { data } = await axios.post(`${backendUrl}/review/add`, { productId, rating: reviewRating, comment: text }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        setReviewComment("");
        loadReviews();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const off = product ? discountPercent(product.price, product.mrp) : 0;

  useSeo({
    title: product?.name || (loading ? "" : "Product not found"),
    description: product
      ? `${product.name} — ${formatPrice(product.price)}. ${String(product.description).slice(0, 140)}`
      : undefined,
    image: product?.image?.[0] ? imageUrl(product.image[0], 1200) : undefined,
    jsonLd: product
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          image: product.image,
          description: product.description,
          category: product.subCategory,
          brand: { "@type": "Brand", name: SITE.name },
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: product.price,
            availability:
              product.madeToOrder || (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: typeof window !== "undefined" ? window.location.origin + productUrl(product) : undefined,
          },
          ...(reviews.length
            ? { aggregateRating: { "@type": "AggregateRating", ratingValue: avgRating, reviewCount: reviews.length } }
            : {}),
        }
      : undefined,
  });

  if (loading) {
    return (
      <div className="container-site grid gap-10 py-10 lg:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-lg bg-cream-300" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-cream-300" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-cream-300" />
          <div className="h-24 animate-pulse rounded bg-cream-300" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="text-4xl font-semibold">Product not found</h1>
        <p className="mt-3 text-stone-600">It may have been sold out or removed.</p>
        <Link to="/collection" className="btn-primary mt-6">Browse all furniture</Link>
      </div>
    );
  }

  const dimKey = dimensionsToKey(product.dimensions);
  const dims = formatDimensions(product.dimensions);
  const stock = stockLabel(product);
  const canBuy = product.madeToOrder || (product.stock ?? 0) > 0;
  const saved = dimKey && isWishlisted(product._id, dimKey);
  const waText = `Hi, I'm interested in "${product.name}" (${formatPrice(product.price)}). ${window.location.origin}${productUrl(product)}`;
  const recent = recentIds.map((id) => productCache[id]).filter(Boolean);

  const specs = [
    dims && ["Dimensions (W × D × H)", `${dims.length.displayCm} × ${dims.breadth.displayCm} × ${dims.height.displayCm}`],
    dims && ["In feet / inches", `${dims.length.displayFeetInches} × ${dims.breadth.displayFeetInches} × ${dims.height.displayFeetInches}`],
    product.material && ["Material", product.material],
    product.colors?.length > 0 && ["Available colours", product.colors.join(", ")],
    product.seating && ["Seating", product.seating],
    ["Room", product.category],
    ["Type", product.subCategory],
    ["Warranty", product.warranty || SITE.warrantyText],
    ["Installation", "Included with delivery by our team"],
  ].filter(Boolean);

  const addItem = () => {
    if (canBuy && dimKey) addToCart(product._id, dimKey);
  };

  return (
    <div className="pb-24 lg:pb-0">
      <div className="container-site pt-6">
        <Breadcrumbs
          items={[
            { label: "Furniture", to: "/collection" },
            { label: product.subCategory, to: `/collection?subCategory=${encodeURIComponent(product.subCategory)}` },
            { label: product.name },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <Gallery images={product.image} name={product.name} />

          <div>
            <p className="text-sm text-stone-500">{product.subCategory} · {product.category}</p>
            <h1 className="mt-1 text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h1>

            {reviews.length > 0 && (
              <a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900">
                <Stars value={avgRating} /> {avgRating} · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </a>
            )}

            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-3xl font-semibold text-stone-900">{formatPrice(product.price)}</span>
              {off > 0 && (
                <>
                  <span className="text-lg text-stone-500 line-through">{formatPrice(product.mrp)}</span>
                  <span className="rounded bg-gold-500 px-2 py-0.5 text-sm font-medium text-stone-900">{off}% off</span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-stone-500">Inclusive of all taxes · delivery charged at checkout</p>
            {SITE.emiAvailable && (
              <p className="mt-1 text-sm text-stone-700">EMI from {formatPrice(Math.ceil(product.price / 12))}/month on credit cards</p>
            )}

            <p className={`mt-4 text-sm font-medium ${STOCK_TONE[stock.tone]}`}>{stock.text}</p>

            {product.colors?.length > 0 && (
              <p className="mt-3 text-sm text-stone-700">
                <span className="font-medium text-stone-900">Available in:</span> {product.colors.join(", ")}
                <span className="block text-xs text-stone-500">Mention your colour in the order notes or on WhatsApp.</span>
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={addItem} disabled={!canBuy} className="btn-primary flex-1 py-3.5">
                <Icon name="bag" className="h-4 w-4" /> {canBuy ? "Add to cart" : "Out of stock"}
              </button>
              {dimKey && (
                <button
                  type="button"
                  onClick={() => toggleWishlist(product._id, dimKey)}
                  className={`btn-outline px-4 ${saved ? "text-red-600" : ""}`}
                  aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                  aria-pressed={Boolean(saved)}
                >
                  <Icon name="heart" className="h-5 w-5" filled={Boolean(saved)} />
                </button>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp us
              </a>
              <a href={SITE.phoneHref} className="btn-outline">
                <Icon name="phone" className="h-4 w-4" /> Call us
              </a>
            </div>
            <Link to="/showroom" className="mt-3 flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900">
              <Icon name="store" className="h-4 w-4 text-gold-800" />
              See it in our showroom at {SITE.address.line1}, {SITE.address.locality}
              <Icon name="chevronRight" className="h-4 w-4" />
            </Link>

            <div className="mt-6">
              <DeliveryEstimate backendUrl={backendUrl} />
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-stone-700">
              <li className="flex items-center gap-2"><Icon name="shield" className="h-4 w-4 text-gold-800" /> {product.warranty || SITE.warrantyText.replace(/ against.*/, "")}</li>
              <li className="flex items-center gap-2"><Icon name="wallet" className="h-4 w-4 text-gold-800" /> Cash on delivery</li>
              <li className="flex items-center gap-2"><Icon name="ruler" className="h-4 w-4 text-gold-800" /> Custom sizes on request</li>
              <li className="flex items-center gap-2"><Icon name="truck" className="h-4 w-4 text-gold-800" /> Installation included</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold">About this piece</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-stone-700">{product.description}</p>

            <h2 className="mt-10 text-3xl font-semibold">Specifications</h2>
            <table className="mt-4 w-full text-sm">
              <tbody className="divide-y divide-cream-300 border-y border-cream-300">
                {specs.map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row" className="w-2/5 py-3 pr-4 text-left font-normal text-stone-500">{k}</th>
                    <td className="py-3 text-stone-900">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="text-3xl font-semibold">Delivery, returns & care</h2>
            <div className="mt-4">
              <Accordion
                defaultOpen={0}
                items={[
                  {
                    title: "Delivery & installation",
                    content: (
                      <>
                        Delivered by our own team, carried to your room and assembled. Charges depend on distance and floor and are shown at checkout before you pay.{" "}
                        <Link to="/shipping-policy" className="link">Delivery details</Link>
                      </>
                    ),
                  },
                  {
                    title: "Returns & cancellation",
                    content: (
                      <>
                        Cancel free of charge before your order ships. Report any damage within {SITE.returnWindowDays} days of delivery and we&apos;ll repair or replace it. Custom-made pieces can&apos;t be returned.{" "}
                        <Link to="/return-policy" className="link">Return policy</Link>
                      </>
                    ),
                  },
                  {
                    title: "Warranty",
                    content: (
                      <>
                        {product.warranty || SITE.warrantyText}. <Link to="/warranty" className="link">Warranty terms</Link>
                      </>
                    ),
                  },
                  {
                    title: "Care",
                    content: (
                      <>
                        Dust weekly with a dry cloth, keep out of direct sunlight and away from damp walls, and blot spills immediately.{" "}
                        <Link to="/care-guide" className="link">Full care guide</Link>
                      </>
                    ),
                  },
                ]}
              />
            </div>

            <div className="card mt-8 p-6">
              <h3 className="text-2xl font-semibold">Questions about this piece?</h3>
              <p className="mb-4 mt-1 text-sm text-stone-600">Ask about colours, sizes or delivery — we usually reply within a few hours.</p>
              <LeadForm type="product" product={product} fields={["message"]} compact submitLabel="Ask a question" messagePlaceholder="e.g. Is this available in grey? Can you make it 6 ft?" />
            </div>
          </div>
        </div>

        <section id="reviews" className="mt-16 scroll-mt-40 border-t border-cream-300 pt-12">
          <h2 className="text-3xl font-semibold">Customer reviews</h2>
          <div className="mt-6 grid gap-10 lg:grid-cols-[320px_1fr]">
            <div>
              {reviews.length > 0 ? (
                <>
                  <p className="flex items-center gap-3">
                    <span className="font-display text-5xl font-semibold text-stone-900">{avgRating}</span>
                    <span>
                      <Stars value={avgRating} />
                      <span className="block text-sm text-stone-600">{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
                    </span>
                  </p>
                  <div className="mt-4">
                    <RatingBreakdown reviews={reviews} />
                  </div>
                </>
              ) : (
                <p className="text-stone-600">No reviews yet. Bought this piece? Be the first to review it.</p>
              )}

              {token ? (
                <form onSubmit={submitReview} className="mt-6 space-y-3">
                  <p className="font-medium text-stone-900">Write a review</p>
                  <fieldset>
                    <legend className="label">Your rating</legend>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewRating(n)}
                          className={n <= reviewRating ? "text-gold-600" : "text-cream-400"}
                          aria-label={`${n} star${n > 1 ? "s" : ""}`}
                          aria-pressed={n === reviewRating}
                        >
                          <Icon name="star" className="h-7 w-7" filled strokeWidth={1} />
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label className="label" htmlFor="review-comment">Your review</label>
                  <textarea id="review-comment" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={4} maxLength={2000} className="input" placeholder="How is the comfort, finish and delivery?" />
                  <button type="submit" disabled={reviewSubmitting} className="btn-primary">
                    {reviewSubmitting ? "Submitting…" : "Submit review"}
                  </button>
                </form>
              ) : (
                <Link to="/login" className="btn-outline mt-6">Log in to write a review</Link>
              )}
            </div>

            <ul className="divide-y divide-cream-300">
              {reviews.map((r) => (
                <li key={r._id} className="py-5 first:pt-0">
                  <div className="flex items-center gap-3">
                    <Stars value={r.rating} />
                    <span className="text-sm font-medium text-stone-900">{r.userName}</span>
                    <span className="text-xs text-stone-500">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-stone-700">{r.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {(related === null || related.length > 0) && (
        <section className="section container-site">
          <SectionHeading title={`More ${product.subCategory.toLowerCase()}`} link={`/collection?subCategory=${encodeURIComponent(product.subCategory)}`} />
          <ProductRail products={related || []} loading={related === null} label={`More ${product.subCategory}`} />
        </section>
      )}

      {recent.length > 0 && (
        <section className="container-site pb-12">
          <SectionHeading title="Recently viewed" />
          <ProductRail products={recent} label="Recently viewed" />
        </section>
      )}

      {/* Sticky buy bar on phones */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-cream-300 bg-white p-3 lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-stone-500">{product.name}</p>
          <p className="font-semibold text-stone-900">{formatPrice(product.price)}</p>
        </div>
        <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-md bg-[#1f8f4e] text-white" aria-label="Ask on WhatsApp">
          <WhatsAppIcon className="h-5 w-5" />
        </a>
        <button type="button" onClick={addItem} disabled={!canBuy} className="btn-primary h-11 px-5">
          {canBuy ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </div>
  );
};

export default Product;
