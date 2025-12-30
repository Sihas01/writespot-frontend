import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const statusFilters = ["All", "Currently Reading", "Finished"];

const deriveStatus = (book) => {
  const progress =
    Number(
      book?.readingProgress?.percentage ??
      book?.readingProgress?.progress ??
      book?.progressPercentage ??
      book?.progress ??
      0
    ) || 0;

  const finished =
    book?.readingProgress?.status === "FINISHED" ||
    book?.readingProgress?.isFinished ||
    progress >= 100;

  if (finished) return "Finished";
  if (
    progress > 0 ||
    book?.readingProgress?.status === "IN_PROGRESS" ||
    book?.readingProgress?.status === "CURRENTLY_READING"
  ) {
    return "Currently Reading";
  }
  return "Not Started";
};

const Library = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const loadLibrary = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to view your library.");

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/library`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.books || [];

      setBooks(list);
    } catch (err) {
      setBooks([]);
      setError(err?.response?.data?.msg || err.message || "Unable to load your library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return books;
    return books.filter((book) => {
      const status = deriveStatus(book);
      if (filter === "Finished") return status === "Finished";
      if (filter === "Currently Reading") return status === "Currently Reading";
      return true;
    });
  }, [books, filter]);

  return (
    <div className="min-h-screen bg-gray-50 pb-14">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#5A7C65] font-nunito">My Library</h1>
            <p className="text-gray-600 font-nunito">
              Access the books you own and track your reading progress.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((item) => {
              const active = filter === item;
              const count =
                item === "All"
                  ? books.length
                  : books.filter((b) => deriveStatus(b) === item).length;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold font-nunito transition ${active
                      ? "bg-[#5A7C65] text-white border-[#5A7C65]"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {item} {count ? `(${count})` : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {loading ? (
            <div className="text-center py-10 text-gray-600 font-nunito">
              Loading your library...
            </div>
          ) : error ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-nunito">
                {error}
              </div>
              <button
                type="button"
                onClick={loadLibrary}
                className="self-start sm:self-auto px-4 py-2 rounded-lg bg-[#5A7C65] text-white font-semibold hover:opacity-90"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-600 font-nunito">
              {books.length === 0
                ? "You have not purchased any books yet."
                : "No books match this filter."}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((book) => {
                const bookId = book?._id || book?.id || book?.bookId;
                const author =
                  `${book?.author?.firstName || ""} ${book?.author?.lastName || ""}`.trim() ||
                  book?.authorName ||
                  "Unknown Author";
                const status = deriveStatus(book);
                const purchaseDate =
                  book?.purchaseDate ||
                  book?.purchasedAt ||
                  book?.createdAt ||
                  book?.updatedAt ||
                  "";

                return (
                  <div
                    key={bookId || book?.title}
                    className="flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="bg-gray-50 flex justify-center items-center p-4">
                      <img
                        src={book?.coverUrl || book?.coverImage || book?.cover || ""}
                        alt={book?.title || "Book cover"}
                        className="h-52 object-contain"
                      />
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 font-nunito leading-tight">
                            {book?.title || "Untitled"}
                          </h3>
                          <p className="text-sm text-gray-600 font-nunito mt-1">{author}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold font-nunito ${status === "Finished"
                              ? "bg-green-50 text-green-700"
                              : status === "Currently Reading"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {status}
                        </span>
                      </div>

                      {purchaseDate && (
                        <p className="text-xs text-gray-500 font-nunito">
                          Added on {new Date(purchaseDate).toLocaleDateString()}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => navigate(`/reader/view/${bookId}`)}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-[#5A7C65] text-white px-4 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        Read Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;

