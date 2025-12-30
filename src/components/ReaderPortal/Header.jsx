import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineGlobal } from "react-icons/ai";
import { RiUserLine } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";

const Header = ({ username, isVisible }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { cartCount, openCartPanel } = useCart();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;
    const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem("profileImageUrl") || "");
    const [hasProfile, setHasProfile] = useState(false);

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

    const logout  = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("profileImageUrl");
        navigate("/");
    }

    useEffect(() => {
        const fetchProfileImage = async () => {
            if (role !== "author") return;
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/author-profiles/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const profile = res.data?.profile || {};
                setHasProfile(Boolean(profile));
                const profileUrl = profile.profileImageThumbUrl || profile.profileImageUrl || profile.profileImageMainUrl;
                if (profileUrl) {
                    setAvatarUrl(profileUrl);
                    localStorage.setItem("profileImageUrl", profileUrl);
                }
            } catch (err) {
                console.error("Failed to load profile image", err?.response?.data || err.message);
            }
        };
        fetchProfileImage();
    }, [role]);

    return (
        <header
            className={`bg-white z-100 relative px-4 lg:px-32 py-4 transition-transform duration-300  
    ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
        >
            <div className="flex items-center justify-between">
                <h1 className="font-inknut text-2xl text-[#074B03]">WriteSpot</h1>

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
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <RiUserLine className="w-5 h-5 text-gray-600" />
                            )}
                            <span className="text-gray-700 font-medium">{username}</span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                {role === "author" && (
                                    <>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => {
                                                navigate("/dashboard/profile");
                                                setOpen(false);
                                            }}
                                        >
                                            {hasProfile ? "Edit Profile" : "Create Profile"}
                                        </button>
                                        <div className="border-t border-gray-100 my-1" />
                                    </>
                                )}
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