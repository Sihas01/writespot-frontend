import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from '../components/ReaderPortal/Header';
import Navigation from '../components/ReaderPortal/Navigation';
import CartPanel from "../components/ReaderPortal/CartPanel";
import { CartProvider } from "../context/CartContext";



const ReaderPortal = () => {
    const [showHeader, setShowHeader] = useState(true);
    const [isNavSticky, setIsNavSticky] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const user = JSON.parse(localStorage.getItem('user'));
    const userName = user?.name || "Reader";



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

    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50">
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
            </div>
        </CartProvider>
    );
};

export default ReaderPortal;