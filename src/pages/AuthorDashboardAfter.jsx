import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdEdit, MdClose, MdDelete } from 'react-icons/md';

const AuthorDashboardAfter = () => {
    const [books, setBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [formData, setFormData] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const userName = user?.name;

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/books/mybooks`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setBooks(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBooks();
    }, []);

    const handleDelete = async (book) => {
        if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/books/${book._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setBooks(books.filter(b => b._id !== book._id));
                alert('Book deleted successfully!');
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Failed to delete book');
            }
        }
    };

    const handleEdit = (book) => {
        setSelectedBook(book);
        setFormData({
            author: {
                firstName: book.author?.firstName || "",
                lastName: book.author?.lastName || ""
            },
            _id: book._id,
            title: book.title || "",
            subtitle: book.subtitle || "",
            description: book.description || "",
            genre: book.genre || "fiction",
            language: book.language || "en",
            keywords: book.keywords || [],
            price: book.price || 0,
            discount: book.discount || 0,
            isbn: book.isbn || "",
            fileFormat: book.fileFormat || "pdf"
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleKeywordsChange = (e) => {
        const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
        setFormData(prev => ({ ...prev, keywords }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${import.meta.env.VITE_API_URL}/books/${formData._id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setBooks(books.map(book =>
                book._id === formData._id ? { ...book, ...formData } : book
            ));

            setIsModalOpen(false);
            alert('Book updated successfully!');
        } catch (error) {
            console.error('Error updating book:', error);
            alert('Failed to update book');
        }
    };

    const handleDiscard = () => {
        setIsModalOpen(false);
        setSelectedBook(null);
        setFormData(null);
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-nunito font-semibold text-[#5A7C65] mb-6">
                Welcome Back, {userName.split(" ")[0]}
            </h2>

            <h3 className="mb-4 text-xl font-nunito font-normal text-[#3F4D61]">Trending Books</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-4">
                {books.map((book, index) => (
                    <div
                        key={book._id}
                        className={`
        ${index > 1 ? "hidden" : ""} 
        ${index < 5 ? "md:block" : "md:hidden"}
      `}
                    >
                        {book.coverUrl ? (
                            <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="w-40 h-60 object-cover"
                            />
                        ) : (
                            <div className="w-40 h-60 bg-gray-200 flex items-center justify-center">
                                No Cover
                            </div>
                        )}
                    </div>
                ))}
            </div>


            <h3 className="mb-4 text-xl mt-10 font-nunito font-normal text-[#3F4D61]">Book Analytics</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-0 text-center">
                    <thead>
                        <tr>
                            <th className="px-8 py-4">Cover Page</th>
                            <th className="px-8 py-4">Book Details</th>
                            <th className="px-8 py-4">Views</th>
                            <th className="px-8 py-4">Downloads</th>
                            <th className="px-8 py-4">Rating</th>
                            <th className="px-8 py-4">Like</th>
                            <th className="px-8 py-4">Dislike</th>
                            <th className="px-8 py-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {books.map((book) => (
                            <tr key={book._id}>
                                <td className="px-8 py-4 flex items-center justify-center">
                                    {book.coverUrl ? (
                                        <img
                                            src={book.coverUrl}
                                            alt={book.title}
                                            className="w-14 h-20 object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400">No Cover</span>
                                    )}
                                </td>
                                <td className="px-8 py-4 text-left">
                                    <div className="font-semibold">{book.title}</div>
                                    <div className="text-sm text-gray-600">
                                        {book.author?.firstName} {book.author?.lastName}
                                    </div>
                                </td>
                                <td className="px-8 py-4">250</td>
                                <td className="px-8 py-4">250</td>
                                <td className="px-8 py-4">5</td>
                                <td className="px-8 py-4">100</td>
                                <td className="px-8 py-4">02</td>
                                <td className="px-8 py-4">
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => handleEdit(book)}
                                            className="text-[#5A7C65] hover:text-[#4a6555] font-medium inline-flex items-center gap-1 cursor-pointer"
                                        >
                                            <MdEdit size={18} />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(book)}
                                            className="text-[#f0300e] hover:text-[#f44e31] font-medium inline-flex items-center gap-1 cursor-pointer"
                                        >
                                            <MdDelete size={18} />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isModalOpen && formData && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 z-999">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-gray-100">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">Edit Book</h2>
                                <p className="text-sm text-gray-500 mt-1">Update your book information</p>
                            </div>
                            <button
                                onClick={handleDiscard}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="overflow-y-auto p-8 flex-1">
                            <div className="space-y-6">
                                {/* Author Information */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Author Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="author.firstName"
                                                value={formData.author.firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="author.lastName"
                                                value={formData.author.lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Book Details */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Book Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Subtitle
                                            </label>
                                            <input
                                                type="text"
                                                name="subtitle"
                                                value={formData.subtitle}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows="4"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] focus:border-transparent transition-all resize-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                                    Genre
                                                </label>
                                                <select
                                                    name="genre"
                                                    value={formData.genre}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] focus:border-transparent transition-all"
                                                >
                                                    <option value="fiction">Fiction</option>
                                                    <option value="non-fiction">Non-Fiction</option>
                                                    <option value="mystery">Mystery</option>
                                                    <option value="romance">Romance</option>
                                                    <option value="biography">Biography</option>
                                                    <option value="self-help">Self-Help</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                                    Language
                                                </label>
                                                <select
                                                    name="language"
                                                    value={formData.language}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] focus:border-transparent transition-all"
                                                >
                                                    <option value="en">English</option>
                                                    <option value="de">German</option>
                                                    <option value="fr">French</option>
                                                    <option value="es">Spanish</option>
                                                    <option value="it">Italian</option>
                                                    <option value="pt">Portuguese</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Keywords <span className="text-gray-400 font-normal">(comma-separated)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.keywords.join(', ')}
                                                onChange={handleKeywordsChange}
                                                placeholder="thriller, mystery, adventure"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Format */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Pricing & Format</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Price (Rs.)
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Discount (%)
                                            </label>
                                            <input
                                                type="number"
                                                name="discount"
                                                value={formData.discount}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="100"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                                Format
                                            </label>
                                            <select
                                                name="fileFormat"
                                                value={formData.fileFormat}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] focus:border-transparent transition-all"
                                            >
                                                <option value="pdf">PDF</option>
                                                <option value="epub">EPUB</option>
                                                <option value="mobi">MOBI</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            ISBN <span className="text-gray-400 font-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="isbn"
                                            value={formData.isbn}
                                            onChange={handleInputChange}
                                            placeholder="978-3-16-148410-0"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7C65] focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={handleDiscard}
                                className="px-6 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-[#5A7C65] hover:bg-[#4a6555] text-white font-medium rounded-lg transition-colors cursor-pointer"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthorDashboardAfter;