import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineGlobal } from "react-icons/ai";
import { RiUserLine } from "react-icons/ri";

const Header = ({ username, isVisible  }) => {
    return (

        <header
            className={`bg-white  px-4 lg:px-32 py-4 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}>
            <div className="flex items-center justify-between">
                <h1 className="font-inknut text-2xl md:text-2xl text-[#074B03]">WriteSpot</h1>
                <div className="flex items-center gap-1 md:gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                        <IoSearchOutline className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                        <AiOutlineGlobal className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition">
                        <RiUserLine className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700 font-medium">{username}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;