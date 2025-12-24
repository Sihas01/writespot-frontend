import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiHeart, FiShare2, FiShoppingCart, FiPlay } from "react-icons/fi";

const BookDetail = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authorName = useMemo(() => {
    if (book?.author?.firstName || book?.author?.lastName) {
      return `${book?.author?.firstName || ""} ${book?.author?.lastName || ""}`.trim();
    }
    if (book?.authorName) return book.authorName;
    return "Unknown Author";
  }, [book]);

  const ratingValue = Number(book?.averageRating ?? book?.rating ?? 0);
  const reviewCount = book?.reviewCount ?? book?.ratingsCount ?? 0;
  const purchased = Boolean(book?.isPurchased || book?.purchased);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/${bookId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const data = res.data?.data || res.data?.book || res.data;
        setBook(data);
      } catch (err) {
        setError(err?.response?.data?.msg || "Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const renderStars = () => {
    const rounded = Math.round(ratingValue);
    return Array.from({ length: 5 }).map((_, idx) =>
      idx < rounded ? (
        <AiFillStar key={idx} className="text-yellow-500" />
      ) : (
        <AiOutlineStar key={idx} className="text-yellow-500" />
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 font-nunito">Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 font-nunito">Book not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <div className="flex justify-between items-start pt-10">
          <div>
            <p className="text-sm font-nunito text-[#5A7C65] mb-1">Home / Store</p>
            <h1 className="text-3xl md:text-4xl font-nunito font-extrabold text-[#5A7C65]">
              {book.title || "Book Title"}
            </h1>
            <p className="text-sm font-nunito text-gray-700 mt-2">
              By <span className="font-semibold">{authorName}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Save to wishlist"
            >
              <FiHeart className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Share"
            >
              <FiShare2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 mt-10">
          <div className="flex-shrink-0 flex justify-center">
            <img
              src={book.coverUrl || book.coverImage || book.cover || ""}
              alt={book.title || "Book cover"}
              className="w-[230px] md:w-[260px] max-h-[420px] object-contain rounded-md"
            />
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-2xl md:text-3xl font-bold text-gray-800">
                {book.price != null ? `LKR ${book.price}` : "Free"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="flex">{renderStars()}</div>
                <span className="font-semibold">{ratingValue.toFixed(1)}</span>
                {Boolean(reviewCount) && <span className="text-gray-500">({reviewCount})</span>}
              </div>
            </div>

            <div className="border-b border-gray-200" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-gray-500 font-nunito">Genre</p>
                <p className="font-semibold text-gray-800 font-nunito">{book.genre || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 font-nunito">Sub-genre</p>
                <p className="font-semibold text-gray-800 font-nunito">{book.subGenre || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 font-nunito">Language</p>
                <p className="font-semibold text-gray-800 font-nunito">
                  {book.language || book?.languageCode || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-nunito">Format</p>
                <p className="font-semibold text-gray-800 font-nunito">{book.format || book.fileFormat || "N/A"}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {purchased ? (
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#5A7C65] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
                >
                  <FiPlay /> Read Now
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#5A7C65] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
                  >
                    <FiShoppingCart /> Add to cart
                  </button>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#E9B013] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:opacity-95"
                  >
                    Buy Now
                  </button>
                </>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-semibold text-gray-800 font-nunito">Description</h4>
              <p className="text-gray-700 leading-relaxed font-nunito">
                {book.description || "No description available for this book."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
