import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL ? API_URL.replace(/\/$/, "") : "";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeCartResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (payload?.cartItems && Array.isArray(payload.cartItems)) return payload.cartItems;
  if (payload?.items && Array.isArray(payload.items)) return payload.items;
  if (payload?.cart?.items && Array.isArray(payload.cart.items)) return payload.cart.items;
  if (payload?.cart && Array.isArray(payload.cart)) return payload.cart;
  return [];
};

const extractMessage = (err, fallback) => err?.response?.data?.msg || fallback;

const ensureBaseUrl = () => {
  if (!API_BASE) throw new Error("API base URL is not configured (VITE_API_URL).");
  return API_BASE;
};

const requestWithFallback = async ({ method = "get", paths = [], data }) => {
  const headers = getAuthHeaders();
  let lastError;

  for (const path of paths) {
    try {
      const res = await axios({
        method,
        url: path,
        data,
        headers: method === "post" ? { "Content-Type": "application/json", ...headers } : headers,
      });
      return res;
    } catch (err) {
      lastError = err;
      const status = err?.response?.status;
      if (status !== 404) {
        throw err;
      }
      // on 404, try next path
    }
  }

  throw lastError;
};

export const fetchCartItems = async () => {
  try {
    const base = ensureBaseUrl();
    const res = await axios.get(`${base}/cart`, { headers: getAuthHeaders() });
    return normalizeCartResponse(res.data);
  } catch (err) {
    throw new Error(extractMessage(err, "Failed to load cart"));
  }
};

export const addCartItem = async (bookId) => {
  try {
    const base = ensureBaseUrl();
    const paths = [`${base}/cart`, `${base}/cart/items`];
    const res = await requestWithFallback({
      method: "post",
      paths,
      data: { bookId },
    });
    return normalizeCartResponse(res.data);
  } catch (err) {
    throw new Error(extractMessage(err, "Failed to add to cart"));
  }
};

export const removeCartItem = async (bookId) => {
  try {
    const base = ensureBaseUrl();
    const paths = [`${base}/cart/items/${bookId}`, `${base}/cart/${bookId}`];
    const res = await requestWithFallback({ method: "delete", paths });
    return normalizeCartResponse(res.data);
  } catch (err) {
    throw new Error(extractMessage(err, "Failed to remove item"));
  }
};

