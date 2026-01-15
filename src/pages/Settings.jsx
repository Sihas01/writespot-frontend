import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySubscriptions, unsubscribeFromAuthor } from "../services/newsletterService";
import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const Settings = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unsubscribing, setUnsubscribing] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadSubscriptions = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getMySubscriptions();
        if (result.success) {
          // Fetch profile images from backend for each author
          const subscriptionsWithImages = await Promise.all(
            (result.data?.subscriptions || []).map(async (sub) => {
              let profileImageUrl = null;
              try {
                // Fetch author profile to get image URL
                const profileRes = await axios.get(
                  `${import.meta.env.VITE_API_URL}/api/author/profile/${sub.authorId}`,
                  { headers: getAuthHeaders() }
                );
                profileImageUrl = profileRes.data?.profile?.profileImageUrl || null;
              } catch (err) {
                // If profile fetch fails, continue without image
                console.error("Failed to fetch profile image:", err);
              }
              return {
                ...sub,
                profileImageUrl,
              };
            })
          );
          setSubscriptions(subscriptionsWithImages);
        } else {
          setError(result.error || "Failed to load subscriptions");
        }
      } catch (err) {
        setError(err.message || "Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, [navigate]);

  const handleUnsubscribe = async (authorId) => {
    if (!confirm("Are you sure you want to unsubscribe from this author's newsletter?")) {
      return;
    }

    setUnsubscribing((prev) => ({ ...prev, [authorId]: true }));
    try {
      const result = await unsubscribeFromAuthor(authorId);
      if (result.success) {
        // Remove from list
        setSubscriptions((prev) => prev.filter((sub) => sub.authorId !== authorId));
      } else {
        alert(result.error || "Failed to unsubscribe");
      }
    } catch (err) {
      alert(err.message || "Failed to unsubscribe");
    } finally {
      setUnsubscribing((prev) => ({ ...prev, [authorId]: false }));
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 font-nunito">Settings</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600 font-nunito">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 font-nunito">Settings</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 font-nunito">
          Newsletter Subscriptions
        </h2>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 font-nunito mb-4">
              You haven't subscribed to any newsletters yet.
            </p>
            <button
              type="button"
              onClick={() => navigate("/reader/dashboard/store")}
              className="px-6 py-2 bg-[#5A7C65] text-white rounded-lg font-semibold hover:bg-[#4a6b55] font-nunito"
            >
              Browse Authors
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription._id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                  {subscription.profileImageUrl ? (
                    <img
                      src={subscription.profileImageUrl}
                      alt={subscription.authorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-nunito">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 font-nunito truncate">
                    {subscription.authorName}
                  </h3>
                  <p className="text-sm text-gray-600 font-nunito">
                    Subscribed on {formatDate(subscription.subscribedAt)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleUnsubscribe(subscription.authorId)}
                  disabled={unsubscribing[subscription.authorId]}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-nunito whitespace-nowrap"
                >
                  {unsubscribing[subscription.authorId] ? "Unsubscribing..." : "Unsubscribe"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
