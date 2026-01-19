import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Newsletters = () => {
    const [subscriptions, setSubscriptions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const navigate = React.useRouter ? React.useRouter() : null; // Handle if router not available, though specific import needed

    React.useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const token = localStorage.getItem('token');
                // Note: The route in index.js is /api/newsletter
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/newsletter/subscriptions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSubscriptions(res.data.subscriptions || []);
            } catch (err) {
                console.error("Failed to fetch subscriptions", err);
                setError("Failed to load subscriptions.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading subscriptions...</div>;

    return (
        <div className="pt-6">
            <h2 className="text-2xl font-bold font-nunito text-[#5A7C65] mb-4">Newsletters</h2>
            <p className="text-gray-600 font-nunito mb-6">Manage your newsletter subscriptions here.</p>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {subscriptions.length === 0 ? (
                <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                    You are not subscribed to any newsletters yet.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {subscriptions.map(sub => (
                        <div key={sub._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                            <Link to={`/author/${sub.authorId}`} className="flex items-center gap-3 mb-4 group hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
                                <img
                                    src={sub.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.authorName)}&background=random`}
                                    alt={sub.authorName}
                                    className="w-12 h-12 rounded-full object-cover border border-gray-200 group-hover:border-gray-300 transition-colors"
                                />
                                <div>
                                    <h3 className="font-bold text-lg leading-tight group-hover:text-[#5A7C65] transition-colors">{sub.authorName || "Unknown Author"}</h3>
                                    <p className="text-xs text-gray-500">Subscribed on {new Date(sub.subscribedAt).toLocaleDateString()}</p>
                                </div>
                            </Link>
                            <button
                                className="text-red-500 text-sm hover:underline self-start"
                                onClick={async () => {
                                    if (!confirm("Are you sure you want to unsubscribe?")) return;
                                    try {
                                        const token = localStorage.getItem('token');
                                        await axios.post(`${import.meta.env.VITE_API_URL}/api/newsletter/unsubscribe/${sub.authorId}`, {}, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        setSubscriptions(prev => prev.filter(s => s._id !== sub._id));
                                    } catch (e) {
                                        alert("Failed to unsubscribe");
                                    }
                                }}
                            >
                                Unsubscribe
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Newsletters;
