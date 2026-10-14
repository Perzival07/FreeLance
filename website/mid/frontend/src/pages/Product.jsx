import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "./../components/RelatedProducts";
import { formatDimensions } from "../utils/dimensionsConverter";

const Product = () => {
  const { productId } = useParams();
  const {
    products,
    currency,
    addToCart,
    fetchProductById,
    token,
    toggleWishlist,
    isWishlisted,
    backendUrl,
    navigate,
  } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    setProductData(null);
    setImage("");
    setLoading(true);
  }, [productId]);

  useEffect(() => {
    let cancelled = false;

    const applyProduct = (item) => {
      setProductData(item);
      setImage(item.image[0]);
    };

    const load = async () => {
      const found = products.find(
        (item) => String(item._id) === String(productId)
      );
      if (found) {
        if (!cancelled) {
          applyProduct(found);
          setLoading(false);
        }
        return;
      }
      const p = await fetchProductById(productId);
      if (cancelled) return;
      if (p) {
        applyProduct(p);
      } else {
        setProductData(null);
      }
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [productId, products, fetchProductById]);

  useEffect(() => {
    let cancelled = false;
    const loadReviews = async () => {
      if (!productId) return;
      try {
        const { data } = await axios.get(
          `${backendUrl}/review/product/${productId}`
        );
        if (cancelled) return;
        if (data.success) {
          setReviews(data.reviews || []);
          setAvgRating(data.avgRating ?? 0);
          setReviewTotal(data.total ?? 0);
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [productId, backendUrl]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please log in to leave a review");
      navigate("/login");
      return;
    }
    const text = reviewComment.trim();
    if (text.length < 3) {
      toast.error("Please write a short comment (at least 3 characters)");
      return;
    }
    setReviewSubmitting(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/review/add`,
        {
          productId,
          rating: reviewRating,
          comment: text,
        },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        setReviewComment("");
        const r = await axios.get(
          `${backendUrl}/review/product/${productId}`
        );
        if (r.data.success) {
          setReviews(r.data.reviews || []);
          setAvgRating(r.data.avgRating ?? 0);
          setReviewTotal(r.data.total ?? 0);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] border-t-2 hairline-gold pt-10">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"
          aria-label="Loading product"
        />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="border-t-2 hairline-gold pt-10 text-center py-20 min-h-[50vh]">
        <p className="text-ivory-400 text-lg">Product not found</p>
      </div>
    );
  }

  const dimKey = productData.dimensions
    ? `${productData.dimensions.length}x${productData.dimensions.breadth}x${productData.dimensions.height}`
    : "";

  return (
    <div className="border-t-2 hairline-gold pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                loading="lazy"
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border transition-colors ${
                  image === item ? "border-gold-400" : "border-gold-500/15 hover:border-gold-500/40"
                }`}
                alt="product_image"
              />
            ))}
          </div>

          <div className="w-4 sm:w-[80%]">
            <img
              loading="lazy"
              src={image}
              className="w-full h-auto card-luxury p-2"
              alt="product_img"
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-display text-3xl text-ivory-50 tracking-wide">{productData.name}</h1>

          <p className="mt-5 text-3xl font-display text-gold-gradient font-semibold">
            {currency}
            {productData.price}
          </p>
          <p className="mt-2 text-sm">
            {(productData.stock ?? 0) > 0 ? (
              <span className="text-green-400">
                In stock ({productData.stock} available)
              </span>
            ) : (
              <span className="text-red-400">Out of stock</span>
            )}
          </p>
          <p className="mt-5 text-ivory-400 md:w-4/5">
            {productData.description}
          </p>
          {productData.dimensions && (() => {
            const formatted = formatDimensions(productData.dimensions);
            return (
              <div className="flex flex-col gap-4 my-8">
                <p className="eyebrow-gold text-xs">Dimensions</p>

                <div className="flex flex-col gap-2 text-ivory-200">
                  <div className="border-l-2 border-gold-500 pl-3">
                    <p className="text-xs text-ivory-400 mb-1">Metric System</p>
                    <p>
                      Length:{" "}
                      <span className="font-semibold">
                        {formatted.length.displayCm}
                      </span>{" "}
                      ({formatted.length.displayMeters})
                    </p>
                    <p>
                      Breadth:{" "}
                      <span className="font-semibold">
                        {formatted.breadth.displayCm}
                      </span>{" "}
                      ({formatted.breadth.displayMeters})
                    </p>
                    <p>
                      Height:{" "}
                      <span className="font-semibold">
                        {formatted.height.displayCm}
                      </span>{" "}
                      ({formatted.height.displayMeters})
                    </p>
                  </div>

                  <div className="border-l-2 border-gold-500 pl-3 mt-2">
                    <p className="text-xs text-ivory-400 mb-1">Imperial System</p>
                    <p>
                      Length:{" "}
                      <span className="font-semibold">
                        {formatted.length.displayFeetInches}
                      </span>
                    </p>
                    <p>
                      Breadth:{" "}
                      <span className="font-semibold">
                        {formatted.breadth.displayFeetInches}
                      </span>
                    </p>
                    <p>
                      Height:{" "}
                      <span className="font-semibold">
                        {formatted.height.displayFeetInches}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-sm text-ivory-400">
                  {formatted.length.displayCm} × {formatted.breadth.displayCm} ×{" "}
                  {formatted.height.displayCm}
                  <span className="ml-2">
                    ({formatted.length.displayFeetInches} ×{" "}
                    {formatted.breadth.displayFeetInches} ×{" "}
                    {formatted.height.displayFeetInches})
                  </span>
                </p>
              </div>
            );
          })()}

          <div className="flex flex-wrap gap-3 mt-2">
            <button
              type="button"
              onClick={() => {
                if (productData.dimensions && (productData.stock ?? 0) > 0) {
                  addToCart(productData._id, dimKey);
                }
              }}
              disabled={(productData.stock ?? 0) <= 0}
              className={
                (productData.stock ?? 0) <= 0
                  ? "px-8 py-3 text-sm tracking-widest uppercase font-semibold bg-ink-700 text-ivory-500 cursor-not-allowed opacity-70"
                  : "btn-gold"
              }
            >
              {(productData.stock ?? 0) <= 0 ? "Out of stock" : "Add to cart"}
            </button>
            {productData.dimensions ? (
              <button
                type="button"
                onClick={() => toggleWishlist(productData._id, dimKey)}
                className={
                  isWishlisted(productData._id, dimKey)
                    ? "px-8 py-3 text-sm tracking-widest uppercase font-semibold border border-gold-500 bg-gold-500 text-ink-900 transition-colors"
                    : "px-8 py-3 text-sm tracking-widest uppercase font-semibold border border-gold-500/40 text-ivory-100 hover:border-gold-400 hover:bg-gold-500/10 transition-colors"
                }
              >
                {!token
                  ? "Save (login)"
                  : isWishlisted(productData._id, dimKey)
                  ? "Saved"
                  : "Add to wishlist"}
              </button>
            ) : null}
          </div>

          <div className="mt-8 sm:w-4/5 divider-gold" />

          <div className="text-sm text-ivory-400 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
          </div>
        </div>
      </div>

      <section className="mt-16 border-t hairline-gold pt-10 max-w-3xl">
        <h2 className="font-display text-2xl text-gold-gradient mb-2">Reviews</h2>
        <p className="text-sm text-ivory-300 mb-6">
          {reviewTotal === 0
            ? "No reviews yet. Be the first to rate this product."
            : `${reviewTotal} review(s) · Average ${avgRating} / 5`}
        </p>

        <form
          onSubmit={submitReview}
          className="mb-10 flex flex-col gap-3 card-luxury p-5"
        >
          <p className="text-sm font-medium text-ivory-100 eyebrow-gold">Write a review</p>
          <label className="text-sm text-ivory-200">
            Rating
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="ml-2 border border-gold-500/25 bg-ink-950 text-ivory-100 px-2 py-1 text-sm outline-none focus:border-gold-400 transition-colors"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </select>
          </label>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={3}
            className="w-full border border-gold-500/25 bg-ink-950 text-ivory-100 px-3 py-2 text-sm outline-none focus:border-gold-400 transition-colors"
            placeholder="Share your experience with this product"
          />
          <button
            type="submit"
            disabled={reviewSubmitting}
            className="btn-gold self-start disabled:opacity-50"
          >
            {reviewSubmitting ? "Submitting…" : "Submit review"}
          </button>
        </form>

        <ul className="flex flex-col gap-6">
          {reviews.map((r) => (
            <li
              key={r._id}
              className="border-b border-gold-500/10 pb-4 last:border-0"
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-ivory-100">{r.userName}</span>
                <span className="text-gold-400">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
              </div>
              <p className="text-sm text-ivory-300 mt-2 whitespace-pre-wrap">
                {r.comment}
              </p>
              <p className="text-xs text-ivory-500 mt-1">
                {r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
