import { useContext } from "react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import { formatPrice } from "../utils/format";

const CartTotal = ({ deliveryFee }) => {
  const { getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const known = deliveryFee !== undefined && deliveryFee !== null;
  const fee = known ? deliveryFee : 0;

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-semibold">Order summary</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone-600">Subtotal</dt>
          <dd className="text-stone-900">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone-600">Delivery & installation</dt>
          <dd className="text-stone-900">{known ? (fee > 0 ? formatPrice(fee) : "Enter distance") : "Calculated at checkout"}</dd>
        </div>
        <div className="flex justify-between border-t border-cream-300 pt-3 text-base">
          <dt className="font-semibold text-stone-900">Total</dt>
          <dd className="font-semibold text-stone-900">{formatPrice(subtotal === 0 ? 0 : subtotal + fee)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-stone-500">Prices include all taxes.</p>
    </div>
  );
};

CartTotal.propTypes = { deliveryFee: PropTypes.number };

export default CartTotal;
