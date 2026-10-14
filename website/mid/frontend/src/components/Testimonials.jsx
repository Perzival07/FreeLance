import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { SITE } from "../config/site";
import { productUrl } from "../utils/format";
import SectionHeading from "./SectionHeading";
import Stars from "./Stars";

// Real reviews left by customers on product pages — nothing is shown if there are none yet
const Testimonials = () => {
  const { backendUrl } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/review/latest?limit=6`)
      .then(({ data }) => data.success && setReviews(data.reviews))
      .catch(() => {});
  }, [backendUrl]);

  return (
    <section className="section bg-white">
      <div className="container-site">
        <SectionHeading eyebrow="Customer reviews" title="What our customers say" />
        {SITE.googleRating && (
          <p className="-mt-4 mb-8 flex items-center gap-2 text-sm text-stone-700">
            <Stars value={SITE.googleRating.value} /> <strong>{SITE.googleRating.value}</strong> on Google · {SITE.googleRating.count} reviews
          </p>
        )}

        {reviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r._id} className="card flex flex-col p-6">
                <Stars value={r.rating} />
                <blockquote className="mt-3 flex-1 text-stone-700">“{r.comment}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-medium text-stone-900">{r.userName}</span>
                  {r.product && (
                    <>
                      {" "}on{" "}
                      <Link to={productUrl(r.product)} className="link">
                        {r.product.name}
                      </Link>
                    </>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-stone-700">Bought from us? We&apos;d love to hear how your furniture is doing.</p>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Read & write reviews on Google
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
