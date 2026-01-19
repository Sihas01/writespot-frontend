import React, { useState } from 'react';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';

const GENRES = [
    "Fiction", "Non-Fiction", "Mystery", "Thriller", "Romance",
    "Science Fiction", "Fantasy", "Biography", "Self-Help", "History",
    "Children", "Young Adult", "Business", "Travel", "Cooking"
];

const GenreSelectionModal = ({ onClose, onSave }) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const toggleGenre = (genre) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleSubmit = async () => {
        if (selectedGenres.length === 0) return;
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Authentication token not found");

            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/auth/preferences`,
                { preferredGenres: selectedGenres },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local storage user
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                user.preferredGenres = selectedGenres;
                localStorage.setItem('user', JSON.stringify(user));
            }

            onSave(selectedGenres);
        } catch (err) {
            console.error("Failed to save genres", err);
            setError(err.response?.data?.msg || err.message || "Failed to save preferences. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl scale-100 transition-transform">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold font-nunito text-[#5A7C65] mb-2">What do you love to read?</h2>
                        <p className="text-gray-500 font-nunito text-lg">Select a few genres to help us recommend great books for you.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-center border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                        {GENRES.map(genre => (
                            <button
                                key={genre}
                                onClick={() => toggleGenre(genre)}
                                className={`py-3 px-4 rounded-xl text-center font-semibold transition-all duration-200 border-2 ${selectedGenres.includes(genre)
                                    ? 'border-[#5A7C65] bg-[#5A7C65] text-white shadow-md transform scale-105'
                                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-white'
                                    }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end gap-4">
                        {/* <button 
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition"
                        >
                            Skip for now
                        </button> */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || selectedGenres.length === 0}
                            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-[#5A7C65] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5A7C65]/30"
                        >
                            {loading ? 'Saving...' : 'Start Reading'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenreSelectionModal;
