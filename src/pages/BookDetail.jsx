import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiShare2, FiShoppingCart, FiPlay, FiThumbsUp, FiFlag } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import ReviewModal from "../components/ReviewModal";
import { getBookReviews, markHelpful, reportReview } from "../services/reviewService";

const BookDetail = () => {
  const { bookId: routeBookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartStatus, setCartStatus] = useState({ type: "", message: "" });
  const [buying, setBuying] = useState(false);

  // Report Feature State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  // Review Feature State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [helpfulLoading, setHelpfulLoading] = useState({});
  const [reportReviewLoading, setReportReviewLoading] = useState({});

  const { addToCart, actionLoading } = useCart();
  const navigate = useNavigate();

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) return;
    setReportLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/books/${resolvedBookId}/report`,
        { reason: reportReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Report submitted successfully. Thank you.");
      setShowReportModal(false);
      setReportReason("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit report");
    } finally {
      setReportLoading(false);
    }
  };

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
  const canReview = Boolean(book?.canReview && purchased);
  const userReview = book?.userReview || null;
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

  // Fetch reviews when book or sort changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (!resolvedBookId) return;
      setReviewsLoading(true);
      try {
        const result = await getBookReviews(resolvedBookId, sortBy);
        if (result.success) {
          setReviews(result.data?.reviews || []);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (resolvedBookId) {
      fetchReviews();
    }
  }, [resolvedBookId, sortBy]);

  // Refresh book data and reviews after review submission
  const handleReviewSubmitted = async (reviewData) => {
    // Refresh book data to get updated stats
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
      console.error("Failed to refresh book data:", err);
    }

    // Refresh reviews
    const result = await getBookReviews(resolvedBookId, sortBy);
    if (result.success) {
      setReviews(result.data?.reviews || []);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to like books");
      return;
    }

    if (!resolvedBookId) {
      alert("Error: Book ID not found");
      return;
    }

    // Optimistic update
    setBook(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1
    }));

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/likes/${resolvedBookId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // Sync with server response
        setBook(prev => ({
          ...prev,
          isLiked: !!res.data.isLiked,
          likesCount: res.data.likesCount
        }));
      } else {
        console.error("Like failed:", res.data);
        alert("Like failed to save: " + (res.data.message || "Unknown error"));
        // We do NOT revert here to keep the UI blue as requested, but warn the user.
      }
    } catch (err) {
      console.error("Like error", err);
      // alert("Like failed: " + (err.response?.data?.message || err.message));
      // We do NOT revert here to keep the UI blue as requested.
    }
  };

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

  const handleMarkHelpful = async (reviewId) => {
    setHelpfulLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const result = await markHelpful(reviewId);
      if (result.success) {
        // Update the review in the list
        setReviews((prev) =>
          prev.map((review) =>
            review._id === reviewId
              ? {
                ...review,
                helpfulCount: result.data.helpfulCount,
                hasVoted: result.data.hasVoted,
              }
              : review
          )
        );
      } else {
        alert(result.error || "Failed to update helpful vote");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setHelpfulLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleReportReview = async (reviewId) => {
    if (!confirm("Are you sure you want to report this review?")) return;

    setReportReviewLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const result = await reportReview(reviewId);
      if (result.success) {
        alert("Review reported successfully. Thank you for your feedback.");
      } else {
        alert(result.error || "Failed to report review");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setReportReviewLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderReviewStars = (rating) => {
    return Array.from({ length: 5 }).map((_, idx) =>
      idx < rating ? (
        <AiFillStar key={idx} className="text-yellow-500 text-sm" />
      ) : (
        <AiOutlineStar key={idx} className="text-gray-300 text-sm" />
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
              onClick={(e) => handleLike(e)}
              className="p-2 rounded-full hover:bg-gray-100 flex items-center gap-1 transition-colors cursor-pointer relative z-10"
              style={{ pointerEvents: 'auto' }}
              aria-label="Toggle like"
            >
              {book.isLiked ? (
                <FaHeart className="w-5 h-5 pointer-events-none" style={{ color: '#3b82f6' }} />
              ) : (
                <FaRegHeart className="w-5 h-5 pointer-events-none" style={{ color: '#9ca3af' }} />
              )}
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Share"
            >
              <FiShare2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="text-red-500 hover:text-red-700 text-sm font-semibold ml-2 hover:bg-red-50 px-3 py-1 rounded-full transition"
            >
              Report
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
                className={`mt-4 px-4 py-3 rounded-lg border font-nunito ${cartStatus.type === "success"
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

            {/* Rate & Review Button */}
            {purchased && (
              <div className="pt-4 border-t border-gray-200">
                {canReview && !userReview ? (
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                    className="px-6 py-2 bg-[#5A7C65] text-white rounded-lg font-semibold hover:bg-[#4a6b55] font-nunito"
                  >
                    Rate & Review
                  </button>
                ) : userReview ? (
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 font-nunito"
                  >
                    Edit Your Review
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 font-nunito">
              Reviews ({reviewCount})
            </h2>
            {reviews.length > 0 && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] font-nunito"
              >
                <option value="newest">Newest</option>
                <option value="most_helpful">Most Helpful</option>
                <option value="highest_rating">Highest Rating</option>
              </select>
            )}
          </div>

          {reviewsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 font-nunito">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 font-nunito">
                No reviews yet. Be the first to review this book!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800 font-nunito">
                          {review.reviewerName || "Anonymous"}
                        </h4>
                        <div className="flex items-center gap-1">
                          {renderReviewStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 font-nunito">
                        {formatDate(review.createdAt)}
                        {review.updatedAt &&
                          review.updatedAt !== review.createdAt &&
                          " (edited)"}
                      </p>
                    </div>
                  </div>

                  {review.reviewText && (
                    <p className="text-gray-700 leading-relaxed mb-4 font-nunito">
                      {review.reviewText}
                    </p>
                  )}

                  <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleMarkHelpful(review._id)}
                      disabled={helpfulLoading[review._id]}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#5A7C65] font-nunito disabled:opacity-50"
                    >
                      <FiThumbsUp
                        className={`${review.hasVoted ? "fill-current" : ""}`}
                      />
                      Helpful ({review.helpfulCount || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReportReview(review._id)}
                      disabled={reportReviewLoading[review._id]}
                      className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-nunito disabled:opacity-50"
                    >
                      <FiFlag />
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Report this Book</h3>
            <textarea
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
              placeholder="Why are you reporting this book? (e.g., Inappropriate content, Copyright issue)"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={reportLoading || !reportReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {reportLoading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        bookId={resolvedBookId}
        existingReview={userReview}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default BookDetail;
