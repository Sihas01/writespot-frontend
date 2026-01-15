import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Subscribe to author's newsletter
export const subscribeToAuthor = async (authorId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/newsletter/subscribe/${authorId}`,
      {},
      { headers: getAuthHeaders() }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to subscribe to newsletter",
    };
  }
};

// Unsubscribe from author's newsletter
export const unsubscribeFromAuthor = async (authorId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/newsletter/unsubscribe/${authorId}`,
      {},
      { headers: getAuthHeaders() }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to unsubscribe from newsletter",
    };
  }
};

// Unsubscribe via email token (public endpoint)
export const unsubscribeByToken = async (token) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/newsletter/unsubscribe/${token}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to unsubscribe",
    };
  }
};

// Get user's subscriptions
export const getMySubscriptions = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/newsletter/subscriptions`,
      { headers: getAuthHeaders() }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch subscriptions",
    };
  }
};
