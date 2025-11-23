import axios from "axios";
import { useEffect, useState } from "react";
import banner from '../assets/images/banner.png';

const Store = () => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState(
        JSON.parse(localStorage.getItem("recentSearches")) || []
    );
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/books")
            .then((res) => {
                setBooks(res.data);
                setFilteredBooks(res.data);
            });
    }, []);

    const handleSearchChange = (value) => {
        setSearchQuery(value);

        if (!value.trim()) {
            setSuggestions([]);
            setFilteredBooks(books);
            return;
        }

        const lower = value.toLowerCase();
        const matches = books.filter(book =>
            book.title.toLowerCase().includes(lower) ||
            `${book.author?.firstName} ${book.author?.lastName}`.toLowerCase().includes(lower)
        );

        setSuggestions(matches.slice(0, 6));
    };

    const handleSuggestionClick = (book) => {
        setSearchQuery(book.title);
        saveRecent(book.title);

        const results = books.filter(b =>
            b.title.toLowerCase().includes(book.title.toLowerCase())
        );

        setSuggestions([]);
        setFilteredBooks(results);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const lower = searchQuery.toLowerCase();
        const result = books.filter(book =>
            book.title.toLowerCase().includes(lower) ||
            `${book.author?.firstName} ${book.author?.lastName}`.toLowerCase().includes(lower)
        );

        saveRecent(searchQuery);
        setSuggestions([]);
        setFilteredBooks(result);
    };

    const saveRecent = (query) => {
        let updated = [query, ...recentSearches.filter(q => q !== query)];
        updated = updated.slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
    };

    return (
        <div>
            <img src={banner} alt="banner" className="w-full" />

            {/* Search bar */}
            <form className="relative w-full mt-8" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                    placeholder="Search books or authors..."
                    className="w-full border px-4 py-2 rounded-lg shadow-sm focus:outline-none"
                />

                {/* Suggestions dropdown */}
                {isFocused && (suggestions.length > 0 || recentSearches.length > 0) && (
                    <div className="absolute bg-white shadow-md w-full rounded-lg mt-1 max-h-60 overflow-auto z-20">
                        {(searchQuery === "" ? recentSearches : suggestions).map((item, index) => (
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
                                    : `${item.title} — ${item.author?.firstName} ${item.author?.lastName}`}
                            </div>
                        ))}
                    </div>
                )}
            </form>

            <h3 className="mt-10 font-nunito text-xl">New Arrival</h3>
            <p className="font-nunito font-light">Explore our latest collection of books</p>

            {/* Results */}
            {filteredBooks.length === 0 ? (
                <p className="mt-6 text-gray-500 italic">No results found for "{searchQuery}"</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {filteredBooks.map(book => (
                        <div
                            key={book._id}
                            className="p-3 rounded-md flex flex-col shadow-sm"
                        >
                            <img
                                src={book.coverUrl}
                                alt=""
                                className="w-full max-h-60 object-contain rounded-md"
                            />

                            <div className="px-2 flex flex-col mt-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[15px] font-medium font-nunito">{book.title}</p>
                                    <h3 className="text-sm font-semibold">Free</h3>
                                </div>

                                <p className="font-light text-[14px] font-nunito">
                                    {book.author?.firstName} {book.author?.lastName}
                                </p>

                                <p className="text-yellow-500 text-sm mt-2">⭐⭐⭐⭐⭐</p>

                                <div className="mt-4 bg-[#5A7C65] py-2 text-center text-white rounded-lg cursor-pointer">
                                    Add To Library
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Store;
