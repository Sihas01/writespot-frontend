import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from '../components/ReaderPortal/Header';
import Navigation from '../components/ReaderPortal/Navigation';
import CartPanel from "../components/ReaderPortal/CartPanel";
import { CartProvider } from "../context/CartContext";



import GenreSelectionModal from '../components/GenreSelectionModal';

const ReaderPortal = () => {
    const [showHeader, setShowHeader] = useState(true);
    const [isNavSticky, setIsNavSticky] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showGenreModal, setShowGenreModal] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const userName = user?.name || "Reader";

    useEffect(() => {
        // Check if user has preferred genres
        const checkForGenres = () => {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (currentUser && (!currentUser.preferredGenres || currentUser.preferredGenres.length === 0)) {
                // Small delay to ensure smooth transition
                setTimeout(() => setShowGenreModal(true), 1000);
            }
        };
        checkForGenres();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine if scrolling down or up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                setShowHeader(false);
                setIsNavSticky(true);
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                if (currentScrollY < 50) {
                    // Near top, show header and make nav non-sticky
                    setShowHeader(true);
                    setIsNavSticky(false);
                } else {
                    // Still scrolled down but going up, keep nav sticky
                    setShowHeader(false);
                    setIsNavSticky(true);
                }
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const navigate = useNavigate();
    const location = useLocation();
    const currentTab = location.pathname.split("/").pop() || "home";


    const handleTabChange = (tab) => {
        navigate(`/reader/dashboard/${tab}`);
    };

    if (showHeader === null) return null; // Prevent hydration mismatch or initial flicker if needed

    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Header username={(userName || "").split(" ")[0]} isVisible={showHeader} />
                    <Navigation
                        activeTab={currentTab}
                        onTabChange={handleTabChange}
                        isSticky={isNavSticky}
                    />

                    <main className={`px-4 lg:px-32 mx-auto py-6 ${isNavSticky ? 'mt-16' : ''}`}>
                        <Outlet />
                    </main>

                    <CartPanel />

                    {showGenreModal && (
                        <GenreSelectionModal
                            onSave={(genres) => {
                                setShowGenreModal(false);
                                window.location.href = '/reader/dashboard/store';
                            }}
                            onClose={() => setShowGenreModal(false)}
                        />
                    )}
                </ErrorBoundary>
            </div>
        </CartProvider>
    );
};

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ReaderPortal Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.FallbackComponent ? (
                <this.props.FallbackComponent error={this.state.error} />
            ) : (
                <div className="p-8 text-center text-red-600">
                    <h2>Something went wrong.</h2>
                    <p>{this.state.error?.toString()}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

const ErrorFallback = ({ error }) => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong.</h2>
        <pre className="bg-red-50 p-4 rounded text-sm text-red-800 border border-red-200 overflow-auto max-w-full">
            {error?.message || "Unknown error"}
        </pre>
        <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-[#5A7C65] text-white rounded hover:opacity-90"
        >
            Reload Page
        </button>
    </div>
);

export default ReaderPortal;