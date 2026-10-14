import { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Breadcrumbs from "../components/Breadcrumbs";
import Icon from "../components/Icons";
import useSeo from "../hooks/useSeo";
import { formatPrice, imageUrl, productUrl } from "../utils/format";

const Wishlist = () => {
  const { wishlist, token, addToCart, removeFromWishlist } = useContext(ShopContext);
  useSeo({ title: "Wishlist" });

  if (!token) {
    return (
      <div className="container-site py-20 text-center">
        <Icon name="heart" className="mx-auto h-12 w-12 text-stone-400" />
        <h1 className="mt-4 text-4xl font-semibold">Your wishlist</h1>
        <p className="mt-2 text-stone-600">Log in to save furniture and come back to it later.</p>
        <Link to="/login" className="btn-primary mt-6">Log in</Link>
      </div>
    );
  }

  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <h1 className="text-4xl font-semibold">Your wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-stone-700">Nothing saved yet. Tap the heart on any product to save it here.</p>
          <Link to="/collection" className="btn-primary mt-5">Browse furniture</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((item, index) => {
            const p = item.product;
            if (!p) {
              return (
                <div key={`${item.productId}-${index}`} className="card flex flex-col justify-between p-4 text-sm text-stone-600">
                  <p>This product is no longer available.</p>
                  <button type="button" onClick={() => removeFromWishlist(item.productId, item.dimensions)} className="mt-3 w-fit text-red-700 underline">
                    Remove
                  </button>
                </div>
              );
            }
            return (
              <article key={`${item.productId}-${item.dimensions}-${index}`} className="flex flex-col">
                <Link to={productUrl(p)} className="block overflow-hidden rounded-lg bg-cream-200">
                  <img src={imageUrl(p.image?.[0], 600)} alt={p.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </Link>
                <Link to={productUrl(p)} className="mt-3 line-clamp-2 text-[15px] text-stone-900 hover:text-gold-800">{p.name}</Link>
                <p className="mt-1 font-semibold text-stone-900">{formatPrice(p.price)}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => addToCart(p._id, item.dimensions)} className="btn-primary flex-1 px-3 py-2">
                    Add to cart
                  </button>
                  <button type="button" onClick={() => removeFromWishlist(item.productId, item.dimensions)} className="btn-outline px-3 py-2" aria-label={`Remove ${p.name} from wishlist`}>
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
