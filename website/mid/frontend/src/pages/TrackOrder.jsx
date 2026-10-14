import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import PageHeader from "../components/PageHeader";
import OrderProgress from "../components/OrderProgress";
import useSeo from "../hooks/useSeo";
import { formatPrice, imageUrl } from "../utils/format";

const TrackOrder = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState({ status: "idle", order: null, message: "" });

  useSeo({ title: "Track Your Order", description: "Check the status of your furniture order with your order ID and phone number." });

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ status: "loading", order: null, message: "" });
    try {
      const { data } = await axios.post(`${backendUrl}/order/track`, { orderId, phone });
      if (data.success) setState({ status: "done", order: data.order, message: "" });
      else setState({ status: "error", order: null, message: data.message });
    } catch (err) {
      setState({ status: "error", order: null, message: err.response?.data?.message || "Could not look up the order." });
    }
  };

  const order = state.order;

  return (
    <>
      <PageHeader title="Track your order" subtitle="Enter the order ID from your confirmation email and the phone number you used at checkout." crumbs={[{ label: "Track order" }]} />
      <div className="container-site grid gap-10 py-10 lg:grid-cols-[1fr_1.4fr]">
        <form onSubmit={onSubmit} className="card h-fit space-y-4 p-6">
          <div>
            <label htmlFor="track-id" className="label">Order ID</label>
            <input id="track-id" className="input" required value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="e.g. 9F3A21BC" autoComplete="off" />
          </div>
          <div>
            <label htmlFor="track-phone" className="label">Phone number</label>
            <input id="track-phone" className="input" type="tel" inputMode="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" autoComplete="tel" />
          </div>
          {state.status === "error" && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.message}</p>}
          <button type="submit" className="btn-primary w-full" disabled={state.status === "loading"}>
            {state.status === "loading" ? "Checking…" : "Track order"}
          </button>
          {token && (
            <p className="text-center text-sm text-stone-600">
              Logged in? See all your orders in <Link to="/orders" className="link">My orders</Link>.
            </p>
          )}
        </form>

        <div aria-live="polite">
          {order ? (
            <div className="card p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h2>
                <p className="text-sm text-stone-600">Placed {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div className="mt-6">
                <OrderProgress status={order.status} />
              </div>
              <ul className="mt-6 divide-y divide-cream-300 border-y border-cream-300">
                {order.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-3 py-3">
                    {it.image && <img src={imageUrl(it.image, 120)} alt="" className="h-14 w-16 rounded object-cover" />}
                    <span className="flex-1 text-sm text-stone-800">{it.name}</span>
                    <span className="text-sm text-stone-500">× {it.quantity}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex justify-between text-sm">
                <span className="text-stone-600">{order.paymentMethod} · {order.payment ? "Paid" : "Payment pending"}</span>
                <span className="font-semibold text-stone-900">{formatPrice(order.amount)}</span>
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-cream-400 p-8 text-center text-stone-500">
              Your order status will appear here.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrackOrder;
