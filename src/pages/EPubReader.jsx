import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactReader } from 'react-reader';
import axios from 'axios';
import { IoArrowBack } from 'react-icons/io5';

const EPubReader = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [size, setSize] = useState(100);

    const locationChanged = (epubcifi) => {
        setLocation(epubcifi);
        // Optionally save progress to backend here
    };

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/${bookId}/reader`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load book');
            } finally {
                setLoading(false);
            }
        };

        fetchBookData();
    }, [bookId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="text-xl font-nunito text-gray-600 animate-pulse">Opening your book...</div>
            </div>
        );
    }

    if (error || !bookData?.epubUrl) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
                <div className="text-red-500 text-lg font-semibold mb-4">{error || 'Book content not available'}</div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-[#5A7C65] text-white rounded-lg font-semibold"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Reader Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                        title="Exit Reader"
                    >
                        <IoArrowBack size={24} />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold text-gray-900 line-clamp-1 font-nunito">
                            {bookData.title}
                        </h1>
                        <p className="text-xs text-gray-500 font-nunito">
                            {bookData.author?.firstName} {bookData.author?.lastName}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSize(Math.max(80, size - 10))}
                        className="px-2 py-1 text-xs border rounded hover:bg-gray-50 font-nunito"
                    >
                        A-
                    </button>
                    <button
                        onClick={() => setSize(Math.min(150, size + 10))}
                        className="px-2 py-1 text-xs border rounded hover:bg-gray-50 font-nunito"
                    >
                        A+
                    </button>
                </div>
            </div>

            {/* Reader Container */}
            <div className="flex-1 relative bg-white">
                <ReactReader
                    url={bookData.epubUrl}
                    location={location}
                    locationChanged={locationChanged}
                    epubOptions={{
                        flow: 'paginated',
                        manager: 'default',
                    }}
                    styles={{
                        container: {
                            background: '#fff'
                        },
                        reader: {
                            background: '#fff',
                            fontSize: `${size}%`
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default EPubReader;
