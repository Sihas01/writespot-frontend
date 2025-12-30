import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiHeart, FiShare2, FiShoppingCart, FiPlay } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const BookDetail = () => {
  const { bookId: routeBookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartStatus, setCartStatus] = useState({ type: "", message: "" });
  const [buying, setBuying] = useState(false);
  const { addToCart, actionLoading } = useCart();
  const navigate = useNavigate();

  const authorName = useMemo(() => {
    if (book?.author?.firstName || book?.author?.lastName) {
      return `${book?.author?.firstName || ""} ${book?.author?.lastName || ""}`.trim();
    }
    if (book?.authorName) return book.authorName;
    return "Unknown Author";
  }, [book]);

  const authorProfileId = useMemo(
    () => book?.authorProfile?.profileId,
    [book]
  );

  const ratingValue = Number(book?.averageRating ?? book?.rating ?? 0);
  const reviewCount = book?.reviewCount ?? book?.ratingsCount ?? 0;
  const purchased = Boolean(book?.isPurchased || book?.purchased || book?.isOwned);
  const resolvedBookId = book?._id || book?.id || routeBookId;

  useEffect(() => {
    const fetchBook = async () => {
      if (!routeBookId) return;
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/books/${routeBookId}/reader`,
          {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        const data = res.data?.data || res.data?.book || res.data;
        setBook(data);
      } catch (err) {
        setError(err?.response?.data?.msg || "Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [routeBookId]);

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

  const handleAddToCart = async () => {
      setCartStatus({ type: "", message: "" });

    const result = await addToCart({
      bookId: resolvedBookId,
      book,
      purchased,
    });

    if (result?.message) {
      setCartStatus({ type: result.ok ? "success" : "error", message: result.message });
    }
  };

  const handleBuyNow = async () => {
      setCartStatus({ type: "", message: "" });

    if (purchased) {
      setCartStatus({ type: "error", message: "You already own this book" });
      return;
    }

    try {
      setBuying(true);
      const result = await addToCart({
        bookId: resolvedBookId,
        book,
        purchased,
      });

      if (result?.ok || result?.alreadyInCart) {
        navigate("/reader/dashboard/checkout");
      } else if (result?.message) {
        setCartStatus({ type: result.ok ? "success" : "error", message: result.message });
      }
    } finally {
      setBuying(false);
    }
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
              By{" "}
              {authorProfileId ? (
                <button
                  type="button"
                  onClick={() => navigate(`/author/${authorProfileId}`)}
                  className="font-semibold text-[#074B03] hover:underline"
                >
                  {authorName}
                </button>
              ) : (
                <span className="font-semibold">{authorName}</span>
              )}
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
                {!purchased && (book.price != null ? `LKR ${book.price}` : "Free")}
              </div>
              {purchased && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#5A7C65] text-white text-sm font-semibold">
                  Owned
                </span>
              )}
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
                  disabled
                  title="Reader coming soon"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#5A7C65] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-80"
                >
                  <FiPlay /> Read Now
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={actionLoading || purchased}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#5A7C65] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
                  >
                    <FiShoppingCart /> Add to cart
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={actionLoading || buying || purchased}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#E9B013] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:opacity-95 disabled:opacity-60"
                  >
                    {buying ? "Redirecting..." : "Buy Now"}
                  </button>
                </>
              )}
            </div>

            {cartStatus.message && (
              <div
                className={`mt-4 px-4 py-3 rounded-lg border font-nunito ${
                  cartStatus.type === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {cartStatus.message}
              </div>
            )}

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
