import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaXTwitter, FaFacebook, FaInstagram } from "react-icons/fa6";

const AuthorProfileView = () => {
  const { authorId } = useParams();
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authorId) return;
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/author-profiles/${authorId}`);
        const data = res.data || {};
        setProfile(data.profile);
        setBooks(Array.isArray(data.books) ? data.books : []);
      } catch (err) {
        setError(err?.response?.data?.msg || "Unable to load author profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 font-nunito">Loading author...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm font-nunito">
          {error || "Author not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-5xl mx-auto px-4 lg:px-0">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start pt-10">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {profile.profileImageThumbUrl || profile.profileImageUrl ? (
              <img
                src={profile.profileImageThumbUrl || profile.profileImageUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-nunito">
                No Image
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-[#5A7C65] font-nunito">
              {profile.name || "Author"}
            </h1>
            <p className="text-gray-700 font-nunito mt-3 whitespace-pre-line">
              {profile.bio || "This author hasn't added a bio yet."}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              {profile.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#074B03] hover:text-white hover:bg-[#5A7C65] transition"
                  aria-label="Twitter"
                  title="Twitter"
                >
                  <FaXTwitter />
                </a>
              )}
              {profile.socialLinks?.facebook && (
                <a
                  href={profile.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#074B03] hover:text-white hover:bg-[#5A7C65] transition"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FaFacebook />
                </a>
              )}
              {profile.socialLinks?.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#074B03] hover:text-white hover:bg-[#5A7C65] transition"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <FaInstagram />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 font-nunito">Books by {profile.name}</h2>
          {books.length === 0 ? (
            <p className="mt-3 text-gray-600 font-nunito">No books listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {books.map((book) => (
                <Link
                  key={book._id}
                  to={book._id ? `/reader/dashboard/store/${book._id}` : "#"}
                  className="p-4 rounded-xl flex flex-col shadow-sm bg-white hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={book.coverUrl || book.coverImagePath || ""}
                      alt={book.title}
                      className="w-full max-h-64 object-contain rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col mt-4 gap-2">
                    <p className="text-[16px] font-semibold font-nunito leading-snug text-gray-900">
                      {book.title}
                    </p>
                    <p className="font-light text-[14px] font-nunito text-gray-700">
                      {book.author?.firstName} {book.author?.lastName}
                    </p>
                    <div className="flex items-center gap-2">
                      {book.price != null && (
                        <span className="text-sm font-semibold text-[#2E8B57]">
                          LKR {book.price}
                        </span>
                      )}
                      {book.discount ? (
                        <span className="text-xs text-gray-500 font-nunito">
                          {book.discount}% off
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfileView;

