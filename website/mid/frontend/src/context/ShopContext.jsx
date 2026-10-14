import { createContext, useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 0;

  // Defaults to the same-origin API (single Vercel deployment)
  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "/api/v1";

  // for products state
  const [cartItems, setCartItems] = useState(() => {
    // Guests keep their cart in this browser; logged-in carts come from the server
    try {
      if (localStorage.getItem("token")) return {};
      return JSON.parse(localStorage.getItem("guestCart") || "{}") || {};
    } catch {
      return {};
    }
  });

  // Every product we've seen, by id — used by cart, checkout and wishlist
  const [productCache, setProductCache] = useState({});
  // Categories / types with counts and price range, for menus and filters
  const [facets, setFacets] = useState({ categories: [], subCategories: [], price: { min: 0, max: 0 } });
  const [token, setToken] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();
  const setTokenRef = useRef(setToken);
  useEffect(() => {
    setTokenRef.current = setToken;
  }, [setToken]);

  useEffect(() => {
    const idReq = axios.interceptors.request.use((config) => {
      const fromStore = localStorage.getItem("token");
      if (fromStore) {
        config.headers = { ...config.headers, token: fromStore };
      }
      return config;
    });

    const idRes = axios.interceptors.response.use(
      (r) => r,
      async (error) => {
        const original = error.config;
        const status = error.response?.status;
        if (status !== 401 || !original || original._authRetry) {
          return Promise.reject(error);
        }
        const url = String(original.url || "");
        if (
          /\/(api\/v1\/|api\/)user\/(login|register|refresh-token)/.test(url)
        ) {
          return Promise.reject(error);
        }
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          return Promise.reject(error);
        }
        original._authRetry = true;
        try {
          const { data } = await axios.post(
            `${backendUrl}/user/refresh-token`,
            { refreshToken }
          );
          if (data.success && data.token) {
            localStorage.setItem("token", data.token);
            setTokenRef.current(data.token);
            original.headers = { ...original.headers, token: data.token };
            return axios(original);
          }
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setTokenRef.current("");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(idReq);
      axios.interceptors.response.eject(idRes);
    };
  }, [backendUrl]);

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const addToCart = async (itemId, dimensions) => {
    if (!dimensions) {
      toast.error("Product dimensions required");
      return;
    }

    let cartData = deepClone(cartItems);
    // check if the item already exists in the cart
    // if it does, increment the quantity
    if (cartData[itemId]) {
      if (cartData[itemId][dimensions]) {
        cartData[itemId][dimensions] += 1;
      } else {
        cartData[itemId][dimensions] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][dimensions] = 1;
    }

    if (token) {
      try {
        await axios.post(
          backendUrl + "/cart/add",
          { itemId, dimensions },
          { headers: { token } }
        );
        setCartItems(cartData);
        toast.success("Added to cart");
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || error.message);
      }
    } else {
      setCartItems(cartData);
      toast.success("Added to cart");
    }
  };

  // add to card counter
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error("Error calculating cart count:", error);
        }
      }
    }
    return totalCount;
  };




  // update quantity of the cart item
  const updateQuantity = async (itemId, dimensions, quantity) => {
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || !Number.isInteger(qty)) return;
    if (qty < 0 || qty > 99) return;

    let cartData = deepClone(cartItems);
    if (!cartData[itemId]) return;

    cartData[itemId][dimensions] = qty;

    if (token) {
      try {
        await axios.post(
          backendUrl + "/cart/update",
          { itemId, dimensions, quantity },
          { headers: { token } }
        );
        setCartItems(cartData);
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || error.message);
      }
    } else {
      setCartItems(cartData);
    }
};

  





const getCartAmount = () => {
  let totalAmount = 0;
  for (const itemId in cartItems) {
    const itemInfo = productCache[itemId];
    if (!itemInfo) continue;
    for (const dimensions in cartItems[itemId]) {
      const quantity = cartItems[itemId][dimensions];
      if (quantity > 0) {
        totalAmount += itemInfo.price * quantity;
      }
    }
  }
  return totalAmount;
};

  const cacheProducts = useCallback((list) => {
    if (!list?.length) return;
    setProductCache((prev) => {
      const next = { ...prev };
      for (const p of list) next[String(p._id)] = p;
      return next;
    });
  }, []);

  /**
   * Server-side product search / filter / sort.
   * params: { page, limit, q, category, subCategory, minPrice, maxPrice, inStock, bestseller, exclude, sort }
   */
  const fetchProducts = useCallback(
    async (params = {}) => {
      const query = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && !v.length)) {
          query.set(k, Array.isArray(v) ? v.join(",") : String(v));
        }
      }
      const { data } = await axios.get(`${backendUrl}/product/list?${query}`);
      if (!data.success) throw new Error(data.message || "Could not load products");
      cacheProducts(data.products);
      return { products: data.products || [], pagination: data.pagination };
    },
    [backendUrl, cacheProducts]
  );

  const productCacheRef = useRef(productCache);
  productCacheRef.current = productCache;

  // Loads any of these products we don't have yet
  const ensureProducts = useCallback(
    async (ids) => {
      const missing = [...new Set(ids.map(String))].filter((id) => !productCacheRef.current[id]);
      if (!missing.length) return;
      try {
        const { data } = await axios.post(`${backendUrl}/product/by-ids`, { ids: missing });
        if (data.success) cacheProducts(data.products);
      } catch (e) {
        console.log(e);
      }
    },
    [backendUrl, cacheProducts]
  );

  const fetchProductById = useCallback(
    async (productId) => {
      if (!productId) return null;
      try {
        const { data } = await axios.post(`${backendUrl}/product/single`, {
          productId,
        });
        if (data.success && data.product) {
          cacheProducts([data.product]);
          return data.product;
        }
      } catch (e) {
        console.log(e);
      }
      return null;
    },
    [backendUrl, cacheProducts]
  );

  // Fetch user cart data from the backend
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchWishlist = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/wishlist/get`,
        {},
        { headers: { token } }
      );
      if (data.success) {
        setWishlist(data.wishlist?.items ?? []);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, backendUrl]);

  const isWishlisted = useCallback(
    (productId, dimensions) =>
      wishlist.some(
        (w) =>
          String(w.productId) === String(productId) &&
          w.dimensions === dimensions
      ),
    [wishlist]
  );

  const addToWishlist = async (productId, dimensions) => {
    if (!token) {
      toast.error("Please log in to save items to your wishlist");
      navigate("/login");
      return;
    }
    if (!dimensions) {
      toast.error("Product dimensions required");
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/wishlist/add`,
        { productId, dimensions },
        { headers: { token } }
      );
      if (data.success) {
        await fetchWishlist();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const removeFromWishlist = async (productId, dimensions) => {
    if (!token) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/wishlist/remove`,
        { productId, dimensions },
        { headers: { token } }
      );
      if (data.success) {
        await fetchWishlist();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const toggleWishlist = async (productId, dimensions) => {
    if (!dimensions) return;
    if (isWishlisted(productId, dimensions)) {
      await removeFromWishlist(productId, dimensions);
    } else {
      await addToWishlist(productId, dimensions);
    }
  };

  
  useEffect(() => {
    axios
      .get(`${backendUrl}/product/facets`)
      .then(({ data }) => {
        if (data.success) setFacets(data);
      })
      .catch((e) => console.log(e));
  }, [backendUrl]);

  // Cart and wishlist only store ids — make sure their products are loaded
  useEffect(() => {
    ensureProducts([...Object.keys(cartItems), ...wishlist.map((w) => w.productId)]);
  }, [cartItems, wishlist, ensureProducts]);

  useEffect(() => {
    if (token) return;
    try {
      localStorage.setItem("guestCart", JSON.stringify(cartItems));
    } catch {
      // storage unavailable — cart still works for this visit
    }
  }, [cartItems, token]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [token, fetchWishlist]);

  const value = {
    // `products` = everything loaded so far (cart, checkout and wishlist look items up here)
    products: Object.values(productCache),
    productCache,
    facets,
    fetchProducts,
    ensureProducts,
    fetchProductById,
    currency,
    delivery_fee,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isWishlisted,
  };

  
  ShopContextProvider.propTypes = {
    children: PropTypes.node.isRequired, // Validates that 'children' is a React node and required
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
