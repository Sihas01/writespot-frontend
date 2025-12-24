import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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

export const fetchCartItems = async () => {
  try {
    const res = await axios.get(`${API_URL}/cart`, { headers: getAuthHeaders() });
    return normalizeCartResponse(res.data);
  } catch (err) {
    throw new Error(extractMessage(err, "Failed to load cart"));
  }
};

export const addCartItem = async (bookId) => {
  try {
    const res = await axios.post(
      `${API_URL}/cart`,
      { bookId },
      { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }
    );
    return normalizeCartResponse(res.data);
  } catch (err) {
    throw new Error(extractMessage(err, "Failed to add to cart"));
  }
};

export const removeCartItem = async (bookId) => {
  try {
    const res = await axios.delete(`${API_URL}/cart/${bookId}`, {
      headers: getAuthHeaders(),
    });
    return normalizeCartResponse(res.data);
  } catch (err) {
    throw new Error(extractMessage(err, "Failed to remove item"));
  }
};

