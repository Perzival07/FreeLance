import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { CATEGORIES, SUBCATEGORIES } from "../constants";

// Edits product details; photos stay as they are (delete and re-add to change photos)
const EditProductModal = ({ product, token, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price ?? "",
    mrp: product.mrp ?? "",
    stock: product.stock ?? 0,
    category: product.category,
    subCategory: product.subCategory,
    length: product.dimensions?.length ?? "",
    breadth: product.dimensions?.breadth ?? "",
    height: product.dimensions?.height ?? "",
    material: product.material || "",
    colors: (product.colors || []).join(", "),
    seating: product.seating || "",
    warranty: product.warranty || "",
    madeToOrder: Boolean(product.madeToOrder),
    bestseller: Boolean(product.bestseller),
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/product/update`, { id: product._id, ...form }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        onSaved(data.product);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const field = "mt-1 w-full px-3 py-2 rounded-md";
  const label = "text-sm text-ivory-300";
  // Subcategories that existing products use but aren't in the list yet
  const subOptions = SUBCATEGORIES.includes(form.subCategory) ? SUBCATEGORIES : [form.subCategory, ...SUBCATEGORIES];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4" role="dialog" aria-modal="true" aria-label={`Edit ${product.name}`}>
      <form onSubmit={save} className="card-luxury my-8 w-full max-w-3xl rounded-lg p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={product.image?.[0]} alt="" className="h-14 w-14 rounded object-cover" />
            <h2 className="font-display text-2xl text-ivory-50">Edit product</h2>
          </div>
          <button type="button" onClick={onClose} className="text-2xl text-ivory-400 hover:text-ivory-100" aria-label="Close">×</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={`${label} sm:col-span-2`}>Name<input className={field} value={form.name} onChange={set("name")} required minLength={3} /></label>
          <label className={`${label} sm:col-span-2`}>Description<textarea className={`${field} min-h-[110px]`} value={form.description} onChange={set("description")} required minLength={10} /></label>
          <label className={label}>Category
            <select className={field} value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className={label}>Sub category
            <select className={field} value={form.subCategory} onChange={set("subCategory")}>
              {subOptions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className={label}>Price (₹)<input className={field} type="number" min="1" value={form.price} onChange={set("price")} required /></label>
          <label className={label}>MRP (₹, optional)<input className={field} type="number" min="0" value={form.mrp} onChange={set("mrp")} placeholder="Leave blank for no discount" /></label>
          <label className={label}>Stock<input className={field} type="number" min="0" value={form.stock} onChange={set("stock")} required /></label>
          <div className="grid grid-cols-3 gap-2">
            <label className={label}>L (cm)<input className={field} type="number" min="0.1" step="0.1" value={form.length} onChange={set("length")} required /></label>
            <label className={label}>B (cm)<input className={field} type="number" min="0.1" step="0.1" value={form.breadth} onChange={set("breadth")} required /></label>
            <label className={label}>H (cm)<input className={field} type="number" min="0.1" step="0.1" value={form.height} onChange={set("height")} required /></label>
          </div>
          <label className={label}>Material<input className={field} value={form.material} onChange={set("material")} /></label>
          <label className={label}>Colours (comma separated)<input className={field} value={form.colors} onChange={set("colors")} /></label>
          <label className={label}>Seating<input className={field} value={form.seating} onChange={set("seating")} /></label>
          <label className={label}>Warranty<input className={field} value={form.warranty} onChange={set("warranty")} placeholder="Blank = standard warranty" /></label>
          <label className="flex items-center gap-2 text-sm text-ivory-300">
            <input type="checkbox" className="accent-gold-500 h-4 w-4" checked={form.madeToOrder} onChange={set("madeToOrder")} /> Made to order
          </label>
          <label className="flex items-center gap-2 text-sm text-ivory-300">
            <input type="checkbox" className="accent-gold-500 h-4 w-4" checked={form.bestseller} onChange={set("bestseller")} /> Bestseller
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-gold-outline rounded-md">Cancel</button>
          <button type="submit" disabled={saving} className="btn-gold rounded-md disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button>
        </div>
      </form>
    </div>
  );
};


export default EditProductModal;
