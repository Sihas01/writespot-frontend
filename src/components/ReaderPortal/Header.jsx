import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineGlobal } from "react-icons/ai";
import { RiUserLine } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Header = ({ username, isVisible }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { cartCount, openCartPanel } = useCart();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
    }

    return (
        <header
            className={`bg-white z-100 relative px-4 lg:px-32 py-4 transition-transform duration-300  
    ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
        >
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => navigate("/reader/dashboard")}
                    className="font-inknut text-2xl text-[#074B03] hover:opacity-90"
                    aria-label="WriteSpot home"
                >
                    WriteSpot
                </button>

                <div className="flex items-center gap-1 md:gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                        <IoSearchOutline className="w-5 h-5 text-gray-600" />
                    </button>

                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                        <AiOutlineGlobal className="w-5 h-5 text-gray-600" />
                    </button>

                    <button
                        className="relative p-2 hover:bg-gray-100 rounded-full transition"
                        onClick={openCartPanel}
                        aria-label="Open cart"
                    >
                        <FiShoppingCart className="w-5 h-5 text-gray-600" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#5A7C65] text-white text-[10px] leading-none px-1.5 py-1 rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <RiUserLine className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700 font-medium">{username}</span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;