import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Reviews = ({ token }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/review/admin/list`, {}, { headers: { token } });
      if (data.success) setReviews(data.reviews);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleHidden = async (r) => {
    const hidden = !r.hidden;
    setReviews((prev) => prev.map((x) => (x._id === r._id ? { ...x, hidden } : x)));
    try {
      const { data } = await axios.post(`${backendUrl}/api/review/admin/hide`, { id: r._id, hidden }, { headers: { token } });
      if (data.success) toast.success(data.message);
      else {
        toast.error(data.message);
        load();
      }
    } catch (err) {
      toast.error(err.message);
      load();
    }
  };

  const remove = async (r) => {
    if (!window.confirm(`Delete this review by ${r.userName}? This can't be undone.`)) return;
    try {
      const { data } = await axios.post(`${backendUrl}/api/review/admin/remove`, { id: r._id }, { headers: { token } });
      if (data.success) setReviews((prev) => prev.filter((x) => x._id !== r._id));
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const list = reviews.filter((r) => show === "all" || (show === "hidden" ? r.hidden : !r.hidden));

  return (
    <>
      <p className="eyebrow-gold text-xs mb-1">MODERATION</p>
      <h2 className="font-display text-3xl text-stone-900 mb-2">Reviews</h2>
      <p className="mb-6 text-sm text-stone-500">Hidden reviews stay saved but don&apos;t appear on the website. Good reviews (4–5 stars) also show on the homepage.</p>

      <div className="mb-6 flex flex-wrap gap-3">
        <select value={show} onChange={(e) => setShow(e.target.value)} className="px-3 py-2 rounded-md">
          <option value="all">All reviews ({reviews.length})</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
        <button type="button" onClick={load} className="btn-gold-outline rounded-md">Refresh</button>
      </div>

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : list.length === 0 ? (
        <div className="card-luxury rounded p-8 text-center text-stone-500">No reviews yet.</div>
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <div key={r._id} className={`card-luxury rounded p-4 ${r.hidden ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  {r.product?.image?.[0] && <img src={r.product.image[0]} alt="" className="h-14 w-14 shrink-0 rounded object-cover" />}
                  <div className="min-w-0">
                    <p className="text-sm text-stone-500">{r.product?.name || "Deleted product"}</p>
                    <p className="mt-0.5 text-stone-900">
                      <span className="text-gold-700">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>{" "}
                      <span className="font-medium">{r.userName}</span>
                      {r.verified && <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800">Verified buyer</span>}
                      {r.hidden && <span className="ml-2 rounded bg-cream-200 px-1.5 py-0.5 text-xs text-stone-700">Hidden</span>}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">{r.comment}</p>
                    {r.images?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {r.images.map((src) => (
                          <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                            <img src={src} alt="Review photo" className="h-16 w-16 rounded border border-cream-300 object-cover" />
                          </a>
                        ))}
                      </div>
                    )}
                    <p className="mt-2 text-xs text-stone-400">{new Date(r.createdAt).toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => toggleHidden(r)} className="btn-gold-outline rounded-md px-3 py-1.5">
                    {r.hidden ? "Show" : "Hide"}
                  </button>
                  <button type="button" onClick={() => remove(r)} className="px-2 text-lg text-stone-500 hover:text-red-700" aria-label="Delete review">×</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Reviews;
