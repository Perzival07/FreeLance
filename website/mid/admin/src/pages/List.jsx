import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import EditProductModal from "../components/EditProductModal";

const List = ({token}) => {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");

  const fetchList = async () => {
    try {
      const pageSize = 100;
      const first = await axios.get(
        `${backendUrl}/api/product/list?page=1&limit=${pageSize}`
      );
      if (!first.data.success) {
        toast.error(first.data.message);
        return;
      }
      let all = [...(first.data.products || [])];
      const totalPages = first.data.pagination?.totalPages || 1;
      for (let page = 2; page <= totalPages; page++) {
        const r = await axios.get(
          `${backendUrl}/api/product/list?page=${page}&limit=${pageSize}`
        );
        if (r.data.success && r.data.products?.length) {
          all = all.concat(r.data.products);
        }
      }
      setList(all);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  


  // Function to remove a product
  // This function will be called when the user clicks on the delete icon

  const removeProduct = async (id) => {
    // Show confirmation dialog before removing
    const product = list.find(item => item._id === id);
    const productName = product ? product.name : 'this product';
    const confirmed = window.confirm(`Are you sure you want to remove "${productName}" from the list? This action cannot be undone.`);
    
    if (!confirmed) {
      return; // User cancelled the deletion
    }

    try {
      const response = await axios.post(backendUrl + '/api/product/remove' , { id }, {headers:{token}});
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(); // Refresh the list after deletion
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const toggleBestseller = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setList((prevList) =>
      prevList.map((product) =>
        product._id === id ? { ...product, bestseller: newStatus } : product
      )
    );

    try {
      const response = await axios.post(
        backendUrl + "/api/product/update-bestseller",
        { id, bestseller: newStatus },
        { headers: { token } }
      );
      if (!response.data.success) {
        setList((prevList) =>
          prevList.map((product) =>
            product._id === id ? { ...product, bestseller: currentStatus } : product
          )
        );
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
      }
    } catch (error) {
      setList((prevList) =>
        prevList.map((product) =>
          product._id === id ? { ...product, bestseller: currentStatus } : product
        )
      );
      console.log(error);
      toast.error(error.message);
    }
  };




  // Fetch the product list when the component mounts
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="eyebrow-gold text-xs mb-1">CATALOG</p>
      <h2 className="font-display text-3xl text-stone-900 mb-4">All Products</h2>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${list.length} products by name or category`}
        className="mb-4 w-full max-w-md px-3 py-2 rounded-md"
      />

      <div className="card-luxury rounded overflow-hidden">
        {/* ------ List Table Title--------- */}

        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 border-b border-cream-300 bg-cream-100 text-sm">
          <b className="text-stone-900">Image</b>
          <b className="text-stone-900">Name</b>
          <b className="text-stone-900">Category</b>
          <b className="text-stone-900">Price</b>
          <b className="text-center text-stone-900">Bestseller</b>
          <b className="text-center text-stone-900">Action</b>
        </div>

        {/* ------ Product List--------- */}

        <div className="divide-y divide-cream-300">
        {list
          .filter((item) => !query || `${item.name} ${item.category} ${item.subCategory}`.toLowerCase().includes(query.toLowerCase()))
          .map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 text-sm hover:bg-cream-100 transition-colors"
            key={item._id || index}
          >
            <img className="h-12 w-12 rounded border border-cream-300 object-cover" src={item.image[0]} alt="" />
            <div className="flex flex-col gap-1">
              <p className="text-stone-900">{item.name}</p>
              <div className="flex items-center gap-2 text-xs text-stone-500 md:hidden">
                <span>{item.category}</span>
                <span>•</span>
                <span className="text-gold-800">{currency}{Number(item.price).toLocaleString("en-IN")}</span>
                <span>•</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.bestseller || false}
                    onChange={() => toggleBestseller(item._id, item.bestseller || false)}
                    className="w-3 h-3 accent-gold-700 rounded cursor-pointer"
                  />
                  <span>Bestseller</span>
                </label>
              </div>
            </div>
            <p className="hidden md:block text-stone-700">{item.category}</p>
            <p className="hidden md:block text-gold-800 font-medium">
              {currency}
              {Number(item.price).toLocaleString("en-IN")}
            </p>
            <div className="hidden md:flex justify-center items-center">
              <input
                type="checkbox"
                checked={item.bestseller || false}
                onChange={() => toggleBestseller(item._id, item.bestseller || false)}
                className="w-4 h-4 accent-gold-700 rounded cursor-pointer"
                title="Mark as bestseller"
              />
            </div>
            <div className="flex items-center justify-end gap-3 md:justify-center">
              <button type="button" onClick={() => setEditing(item)} className="text-xs text-gold-800 hover:underline">
                Edit
              </button>
              <button type="button" onClick={() => removeProduct(item._id)} className="text-lg text-stone-500 hover:text-red-700 transition-colors" aria-label={`Delete ${item.name}`}>
                ×
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
      {editing && (
        <EditProductModal
          product={editing}
          token={token}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setList((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
            setEditing(null);
          }}
        />
      )}
    </>
  );
};

export default List;
