import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import Header from "../components/ReaderPortal/Header";
import Navigation from "../components/ReaderPortal/Navigation";
import CartPanel from "../components/ReaderPortal/CartPanel";
import { CartProvider } from "../context/CartContext";
import {
  fetchPublicAuthorProfile,
  toggleFollowAuthor,
} from "../services/authorService";

const AuthorProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchPublicAuthorProfile(id);
        setProfile(res.profile);
        setBooks(res.books || []);
        setFollowers(res.profile?.followersCount || 0);
        setIsFollowing(Boolean(res.isFollowing));
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (id) loadProfile();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
        setIsNavSticky(true);
      } else if (currentScrollY < lastScrollY) {
        if (currentScrollY < 50) {
          setShowHeader(true);
          setIsNavSticky(false);
        } else {
          setShowHeader(false);
          setIsNavSticky(true);
        }
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleFollowToggle = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    if (!profile) return;
    setFollowLoading(true);
    setError("");
    const optimisticFollow = !isFollowing;
    setIsFollowing(optimisticFollow);
    setFollowers((prev) => Math.max(0, prev + (optimisticFollow ? 1 : -1)));
    try {
      const res = await toggleFollowAuthor(profile.id);
      setIsFollowing(res.isFollowing);
      setFollowers((prev) =>
        typeof res.followersCount === "number" ? res.followersCount : prev
      );
    } catch (err) {
      // revert on error
      setIsFollowing(!optimisticFollow);
      setFollowers((prev) => Math.max(0, prev + (optimisticFollow ? -1 : 1)));
      setError(err.message || "Failed to update follow");
    } finally {
      setFollowLoading(false);
    }
  };

  const socialLinks = useMemo(
    () => [
      { icon: FaXTwitter, url: profile?.socialLinks?.twitter },
      { icon: FaFacebook, url: profile?.socialLinks?.facebook },
      { icon: FaInstagram, url: profile?.socialLinks?.instagram },
    ],
    [profile]
  );

  const content = () => {
    if (loading) {
      return (
        <div className="max-w-5xl mx-auto px-4 py-12">
          <p className="text-gray-700 font-nunito">Loading author profile...</p>
        </div>
      );
    }

    if (error || !profile) {
      return (
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="bg-white border border-red-200 text-red-700 px-5 py-4 rounded-lg">
            {error || "Author profile not found"}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              {profile.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt={profile.user?.name || "Author"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-nunito">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-nunito">
                  {profile.user?.name}
                </h1>
              </div>
              <p className="text-gray-700 leading-relaxed font-nunito">
                {profile.bio || "This author has not added a bio yet."}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-gray-700 font-nunito">
                  {followers} Followers
                </span>
                <div className="flex gap-2">
                  {socialLinks.map(
                    ({ icon: Icon, url }, idx) =>
                      url && (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      )
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {profile.newsletterUrl && (
                  <a
                    href={profile.newsletterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 font-semibold bg-white hover:bg-gray-50"
                  >
                    Subscribe to Newsletter
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-5 py-2 rounded-lg text-white font-semibold ${
                    isFollowing ? "bg-gray-700" : "bg-[#074B03]"
                  } hover:opacity-90 disabled:opacity-70`}
                >
                  {followLoading
                    ? "Updating..."
                    : isFollowing
                    ? "Following"
                    : "Follow"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 font-nunito mb-4">
            Books by {profile.user?.name}
          </h2>
          {books.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-600 font-nunito">
              No books available yet.
            </div>
          ) : (
            <div className="relative">
              <div className="flex justify-end gap-2 mb-3">
                <button
                  type="button"
                  onClick={() =>
                    carouselRef.current?.scrollBy({
                      left: -1 * (carouselRef.current?.clientWidth || 300),
                      behavior: "smooth",
                    })
                  }
                  className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() =>
                    carouselRef.current?.scrollBy({
                      left: carouselRef.current?.clientWidth || 300,
                      behavior: "smooth",
                    })
                  }
                  className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                >
                  ▶
                </button>
              </div>
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "none" }}
              >
                {books.map((book) => (
                  <Link
                    to={`/reader/dashboard/store/${book._id || book.id}`}
                    key={book._id || book.id}
                    className="flex-shrink-0 w-[230px] rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="w-full h-60 bg-gray-50 rounded-t-lg overflow-hidden flex items-center justify-center pt-2">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[11px] font-nunito">
                          No cover
                        </div>
                      )}
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-base font-semibold font-nunito text-gray-900 line-clamp-2">
                        {book.title}
                      </p>
                      <p className="text-sm text-gray-600 font-nunito truncate">
                        {profile.user?.name}
                      </p>
                      <p className="text-sm text-gray-600 font-nunito line-clamp-2">
                        {book.description || "No description"}
                      </p>
                      <div className="text-right pt-1">
                        <span className="text-sm font-semibold text-gray-900 font-nunito">
                          {book.price != null ? `LKR ${book.price}` : "Free"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 pb-12">
        <Header username={(profile?.user?.name || "Reader").split(" ")[0]} isVisible={showHeader} />
        <Navigation
          activeTab="store"
          onTabChange={(tab) => navigate(`/reader/dashboard/${tab}`)}
          isSticky={isNavSticky}
        />
        <main className={`px-4 lg:px-32 mx-auto pt-6 ${isNavSticky ? "mt-16" : ""}`}>
          {content()}
        </main>
        <CartPanel />
      </div>
    </CartProvider>
  );
};

export default AuthorProfileView;

