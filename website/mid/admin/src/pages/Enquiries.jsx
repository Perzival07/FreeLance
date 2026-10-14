import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const TYPES = {
  "": "All enquiries",
  visit: "Showroom visits",
  custom: "Custom furniture",
  callback: "Call-backs",
  product: "Product questions",
  bulk: "Bulk orders",
  newsletter: "Newsletter",
};
const STATUSES = ["New", "Contacted", "Converted", "Closed"];

const STATUS_STYLE = {
  New: "bg-gold-500 text-stone-900",
  Contacted: "bg-sky-100 text-sky-800",
  Converted: "bg-green-100 text-green-700",
  Closed: "bg-cream-200 text-stone-500",
};

const waLink = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  const intl = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${intl}`;
};

const Enquiries = ({ token }) => {
  const [leads, setLeads] = useState([]);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/lead/list`, { type, status }, { headers: { token } });
      if (data.success) setLeads(data.leads);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [type, status, token]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id, next) => {
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status: next } : l)));
    try {
      const { data } = await axios.post(`${backendUrl}/api/lead/status`, { id, status: next }, { headers: { token } });
      if (!data.success) toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
      load();
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      const { data } = await axios.post(`${backendUrl}/api/lead/remove`, { id }, { headers: { token } });
      if (data.success) setLeads((prev) => prev.filter((l) => l._id !== id));
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const exportCsv = () => {
    const cols = ["createdAt", "type", "status", "name", "phone", "email", "productName", "preferredDate", "preferredTime", "budget", "message"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...leads.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <p className="eyebrow-gold text-xs mb-1">INBOX</p>
      <h2 className="font-display text-3xl text-stone-900 mb-4">Enquiries</h2>
      <p className="mb-6 text-sm text-stone-500">Showroom bookings, custom-order requests, call-backs, product questions and newsletter sign-ups from the website.</p>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-md">
          {Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-md">
          <option value="">Any status</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button type="button" onClick={load} className="btn-gold-outline rounded-md">Refresh</button>
        <button type="button" onClick={exportCsv} disabled={!leads.length} className="btn-gold-outline rounded-md disabled:opacity-40">Export CSV</button>
      </div>

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : leads.length === 0 ? (
        <div className="card-luxury rounded p-8 text-center text-stone-500">No enquiries yet.</div>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <div key={l._id} className="card-luxury rounded p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[l.status] || ""}`}>{l.status}</span>
                    <span className="text-xs uppercase tracking-wider text-stone-500">{TYPES[l.type] || l.type}</span>
                    <span className="text-xs text-stone-400">{new Date(l.createdAt).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="mt-2 text-stone-900">
                    {l.name || l.email}
                    {l.phone && (
                      <>
                        {" · "}
                        <a href={`tel:${l.phone}`} className="text-gold-800 hover:underline">{l.phone}</a>
                        {" · "}
                        <a href={waLink(l.phone)} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">WhatsApp</a>
                      </>
                    )}
                    {l.email && l.name && <> · <a href={`mailto:${l.email}`} className="text-gold-800 hover:underline">{l.email}</a></>}
                  </p>
                  {l.productName && <p className="mt-1 text-sm text-stone-700">Product: {l.productName}</p>}
                  {(l.preferredDate || l.preferredTime) && (
                    <p className="mt-1 text-sm text-stone-700">Visit: {l.preferredDate} {l.preferredTime}</p>
                  )}
                  {l.budget && <p className="mt-1 text-sm text-stone-700">Budget: {l.budget}</p>}
                  {l.message && <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">{l.message}</p>}
                  {l.images?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {l.images.map((src) => (
                        <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                          <img src={src} alt="Customer photo" className="h-20 w-20 rounded-md border border-cream-300 object-cover" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select value={l.status} onChange={(e) => updateStatus(l._id, e.target.value)} className="px-2 py-1 rounded-md text-sm" aria-label="Status">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <button type="button" onClick={() => remove(l._id)} className="px-2 text-lg text-stone-500 hover:text-red-700" aria-label="Delete enquiry">×</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Enquiries;
