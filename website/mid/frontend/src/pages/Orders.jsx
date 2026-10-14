import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import Breadcrumbs from "../components/Breadcrumbs";
import OrderProgress from "../components/OrderProgress";
import useSeo from "../hooks/useSeo";
import { formatPrice, imageUrl } from "../utils/format";
import { SITE, whatsappLink } from "../config/site";

const formatOrderDate = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const canCancel = (status) => status === "Order Placed" || status === "Packing";

const Orders = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [orders, setOrders] = useState(null);
  useSeo({ title: "My orders" });

  const loadOrderData = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.post(`${backendUrl}/order/userorders`, {}, { headers: { token } });
      setOrders(data.success ? [...(data.orders || [])].reverse() : []);
    } catch (error) {
      console.error("Error loading order data:", error);
      setOrders([]);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const { data } = await axios.post(`${backendUrl}/order/cancel`, { orderId }, { headers: { token } });
      if (data.success) {
        toast.success(data.message || "Order cancelled");
        loadOrderData();
      } else {
        toast.error(data.message || "Could not cancel order");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (!token) {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="text-4xl font-semibold">My orders</h1>
        <p className="mt-2 text-stone-600">Log in to see your orders, or track one with your order ID.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login" className="btn-primary">Log in</Link>
          <Link to="/track-order" className="btn-outline">Track an order</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ label: "My orders" }]} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold">My orders</h1>
        <button type="button" onClick={loadOrderData} className="btn-outline py-2">Refresh</button>
      </div>

      {orders === null ? (
        <div className="mt-8 h-40 animate-pulse rounded-lg bg-cream-300" />
      ) : orders.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-stone-700">You haven&apos;t placed any orders yet.</p>
          <Link to="/collection" className="btn-primary mt-5">Start shopping</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <article key={order._id} className="card overflow-hidden">
              <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-cream-300 bg-cream-50 px-5 py-4 text-sm">
                <div>
                  <p className="text-stone-500">Order</p>
                  <p className="font-medium text-stone-900">#{String(order._id).slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-stone-500">Placed</p>
                  <p className="text-stone-900">{formatOrderDate(order.date)}</p>
                </div>
                <div>
                  <p className="text-stone-500">Payment</p>
                  <p className="text-stone-900">{order.paymentMethod} · {order.payment ? "Paid" : "Pending"}</p>
                </div>
                <div>
                  <p className="text-stone-500">Total</p>
                  <p className="font-semibold text-stone-900">{formatPrice(order.amount)}</p>
                </div>
              </header>

              <div className="px-5 py-6">
                <OrderProgress status={order.status} />
              </div>

              <ul className="divide-y divide-cream-300 border-t border-cream-300 px-5">
                {order.items.map((item, idx) => (
                  <li key={`${order._id}-${idx}`} className="flex items-center gap-4 py-4">
                    <img loading="lazy" src={imageUrl(item.image?.[0], 160)} alt="" className="h-16 w-20 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-stone-900">{item.name}</p>
                      <p className="text-sm text-stone-500">
                        Qty {item.quantity} · {formatPrice(item.price)} each
                        {item.dimensions ? ` · ${item.dimensions.split("x").map((n) => Math.round(Number(n))).join(" × ")} cm` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-300 px-5 py-4">
                <a href={whatsappLink(`Hi, I have a question about my order #${String(order._id).slice(-8).toUpperCase()}.`)} target="_blank" rel="noopener noreferrer" className="text-sm text-stone-700 hover:text-stone-900">
                  Need help? WhatsApp us or call {SITE.phone}
                </a>
                {canCancel(order.status) && (
                  <button type="button" onClick={() => handleCancelOrder(order._id)} className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                    Cancel order
                  </button>
                )}
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
