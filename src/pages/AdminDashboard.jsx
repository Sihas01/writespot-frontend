import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, authors: 0, books: 0, revenue: 0 });
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewReportBook, setViewReportBook] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiBase}/api/admin/users?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data?.data || []);
            setTotalPages(res.data?.pagination?.pages || 1);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBooks = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiBase}/api/admin/books?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooks(res.data?.data || []);
            setTotalPages(res.data?.pagination?.pages || 1);
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

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`${apiBase}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers(currentPage);
            fetchStats(); // Update stats
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete user");
        }
    };

    const handleDeleteBook = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await axios.delete(`${apiBase}/api/admin/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchBooks(currentPage);
            fetchStats(); // Update stats
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete book");
        }
    };

    useEffect(() => {
        fetchStats();
        setCurrentPage(1); // Reset to first page when changing tabs
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === "users") fetchUsers(currentPage);
        if (activeTab === "books") fetchBooks(currentPage);
        if (activeTab === "audit") fetchAuditLogs(currentPage);
    }, [activeTab, currentPage]);

    return (
        <div className="min-h-screen bg-gray-50 px-4 lg:px-32 py-6 space-y-8">
            <header className="flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-nunito font-semibold text-[#5A7C65]">
                    Admin Dashboard
                </h2>
                <button
                    onClick={() => {
                        localStorage.clear();
                        sessionStorage.clear();
                        window.location.href = "/login";
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition"
                >
                    Logout
                </button>
            </header>

            {/* Stats Cards */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">LKR {stats.revenue}</p>
                </div>
            </section>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === "users"
                        ? "border-b-2 border-[#074B03] text-[#074B03]"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                    onClick={() => setActiveTab("users")}
                >
                    User Management
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
                                {activeTab === "users" ? (
                                    <>
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Email</th>
                                        <th className="px-6 py-4 font-medium">Role</th>
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
                                ) : (
                                    <>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">Admin</th>
                                        <th className="px-6 py-4 font-medium">Action</th>
                                        <th className="px-6 py-4 font-medium">Target</th>
                                        <th className="px-6 py-4 font-medium">Details</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                            {loading && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {!loading && activeTab === "users" && users.length === 0 && (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No users found.</td></tr>
                            )}

                            {!loading && activeTab === "books" && books.length === 0 && (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No books found.</td></tr>
                            )}

                            {!loading && activeTab === "audit" && auditLogs.length === 0 && (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No audit logs found.</td></tr>
                            )}

                            {!loading && activeTab === "users" && users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'author' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.role !== "admin" && (
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
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
                                        {(book.reports || []).length > 0 ? (
                                            <button
                                                onClick={() => setViewReportBook(book)}
                                                className="text-orange-600 hover:text-orange-800 text-xs font-bold bg-orange-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                                            >
                                                <span>⚠️</span>
                                                {(book.reports || []).length} Reports
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleDeleteBook(book._id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                        >
                                            Delete
                                        </button>
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
            {/* Report View Modal */}
            {viewReportBook && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                Reports for "{viewReportBook.title}"
                            </h3>
                            <button
                                onClick={() => setViewReportBook(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {viewReportBook.reports.map((report, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="text-gray-800 font-medium mb-1">Reason:</p>
                                    <p className="text-gray-600 mb-2">{report.reason}</p>
                                    <div className="text-xs text-gray-400 flex justify-between">
                                        <span>Reported by User ID: {report.userId}</span>
                                        <span>{new Date(report.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setViewReportBook(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleDeleteBook(viewReportBook._id);
                                    setViewReportBook(null);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete Book
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
