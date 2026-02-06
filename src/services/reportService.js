import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Submit a report for an Author, Book, or Review
 * @param {string} targetId - The ID of the target being reported
 * @param {string} targetModel - The type of target: 'User', 'Book', or 'Review'
 * @param {string} reason - The reason for the report
 * @param {string} details - Optional additional details
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const submitReport = async (targetId, targetModel, reason, details = "") => {
  try {
    const response = await axios.post(
      `${API_URL}/api/reports`,
      {
        targetId,
        targetModel,
        reason,
        details,
      },
      {
        headers: getAuthHeaders(),
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to submit report";

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Get report reasons for a specific target type (frontend use)
 * @param {string} targetType - 'Author', 'Book', or 'Review'
 * @returns {string[]} Array of valid reasons
 */
export const getReportReasons = (targetType) => {
  const reasons = {
    Author: ["Impersonation", "Fake Profile", "Hate Speech", "Spam"],
    Book: [
      "Copyright Violation / Plagiarism",
      "Inappropriate / Offensive Content",
      "Privacy Violation / Doxxing",
      "Encouraging Dangerous or Illegal Acts",
    ],
    Review: ["Harassment", "Spoilers", "Spam", "Hate Speech"],
  };

  return reasons[targetType] || [];
};
