import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    getAuthorReportSummary,
    getAuthorReports,
    suspendAuthor,
    deleteAuthor,
    activateAuthor,
    getBookReportSummary,
    getBookReports,
    removeBook,
} from "../services/adminReportService";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, authors: 0, books: 0, revenue: 0 });
    const [activeTab, setActiveTab] = useState("authors");
    const [authors, setAuthors] = useState([]);
    const [books, setBooks] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewAuthor, setViewAuthor] = useState(null);
    const [viewBook, setViewBook] = useState(null);
    const [authorReasons, setAuthorReasons] = useState([]);
    const [authorSelectedReasons, setAuthorSelectedReasons] = useState([]);
    const [authorNote, setAuthorNote] = useState("");
    const [bookReasons, setBookReasons] = useState([]);
    const [bookSelectedReasons, setBookSelectedReasons] = useState([]);
    const [bookNote, setBookNote] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const token = localStorage.getItem("token");
    const apiBase = import.meta.env.VITE_API_URL;

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${apiBase}/api/admin/dashboard-stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch stats", err);
        }
    };

    const fetchAuthors = async (page = 1) => {
        setLoading(true);
        try {
            const res = await getAuthorReportSummary(page, 10, "pending");
            setAuthors(res.data || []);
            setTotalPages(res.pagination?.pages || 1);
        } catch (err) {
            console.error("Failed to fetch authors", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBooks = async (page = 1) => {
        setLoading(true);
        try {
            const res = await getBookReportSummary(page, 10, "pending");
            setBooks(res.data || []);
            setTotalPages(res.pagination?.pages || 1);
        } catch (err) {
            console.error("Failed to fetch books", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAuditLogs = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiBase}/api/admin/audit-logs?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAuditLogs(res.data?.data || []);
            setTotalPages(res.data?.pagination?.pages || 1);
        } catch (err) {
            console.error("Failed to fetch audit logs", err);
        } finally {
            setLoading(false);
        }
    };

    const openAuthorReports = async (author) => {
        setLoading(true);
        try {
            const res = await getAuthorReports(author._id, "pending");
            const reports = res.reports || [];
            const uniqueReasons = Array.from(new Set(reports.map((report) => report.reason)));
            setViewAuthor({ ...author, reports });
            setAuthorReasons(uniqueReasons);
            setAuthorSelectedReasons(uniqueReasons);
            setAuthorNote("");
        } catch (err) {
            console.error("Failed to fetch author reports", err);
        } finally {
            setLoading(false);
        }
    };

    const openBookReports = async (book) => {
        setLoading(true);
        try {
            const res = await getBookReports(book._id, "pending");
            const reports = res.reports || [];
            const uniqueReasons = Array.from(new Set(reports.map((report) => report.reason)));
            setViewBook({ ...book, reports });
            setBookReasons(uniqueReasons);
            setBookSelectedReasons(uniqueReasons);
            setBookNote("");
        } catch (err) {
            console.error("Failed to fetch book reports", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspendAuthor = async () => {
        if (!viewAuthor) return;
        if (!window.confirm("Are you sure you want to suspend this author?")) return;
        try {
            await suspendAuthor(viewAuthor._id, authorSelectedReasons, authorNote);
            setViewAuthor(null);
            fetchAuthors(currentPage);
            fetchStats();
            setToast({ show: true, message: "Author suspended and notified", type: "success" });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to suspend author");
        }
    };

    const handleDeleteAuthor = async () => {
        if (!viewAuthor) return;
        if (!window.confirm("Are you sure you want to delete this author account? This action is permanent.")) return;
        try {
            await deleteAuthor(viewAuthor._id, authorSelectedReasons, authorNote);
            setViewAuthor(null);
            fetchAuthors(currentPage);
            fetchStats();
            setToast({ show: true, message: "Author deleted and notified", type: "success" });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete author");
        }
    };

    const handleActivateAuthor = async (authorOverride) => {
        const author = authorOverride || viewAuthor;
        if (!author) return;
        if (!window.confirm("Are you sure you want to reactivate this author account?")) return;
        try {
            await activateAuthor(author._id);
            setViewAuthor((prev) => prev ? { ...prev, status: "active" } : null);
            fetchAuthors(currentPage);
            fetchStats();
            setToast({ show: true, message: "Author reactivated", type: "success" });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to reactivate author");
        }
    };

    const handleRemoveBook = async () => {
        if (!viewBook) return;
        if (!window.confirm("Are you sure you want to remove this book? This action is permanent.")) return;
        try {
            await removeBook(viewBook._id, bookSelectedReasons, bookNote);
            setViewBook(null);
            fetchBooks(currentPage);
            fetchStats();
            setToast({ show: true, message: "Book removed and author notified", type: "success" });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to remove book");
        }
    };

    useEffect(() => {
        fetchStats();
        setCurrentPage(1); // Reset to first page when changing tabs
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === "authors") fetchAuthors(currentPage);
        if (activeTab === "books") fetchBooks(currentPage);
        if (activeTab === "audit") fetchAuditLogs(currentPage);
    }, [activeTab, currentPage]);

    useEffect(() => {
        if (!toast.show) return;
        const timeout = setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 3000);
        return () => clearTimeout(timeout);
    }, [toast.show]);

    const tableColSpan = 5;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* White Background Nav Bar */}
            <nav className="bg-white border-b border-gray-200 px-4 lg:px-32 py-4 shadow-sm sticky top-0 z-50">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-nunito font-bold text-[#4A6353]">
                        Admin Dashboard
                    </h2>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            sessionStorage.clear();
                            window.location.href = "/login";
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-all border border-red-100"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="px-4 lg:px-32 py-8 space-y-8">

                {/* Stats Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.users}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-gray-500 text-sm">Authors</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.authors}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-gray-500 text-sm">Books Published</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.books}</p>
                    </div>

                </section>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === "authors"
                            ? "border-b-2 border-[#074B03] text-[#074B03]"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                        onClick={() => setActiveTab("authors")}
                    >
                        Author Management
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === "books"
                            ? "border-b-2 border-[#074B03] text-[#074B03]"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                        onClick={() => setActiveTab("books")}
                    >
                        Book Management
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === "audit"
                            ? "border-b-2 border-[#074B03] text-[#074B03]"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                        onClick={() => setActiveTab("audit")}
                    >
                        Audit Logs
                    </button>
                    
                </div>

                {/* Pagination Controls - Top */}
                <div className="flex justify-between items-center py-2">
                    <p className="text-sm text-gray-500">
                        Showing page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1 || loading}
                            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || loading}
                            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 text-sm">
                                    {activeTab === "authors" ? (
                                        <>
                                            <th className="px-6 py-4 font-medium">Name</th>
                                            <th className="px-6 py-4 font-medium">Email</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium">Reports</th>
                                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                                        </>
                                    ) : activeTab === "books" ? (
                                        <>
                                            <th className="px-6 py-4 font-medium">Title</th>
                                            <th className="px-6 py-4 font-medium">Author</th>
                                            <th className="px-6 py-4 font-medium">Price</th>
                                            <th className="px-6 py-4 font-medium">Reports</th>
                                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                                        </>
                                    ) : activeTab === "audit" ? (
                                        <>
                                            <th className="px-6 py-4 font-medium">Date</th>
                                            <th className="px-6 py-4 font-medium">Admin</th>
                                            <th className="px-6 py-4 font-medium">Action</th>
                                            <th className="px-6 py-4 font-medium">Target</th>
                                            <th className="px-6 py-4 font-medium">Details</th>
                                        </>
                                    ) : null}
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                {loading && (
                                    <tr>
                                        <td colSpan={tableColSpan} className="px-6 py-8 text-center text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                )}

                                {!loading && activeTab === "authors" && authors.length === 0 && (
                                    <tr><td colSpan={tableColSpan} className="px-6 py-8 text-center text-gray-500">No authors found.</td></tr>
                                )}

                                {!loading && activeTab === "books" && books.length === 0 && (
                                    <tr><td colSpan={tableColSpan} className="px-6 py-8 text-center text-gray-500">No books found.</td></tr>
                                )}

                                {!loading && activeTab === "audit" && auditLogs.length === 0 && (
                                    <tr><td colSpan={tableColSpan} className="px-6 py-8 text-center text-gray-500">No audit logs found.</td></tr>
                                )}


                                {!loading && activeTab === "authors" && authors.map((author) => (
                                    <tr key={author._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{author.name}</td>
                                        <td className="px-6 py-4">{author.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${author.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {author.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {author.reportCount > 0 ? (
                                                <button
                                                    onClick={() => openAuthorReports(author)}
                                                    className="text-orange-600 hover:text-orange-800 text-xs font-bold bg-orange-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                                                >
                                                    <span>⚠️</span>
                                                    {author.reportCount} Reports
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            {author.status === "suspended" && (
                                                <button
                                                    onClick={() => handleActivateAuthor(author)}
                                                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                                                >
                                                    Reactivate
                                                </button>
                                            )}
                                            {author.reportCount > 0 ? (
                                                <button
                                                    onClick={() => openAuthorReports(author)}
                                                    className="text-[#074B03] hover:underline text-sm font-medium"
                                                >
                                                    Review
                                                </button>
                                            ) : (
                                                author.status !== "suspended" && (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {!loading && activeTab === "books" && books.map((book) => (
                                    <tr key={book._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
                                        <td className="px-6 py-4">{book.createdBy?.name || `${book.author?.firstName} ${book.author?.lastName}` || "Unknown"}</td>
                                        <td className="px-6 py-4">LKR {book.price}</td>
                                        <td className="px-6 py-4">
                                            {book.reportCount > 0 ? (
                                                <button
                                                    onClick={() => openBookReports(book)}
                                                    className="text-orange-600 hover:text-orange-800 text-xs font-bold bg-orange-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                                                >
                                                    <span>⚠️</span>
                                                    {book.reportCount} Reports
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {book.reportCount > 0 ? (
                                                <button
                                                    onClick={() => openBookReports(book)}
                                                    className="text-[#074B03] hover:underline text-sm font-medium"
                                                >
                                                    Review
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {!loading && activeTab === "audit" && auditLogs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {log.adminId?.name || "System"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${log.action.includes('DELETE') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {log.targetType}: {log.targetName}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-600 truncate max-w-xs">
                                            {log.details}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </section>
                {/* Author Report Modal */}
                {viewAuthor && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-xl max-h-[85vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Reports for {viewAuthor.name}
                                </h3>
                                <button
                                    onClick={() => setViewAuthor(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(viewAuthor.reports || []).map((report, idx) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-gray-800 font-medium mb-1">Reason:</p>
                                        <p className="text-gray-600 mb-2">{report.reason}</p>
                                        {report.details && (
                                            <>
                                                <p className="text-gray-800 font-medium mb-1">Details:</p>
                                                <p className="text-gray-600 mb-2">{report.details}</p>
                                            </>
                                        )}
                                        <div className="text-xs text-gray-400 flex justify-between">
                                            <span>Reported by: {report.reporter?.name || "Unknown"}</span>
                                            <span>{new Date(report.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 border-t border-gray-100 pt-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Email reason</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                    {authorReasons.map((reason) => (
                                        <label key={reason} className="flex items-center gap-2 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={authorSelectedReasons.includes(reason)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setAuthorSelectedReasons((prev) => [...prev, reason]);
                                                    } else {
                                                        setAuthorSelectedReasons((prev) => prev.filter((item) => item !== reason));
                                                    }
                                                }}
                                            />
                                            {reason}
                                        </label>
                                    ))}
                                </div>
                                <textarea
                                    value={authorNote}
                                    onChange={(e) => setAuthorNote(e.target.value)}
                                    rows={3}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-300"
                                    placeholder="Optional admin note to include in the email..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setViewAuthor(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Close
                                </button>
                                {viewAuthor.status === "suspended" && (
                                    <button
                                        onClick={handleActivateAuthor}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Reactivate Author
                                    </button>
                                )}
                                {viewAuthor.status !== "suspended" && (
                                    <button
                                        onClick={handleSuspendAuthor}
                                        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                                    >
                                        Suspend Author
                                    </button>
                                )}
                                <button
                                    onClick={handleDeleteAuthor}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete Author
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Book Report Modal */}
                {viewBook && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-xl max-h-[85vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Reports for "{viewBook.title}"
                                </h3>
                                <button
                                    onClick={() => setViewBook(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(viewBook.reports || []).map((report, idx) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-gray-800 font-medium mb-1">Reason:</p>
                                        <p className="text-gray-600 mb-2">{report.reason}</p>
                                        {report.details && (
                                            <>
                                                <p className="text-gray-800 font-medium mb-1">Details:</p>
                                                <p className="text-gray-600 mb-2">{report.details}</p>
                                            </>
                                        )}
                                        <div className="text-xs text-gray-400 flex justify-between">
                                            <span>Reported by: {report.reporter?.name || "Unknown"}</span>
                                            <span>{new Date(report.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 border-t border-gray-100 pt-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Email reason</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                    {bookReasons.map((reason) => (
                                        <label key={reason} className="flex items-center gap-2 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={bookSelectedReasons.includes(reason)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setBookSelectedReasons((prev) => [...prev, reason]);
                                                    } else {
                                                        setBookSelectedReasons((prev) => prev.filter((item) => item !== reason));
                                                    }
                                                }}
                                            />
                                            {reason}
                                        </label>
                                    ))}
                                </div>
                                <textarea
                                    value={bookNote}
                                    onChange={(e) => setBookNote(e.target.value)}
                                    rows={3}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-300"
                                    placeholder="Optional admin note to include in the email..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setViewBook(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleRemoveBook}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Remove Book
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {toast.show && (
                    <div className="fixed top-6 right-6 z-50">
                        <div className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                            {toast.message}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
