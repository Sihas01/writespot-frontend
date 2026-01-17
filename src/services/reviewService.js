import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Submit a review (create or update)
export const submitReview = async (bookId, rating, reviewText) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/books/${bookId}/reviews`,
      { rating, reviewText },
      { headers: getAuthHeaders() }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to submit review",
      debugError: error.response?.data?.debugError
    };
  }
};

// Get all reviews for a book
export const getBookReviews = async (bookId, sortBy = "newest") => {
  try {
    const response = await axios.get(
      `${API_URL}/api/books/${bookId}/reviews`,
      {
        params: { sort: sortBy },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch reviews",
    };
  }
};

// Mark a review as helpful (toggle)
export const markHelpful = async (reviewId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/reviews/${reviewId}/helpful`,
      {},
      { headers: getAuthHeaders() }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to mark review as helpful",
    };
  }
};

// Report a review
export const reportReview = async (reviewId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/reviews/${reviewId}/report`,
      {},
      { headers: getAuthHeaders() }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to report review",
    };
  }
};
