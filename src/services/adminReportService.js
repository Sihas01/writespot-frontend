import axios from "axios";

const apiBase = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

const buildQuery = (params) => {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  });
  return search.toString();
};

export const getAuthorReportSummary = async (page = 1, limit = 10, status = "pending") => {
  const query = buildQuery({ page, limit, status });
  const res = await axios.get(`${apiBase}/api/reports/admin/authors?${query}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getAuthorReports = async (authorId, status = "pending") => {
  const query = buildQuery({ status });
  const res = await axios.get(`${apiBase}/api/reports/admin/authors/${authorId}?${query}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const suspendAuthor = async (authorId, reasons, adminNote) => {
  const res = await axios.patch(
    `${apiBase}/api/reports/admin/authors/${authorId}/suspend`,
    { reasons, adminNote },
    { headers: getAuthHeader() }
  );
  return res.data;
};

export const deleteAuthor = async (authorId, reasons, adminNote) => {
  const res = await axios.patch(
    `${apiBase}/api/reports/admin/authors/${authorId}/delete`,
    { reasons, adminNote },
    { headers: getAuthHeader() }
  );
  return res.data;
};

export const activateAuthor = async (authorId) => {
  const res = await axios.patch(
    `${apiBase}/api/reports/admin/authors/${authorId}/activate`,
    {},
    { headers: getAuthHeader() }
  );
  return res.data;
};

export const getBookReportSummary = async (page = 1, limit = 10, status = "pending") => {
  const query = buildQuery({ page, limit, status });
  const res = await axios.get(`${apiBase}/api/reports/admin/books?${query}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getBookReports = async (bookId, status = "pending") => {
  const query = buildQuery({ status });
  const res = await axios.get(`${apiBase}/api/reports/admin/books/${bookId}?${query}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const removeBook = async (bookId, reasons, adminNote) => {
  const res = await axios.post(
    `${apiBase}/api/reports/admin/books/${bookId}/remove`,
    { reasons, adminNote },
    { headers: getAuthHeader() }
  );
  return res.data;
};
