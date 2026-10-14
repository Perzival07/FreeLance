import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/order/stats`,
          {},
          { headers: { token } }
        );
        if (!cancelled && data.success) {
          setStats(data.stats);
        }
      } catch (e) {
        console.log(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return <p className="text-ivory-400">Loading dashboard…</p>;
  }

  if (!stats) {
    return <p className="text-ivory-400">Could not load statistics.</p>;
  }

  return (
    <div>
      <p className="eyebrow-gold text-xs mb-1">OVERVIEW</p>
      <h2 className="font-display text-3xl text-ivory-50 mb-8">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
        <div className="card-luxury p-6 rounded hover:border-gold-400/50 hover:shadow-gold transition-all">
          <p className="eyebrow-gold text-xs">TOTAL ORDERS</p>
          <p className="font-display text-4xl text-gold-gradient font-semibold mt-2">{stats.totalOrders}</p>
        </div>
        <div className="card-luxury p-6 rounded hover:border-gold-400/50 hover:shadow-gold transition-all">
          <p className="eyebrow-gold text-xs">TOTAL SALES</p>
          <p className="font-display text-4xl text-gold-gradient font-semibold mt-2">
            {currency}
            {Number(stats.totalSales || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-display text-xl text-ivory-100 mb-3">Orders by status</h3>
          <ul className="card-luxury rounded divide-y divide-gold-500/10">
            {(stats.ordersByStatus || []).map((row) => (
              <li
                key={row._id || "unknown"}
                className="flex justify-between px-4 py-3 text-sm text-ivory-300"
              >
                <span>{row._id || "—"}</span>
                <span className="font-medium text-gold-300">{row.count}</span>
              </li>
            ))}
            {(!stats.ordersByStatus || stats.ordersByStatus.length === 0) && (
              <li className="px-4 py-3 text-sm text-ivory-400">No order data</li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xl text-ivory-100 mb-3">Recent orders</h3>
          <ul className="card-luxury rounded divide-y divide-gold-500/10 text-sm">
            {(stats.recentOrders || []).map((o) => (
              <li key={o._id} className="px-4 py-3 flex flex-col gap-0.5">
                <span className="font-medium text-ivory-100">
                  {currency}
                  {o.amount} · {o.status}
                </span>
                <span className="text-ivory-500 text-xs">{String(o.date)}</span>
              </li>
            ))}
            {(!stats.recentOrders || stats.recentOrders.length === 0) && (
              <li className="px-4 py-3 text-ivory-400">No recent orders</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
