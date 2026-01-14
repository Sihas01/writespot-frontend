import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineGlobal } from "react-icons/ai";
import { RiUserLine } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfileStatus } from "../../services/authorService";

const Header = ({ username, isVisible }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [profileInfo, setProfileInfo] = useState({ hasProfile: false, imageUrl: "" });

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

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await fetchProfileStatus();
                setProfileInfo({
                    hasProfile: Boolean(res?.hasProfile),
                    imageUrl: res?.profile?.profileImageUrl || "",
                });
            } catch (err) {
                console.warn("Profile status load failed", err?.message);
            }
        };
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user?.role === "author") {
            loadProfile();
        }
    }, []);

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
                <h1 className="font-inknut text-2xl text-[#074B03]">WriteSpot</h1>

                <div className="flex items-center gap-1 md:gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                        <IoSearchOutline className="w-5 h-5 text-gray-600" />
                    </button>

                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                        <AiOutlineGlobal className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            {profileInfo.imageUrl ? (
                                <img
                                    src={profileInfo.imageUrl}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                />
                            ) : (
                                <RiUserLine className="w-5 h-5 text-gray-600" />
                            )}
                            <span className="text-gray-700 font-medium">{username}</span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        setOpen(false);
                                        navigate("/dashboard/profile");
                                    }}
                                >
                                    {profileInfo.hasProfile ? "Edit Profile" : "Create Profile"}
                                </button>

                                <div className="border-t border-gray-100 my-1" />

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