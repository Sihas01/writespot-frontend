import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { unsubscribeByToken } from "../services/newsletterService";

const Unsubscribe = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    const handleUnsubscribe = async () => {
      if (!token) {
        setError("Invalid unsubscribe link");
        setLoading(false);
        return;
      }

      try {
        const result = await unsubscribeByToken(token);
        if (result.success) {
          setSuccess(true);
          setAuthorName(result.data?.authorName || "the author");
          
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate("/reader/dashboard/store");
          }, 3000);
        } else {
          setError(result.error || "Failed to unsubscribe");
          if (result.data?.alreadyUnsubscribed) {
            setSuccess(true);
            setAuthorName(result.data?.authorName || "the author");
          }
        }
      } catch (err) {
        setError(err.message || "An error occurred while unsubscribing");
      } finally {
        setLoading(false);
      }
    };

    handleUnsubscribe();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A7C65] mx-auto mb-4"></div>
          <p className="text-gray-600 font-nunito">Processing unsubscribe request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
        {success ? (
          <>
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-green-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-nunito">
              Successfully Unsubscribed
            </h1>
            <p className="text-gray-700 mb-6 font-nunito">
              You have been unsubscribed from {authorName}'s newsletter. You will no longer receive email notifications.
            </p>
            <p className="text-sm text-gray-500 mb-6 font-nunito">
              Redirecting to store in 3 seconds...
            </p>
            <button
              type="button"
              onClick={() => navigate("/reader/dashboard/store")}
              className="px-6 py-2 bg-[#5A7C65] text-white rounded-lg font-semibold hover:bg-[#4a6b55] font-nunito"
            >
              Go to Store
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-red-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-nunito">
              Unsubscribe Failed
            </h1>
            <p className="text-gray-700 mb-6 font-nunito">
              {error || "Invalid unsubscribe link. The link may have expired or is invalid."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate("/reader/dashboard/store")}
                className="px-6 py-2 bg-[#5A7C65] text-white rounded-lg font-semibold hover:bg-[#4a6b55] font-nunito"
              >
                Go to Store
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 font-nunito"
              >
                Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
