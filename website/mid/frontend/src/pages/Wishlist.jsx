import { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProducItem from "../components/ProducItem";
import { assets } from "../assets/assets";

const Wishlist = () => {
  const {
    wishlist,
    token,
    addToCart,
    removeFromWishlist,
  } = useContext(ShopContext);

  if (!token) {
    return (
      <div className="border-t hairline-gold pt-16 text-center py-20">
        <p className="text-ivory-300 mb-4">
          Log in to view and manage your wishlist.
        </p>
        <Link
          to="/login"
          className="btn-gold"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="border-t hairline-gold pt-16 text-center py-20">
        <div className="text-2xl mb-6">
          <Title text1={"MY"} text2={"WISHLIST"} />
        </div>
        <p className="text-ivory-400">Your wishlist is empty.</p>
        <Link
          to="/collection"
          className="btn-gold mt-6"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="border-t hairline-gold pt-16">
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"WISHLIST"} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8">
        {wishlist.map((item, index) => (
          <div
            key={`${String(item.productId)}-${item.dimensions}-${index}`}
            className="relative"
          >
            {item.product ? (
              <>
                <ProducItem
                  id={String(item.product._id)}
                  name={item.product.name}
                  image={item.product.image}
                  price={item.product.price}
                  dimensions={item.dimensions}
                  showWishlistToggle={false}
                />
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button
                    type="button"
                    title="Add to cart"
                    onClick={() =>
                      addToCart(item.product._id, item.dimensions)
                    }
                    className="bg-ink-900/90 rounded-full p-1.5 shadow-md border border-gold-500/25 hover:bg-gold-500 hover:border-gold-500 transition-colors group"
                  >
                    <img
                      src={assets.cart_icon}
                      alt=""
                      className="icon-luxury w-4 h-4 group-hover:[filter:none]"
                    />
                  </button>
                  <button
                    type="button"
                    title="Remove from wishlist"
                    onClick={() =>
                      removeFromWishlist(item.productId, item.dimensions)
                    }
                    className="bg-ink-900/90 rounded-full p-1.5 shadow-md border border-gold-500/25 hover:bg-red-500 hover:border-red-500 transition-colors group"
                  >
                    <img
                      src={assets.cross_icon}
                      alt=""
                      className="icon-luxury w-4 h-4"
                    />
                  </button>
                </div>
              </>
            ) : (
              <div className="card-luxury rounded-sm p-4 text-sm text-ivory-300 flex flex-col gap-3 min-h-[200px]">
                <p>This product is no longer available.</p>
                <button
                  type="button"
                  onClick={() =>
                    removeFromWishlist(item.productId, item.dimensions)
                  }
                  className="text-red-400 border border-red-500/60 px-3 py-1.5 rounded-sm text-xs hover:bg-red-500 hover:text-white transition-colors w-fit"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
