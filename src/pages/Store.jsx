import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import banner from "../assets/images/banner.png";
import { useCart } from "../context/CartContext";

const limit = 10;

const Store = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState(
        JSON.parse(localStorage.getItem("recentSearches")) || []
    );
    const [filters, setFilters] = useState({ genre: "", language: "", minRating: "" });
    const [pendingFilters, setPendingFilters] = useState({ genre: "", language: "", minRating: "" });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");
    const [cartStatus, setCartStatus] = useState({ type: "", message: "" });
    const { addToCart, actionLoading } = useCart();

    const genres = ["Fiction", "Non-Fiction", "Poetry", "Biography", "Education"];
    const languages = ["Sinhala", "English", "Tamil"];
    const ratingLevels = [1, 2, 3, 4, 5];

    const fetchBooks = async ({ pageToLoad = 1, append = false } = {}) => {
        const token = localStorage.getItem("token");
        append ? setLoadingMore(true) : setLoading(true);
        setError("");

        try {
            const params = { page: pageToLoad, limit };
            if (filters.genre) params.genre = filters.genre;
            if (filters.language) params.language = filters.language;
            if (filters.minRating) params.minRating = filters.minRating;

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/books`, {
                params,
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });

            const list = Array.isArray(res.data)
                ? res.data
                : res.data?.data || res.data?.books || [];

            setHasMore(list.length === limit);
            setPage(pageToLoad);
            setBooks((prev) => (append ? [...prev, ...list] : list));
        } catch (err) {
            setHasMore(false);
            setError(err?.response?.data?.msg || "Failed to load books");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchBooks({ pageToLoad: 1, append: false });
        setPage(1);
    }, [filters]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredBooks(books);
            return;
        }

        const lower = searchQuery.toLowerCase();
        const result = books.filter(
            (book) =>
                book.title?.toLowerCase().includes(lower) ||
                `${book.author?.firstName || ""} ${book.author?.lastName || ""}`
                    .toLowerCase()
                    .includes(lower)
        );
        setFilteredBooks(result);
    }, [books, searchQuery]);

    const handleSearchChange = (value) => {
        setSearchQuery(value);

        if (!value.trim()) {
            setSuggestions([]);
            setFilteredBooks(books);
            return;
        }

        const lower = value.toLowerCase();
        const matches = books.filter(
            (book) =>
                book.title?.toLowerCase().includes(lower) ||
                `${book.author?.firstName || ""} ${book.author?.lastName || ""}`
                    .toLowerCase()
                    .includes(lower)
        );

        setSuggestions(matches.slice(0, 6));
    };

    const handleSuggestionClick = (book) => {
        setSearchQuery(book.title);
        saveRecent(book.title);

        const results = books.filter((b) =>
            b.title?.toLowerCase().includes(book.title.toLowerCase())
        );

        setSuggestions([]);
        setFilteredBooks(results);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const lower = searchQuery.toLowerCase();
        const result = books.filter(
            (book) =>
                book.title?.toLowerCase().includes(lower) ||
                `${book.author?.firstName || ""} ${book.author?.lastName || ""}`
                    .toLowerCase()
                    .includes(lower)
        );

        saveRecent(searchQuery);
        setSuggestions([]);
        setFilteredBooks(result);
    };

    const saveRecent = (query) => {
        let updated = [query, ...recentSearches.filter((q) => q !== query)];
        updated = updated.slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
    };

    const handleFilterApply = () => {
        setFilters({ ...pendingFilters });
        setSearchQuery("");
        setSuggestions([]);
        setHasMore(true);
        setPage(1);
        setIsFilterOpen(false);
    };

    const handleFilterClear = () => {
        const reset = { genre: "", language: "", minRating: "" };
        setPendingFilters(reset);
        setFilters(reset);
        setSearchQuery("");
        setSuggestions([]);
        setHasMore(true);
        setPage(1);
        setIsFilterOpen(false);
    };

    const handleRatingSelect = (rating) => {
        const current = Number(pendingFilters.minRating || 0);
        const next = current === rating ? "" : String(rating);
        setPendingFilters((prev) => ({
            ...prev,
            minRating: next,
        }));
    };

    const handleLoadMore = () => {
        if (loadingMore || !hasMore) return;
        const nextPage = page + 1;
        fetchBooks({ pageToLoad: nextPage, append: true });
    };

    const handleAddToCart = async (event, book) => {
        event.preventDefault();
        event.stopPropagation();
        setCartStatus({ type: "", message: "" });

        const bookId = book._id || book.id;
        const result = await addToCart({
            bookId,
            book,
            purchased: Boolean(book?.purchased || book?.isPurchased),
        });

        if (result?.message) {
            setCartStatus({ type: result.ok ? "success" : "error", message: result.message });
        }
    };

    return (
        <div className="pb-12">
            <img src={banner} alt="banner" className="w-full" />

            <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center justify-between">
                    <form className="relative w-full" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                            placeholder="Search books or authors..."
                            className="w-full border px-4 py-2 rounded-lg shadow-sm focus:outline-none"
                        />

                        {isFocused && (suggestions.length > 0 || recentSearches.length > 0) && (
                            <div className="absolute bg-white shadow-md w-full rounded-lg mt-1 max-h-60 overflow-auto z-20">
                                {(searchQuery === "" ? recentSearches : suggestions).map(
                                    (item, index) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() =>
                                                typeof item === "string"
                                                    ? setSearchQuery(item)
                                                    : handleSuggestionClick(item)
                                            }
                                        >
                                            {typeof item === "string"
                                                ? item
                                                : `${item.title} — ${item.author?.firstName || ""} ${item.author?.lastName || ""}`}
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </form>

                    <button
                        type="button"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="ml-4 whitespace-nowrap border px-4 py-2 rounded-lg shadow-sm bg-white hover:bg-gray-50 font-nunito"
                    >
                        Filter
                    </button>
                </div>

                {isFilterOpen && (
                    <div className="border rounded-lg p-4 shadow-sm bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium font-nunito">Genre</label>
                                <select
                                    className="border rounded-md px-3 py-2 font-nunito"
                                    value={pendingFilters.genre}
                                    onChange={(e) =>
                                        setPendingFilters((prev) => ({
                                            ...prev,
                                            genre: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="">All</option>
                                    {genres.map((genre) => (
                                        <option key={genre} value={genre}>
                                            {genre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium font-nunito">Language</label>
                                <select
                                    className="border rounded-md px-3 py-2 font-nunito"
                                    value={pendingFilters.language}
                                    onChange={(e) =>
                                        setPendingFilters((prev) => ({
                                            ...prev,
                                            language: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="">All</option>
                                    {languages.map((language) => (
                                        <option key={language} value={language}>
                                            {language}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium font-nunito">Minimum Rating</label>
                                <div className="flex items-center gap-2">
                                    {ratingLevels.map((rating) => {
                                        const selected = Number(pendingFilters.minRating || 0);
                                        const active = selected >= rating;
                                        return (
                                            <button
                                                type="button"
                                                key={rating}
                                                onClick={() => handleRatingSelect(rating)}
                                                className="focus:outline-none"
                                            >
                                                <span
                                                    className={`text-xl ${
                                                        active ? "text-yellow-500" : "text-gray-300"
                                                    }`}
                                                >
                                                    ★
                                                </span>
                                            </button>
                                        );
                                    })}
                                    <span className="text-sm text-gray-500 font-nunito">
                                        {pendingFilters.minRating ? `${pendingFilters.minRating}+` : "Any"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={handleFilterApply}
                                className="bg-[#5A7C65] text-white px-4 py-2 rounded-md font-nunito hover:opacity-90"
                            >
                                Apply Filters
                            </button>
                            <button
                                type="button"
                                onClick={handleFilterClear}
                                className="border px-4 py-2 rounded-md font-nunito hover:bg-gray-50"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <h3 className="mt-10 font-nunito text-xl">New Arrival</h3>
            <p className="font-nunito font-light">Explore our latest collection of books</p>

            {error && (
                <div className="mt-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {cartStatus.message && (
                <div
                    className={`mt-3 px-4 py-3 rounded-lg border font-nunito ${
                        cartStatus.type === "success"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}
                >
                    {cartStatus.message}
                </div>
            )}

            {loading && books.length === 0 ? (
                <p className="mt-6 text-gray-500 italic">Loading books...</p>
            ) : filteredBooks.length === 0 ? (
                <p className="mt-6 text-gray-500 italic">
                    No results found {searchQuery ? `for "${searchQuery}"` : ""}
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                        {filteredBooks.map((book) => {
                            const bookId = book._id || book.id;
                            return (
                                <Link
                                    key={bookId}
                                    to={bookId ? `/reader/dashboard/store/${bookId}` : "#"}
                                    className="p-4 rounded-xl flex flex-col shadow-sm bg-white hover:shadow-md transition-shadow"
                                >
                                    <img
                                        src={book.coverUrl}
                                        alt={book.title}
                                        className="w-full max-h-72 object-contain rounded-lg"
                                    />

                                    <div className="flex flex-col mt-4 gap-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[16px] font-semibold font-nunito leading-snug">
                                                {book.title}
                                            </p>
                                            <span className="text-sm font-semibold text-[#2E8B57]">
                                                {book.price ? `LKR ${book.price}` : "Free"}
                                            </span>
                                        </div>

                                        <p className="font-light text-[14px] font-nunito text-gray-700">
                                            {book.author?.firstName} {book.author?.lastName}
                                        </p>

                                        <div className="flex gap-1 text-yellow-500 text-lg leading-none">
                                            {Array.from({ length: 5 }).map((_, idx) => (
                                                <AiFillStar key={idx} />
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-3 mt-2">
                                            <button
                                                type="button"
                                                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] font-semibold text-gray-800 hover:bg-gray-50"
                                            >
                                                <FiShoppingBag className="w-4 h-4" />
                                                Buy Now
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => handleAddToCart(e, book)}
                                                disabled={actionLoading}
                                                className="h-11 w-12 flex items-center justify-center rounded-lg bg-[#5A7C65] text-white hover:opacity-90 disabled:opacity-60"
                                            >
                                                <FiShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex justify-center mt-8">
                        {hasMore ? (
                            <button
                                type="button"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="px-6 py-2 rounded-md border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-60 font-nunito"
                            >
                                {loadingMore ? "Loading..." : "Load More"}
                            </button>
                        ) : (
                            <p className="text-gray-500 font-nunito">No more books to load.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Store;
