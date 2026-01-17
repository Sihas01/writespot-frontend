import { useState, useEffect } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { submitReview } from "../services/reviewService";

const ReviewModal = ({ isOpen, onClose, bookId, existingReview, onReviewSubmitted }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState(existingReview?.reviewText || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 0);
      setReviewText(existingReview.reviewText || "");
    } else {
      setRating(0);
      setReviewText("");
    }
    setError("");
  }, [existingReview, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars");
      return;
    }

    setLoading(true);
    try {
      const result = await submitReview(bookId, rating, reviewText);

      if (result.success) {
        if (onReviewSubmitted) {
          onReviewSubmitted(result.data);
        }
        onClose();
      } else {
        setError(result.error || "Failed to submit review");
        if (result.debugError) {
          console.error("Review Debug Error:", result.debugError);
          // Optionally append to error message for visibility
          setError(`${result.error} (Debug: ${result.debugError.toString().slice(0, 100)}...)`);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          {existingReview ? "Edit Your Review" : "Rate & Review"}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-3xl focus:outline-none transition-transform hover:scale-110"
                  aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                >
                  {star <= (hoveredRating || rating) ? (
                    <AiFillStar className="text-yellow-500" />
                  ) : (
                    <AiOutlineStar className="text-gray-300" />
                  )}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Review (Optional)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] min-h-[120px] font-nunito"
              placeholder="Share your thoughts about this book..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              maxLength={2000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {reviewText.length}/2000 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
              <p className="font-bold">{error}</p>
              {/* Show detailed debug info if available (parsed from error message if hidden, or explicit) */}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-nunito disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating < 1}
              className="px-4 py-2 bg-[#5A7C65] text-white rounded hover:bg-[#4a6b55] font-nunito disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
