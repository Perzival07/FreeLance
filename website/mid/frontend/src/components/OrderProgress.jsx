import PropTypes from "prop-types";
import Icon from "./Icons";
import { ORDER_STEPS } from "../config/site";

// Placed → Packing → Shipped → Out for delivery → Delivered
const OrderProgress = ({ status }) => {
  if (status === "Cancelled") {
    return <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">This order was cancelled.</p>;
  }
  const current = Math.max(0, ORDER_STEPS.indexOf(status));
  return (
    <ol className="flex items-start" aria-label={`Order status: ${status}`}>
      {ORDER_STEPS.map((step, i) => {
        const done = i <= current;
        return (
          <li key={step} className="relative flex flex-1 flex-col items-center text-center">
            {i > 0 && <span className={`absolute right-1/2 top-3.5 h-0.5 w-full ${i <= current ? "bg-green-600" : "bg-cream-300"}`} aria-hidden="true" />}
            <span className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full ${done ? "bg-green-600 text-white" : "border-2 border-cream-300 bg-white"}`}>
              {done && <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />}
            </span>
            <span className={`mt-2 text-[11px] leading-tight sm:text-xs ${i === current ? "font-semibold text-stone-900" : "text-stone-500"}`}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
};

OrderProgress.propTypes = { status: PropTypes.string.isRequired };

export default OrderProgress;
