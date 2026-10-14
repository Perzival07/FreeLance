import { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";
import Icon from "../components/Icons";
import Breadcrumbs from "../components/Breadcrumbs";
import useSeo from "../hooks/useSeo";
import { formatPrice, imageUrl, productUrl } from "../utils/format";
import { SITE } from "../config/site";

const formatDimKey = (key) => {
  const [l, b, h] = String(key).split("x").map(Number);
  return [l, b, h].every(Number.isFinite) ? `${Math.round(l)} × ${Math.round(b)} × ${Math.round(h)} cm` : "";
};

const Cart = () => {
  const { productCache, cartItems, updateQuantity, navigate, token } = useContext(ShopContext);
  useSeo({ title: "Your cart" });

  const lines = [];
  for (const id in cartItems) {
    for (const dims in cartItems[id]) {
      if (cartItems[id][dims] > 0) lines.push({ id, dims, quantity: cartItems[id][dims], product: productCache[id] });
    }
  }

  if (lines.length === 0) {
    return (
      <div className="container-site py-20 text-center">
        <Icon name="bag" className="mx-auto h-12 w-12 text-stone-400" />
        <h1 className="mt-4 text-4xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-stone-600">Find something you&apos;ll love sitting on for years.</p>
        <Link to="/collection" className="btn-primary mt-6">Browse furniture</Link>
      </div>
    );
  }

  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="text-4xl font-semibold">Your cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-cream-300 border-y border-cream-300">
          {lines.map(({ id, dims, quantity, product }) => (
            <li key={`${id}-${dims}`} className="flex gap-4 py-5">
              {product ? (
                <>
                  <Link to={productUrl(product)} className="shrink-0">
                    <img src={imageUrl(product.image[0], 240)} alt={product.name} className="h-24 w-32 rounded-md object-cover sm:h-28 sm:w-36" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <Link to={productUrl(product)} className="font-medium text-stone-900 hover:text-gold-800">{product.name}</Link>
                        <p className="mt-0.5 text-sm text-stone-500">{formatDimKey(dims)}</p>
                      </div>
                      <p className="shrink-0 font-semibold text-stone-900">{formatPrice(product.price * quantity)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-md border border-stone-300">
                        <button type="button" onClick={() => updateQuantity(id, dims, quantity - 1)} disabled={quantity <= 1} className="px-3 py-1.5 disabled:opacity-30" aria-label="Decrease quantity">
                          <Icon name="minus" className="h-4 w-4" />
                        </button>
                        <span className="min-w-[2ch] text-center text-sm" aria-live="polite">{quantity}</span>
                        <button type="button" onClick={() => updateQuantity(id, dims, quantity + 1)} disabled={quantity >= 99} className="px-3 py-1.5 disabled:opacity-30" aria-label="Increase quantity">
                          <Icon name="plus" className="h-4 w-4" />
                        </button>
                      </div>
                      <button type="button" onClick={() => updateQuantity(id, dims, 0)} className="flex items-center gap-1 text-sm text-stone-500 hover:text-red-700">
                        <Icon name="trash" className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex w-full items-center justify-between text-sm text-stone-500">
                  <span>Loading item…</span>
                  <button type="button" onClick={() => updateQuantity(id, dims, 0)} className="hover:text-red-700">Remove</button>
                </div>
              )}
            </li>
          ))}
        </ul>

        <aside className="space-y-4">
          <CartTotal />
          <button type="button" onClick={() => navigate(token ? "/place-order" : "/login?next=/place-order")} className="btn-primary w-full py-3.5">
            Proceed to checkout
          </button>
          {!token && <p className="text-center text-xs text-stone-500">You&apos;ll be asked to log in or create an account.</p>}
          <ul className="space-y-2 pt-2 text-sm text-stone-600">
            <li className="flex gap-2"><Icon name="shield" className="h-4 w-4 text-gold-800" /> Secure checkout · Cash on delivery available</li>
            <li className="flex gap-2"><Icon name="truck" className="h-4 w-4 text-gold-800" /> {SITE.deliveryText}</li>
            <li className="flex gap-2"><Icon name="phone" className="h-4 w-4 text-gold-800" /> Need help? <a href={SITE.phoneHref} className="link">{SITE.phone}</a></li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
