import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleError = (err, fallback) => {
  throw new Error(err?.response?.data?.msg || fallback);
};

export const fetchProfileStatus = async () => {
  try {
    const res = await axios.get(`${API}/api/author/me`, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (err) {
    handleError(err, "Failed to load profile status");
  }
};

export const saveAuthorProfile = async (payload) => {
  try {
    const res = await axios.post(`${API}/api/author/profile`, payload, {
      headers: { "Content-Type": "application/json", ...authHeaders() },
    });
    return res.data;
  } catch (err) {
    handleError(err, "Failed to save profile");
  }
};

export const fetchPublicAuthorProfile = async (profileId) => {
  try {
    const res = await axios.get(`${API}/api/author/profile/${profileId}`, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (err) {
    handleError(err, "Failed to fetch author profile");
  }
};

export const toggleFollowAuthor = async (profileId) => {
  try {
    const res = await axios.post(
      `${API}/api/authors/${profileId}/follow`,
      {},
      { headers: authHeaders() }
    );
    return res.data;
  } catch (err) {
    handleError(err, "Failed to update follow");
  }
};

export const checkIsFollowing = async (profileId) => {
  try {
    const res = await axios.get(`${API}/api/authors/${profileId}/is-following`, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (err) {
    handleError(err, "Failed to check follow status");
  }
};

export default {
  fetchProfileStatus,
  saveAuthorProfile,
  fetchPublicAuthorProfile,
  toggleFollowAuthor,
  checkIsFollowing,
};

