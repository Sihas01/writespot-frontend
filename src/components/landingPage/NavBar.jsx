import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const NavBar = () => {
    const navItems = [
        { id: 1, text: 'Home' },
        { id: 2, text: 'Solutions' },
        { id: 3, text: 'About Us' },
    ]

    const [nav, setNav] = useState(false);

    const handleNav = () => {
        setNav(!nav);
    };
    return (
        <>
            <nav className="w-full fixed pr-4 pl-4 md:pl-8 md:p4-8 lg:pr-25 lg:pl-25 flex items-center justify-between bg-white z-20">
                <div className="flex gap-12 items-center p-4 pl-0 md:p-8 md:pl-0">
                    {/* Logo */}
                    <h1 className="font-inknut text-2xl md:text-2xl text-[#074B03]">WriteSpot</h1>

                    {/* menu items */}
                    <ul className="hidden md:flex gap-4 font-nunito">
                        {navItems.map(item => (
                            <li key={item.id}>{item.text}</li>
                        ))}
                    </ul>
                </div>

                <div className="hidden md:flex gap-4 items-center">
                    <a href="#">Sign In</a>
                    <button className="bg-[#074B03] pt-2 pb-2 pr-4 pl-4 text-white rounded-md">Sign Up Now</button>
                </div>

                {/* Mobile Navigation Icon */}
                <div onClick={handleNav} className='block md:hidden'>
                    {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            <ul
                className={
                    nav
                        ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
                        : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 -left-full'
                }
            ></ul>

            {/* Mobile menu */}
            <ul
                className={`fixed top-0 left-0 w-[60%] h-full bg-white shadow-lg z-40 transform transition-transform duration-500
          ${nav ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="p-6">
                    <h1 className="font-inknut text-2xl text-[#074B03] mb-6">
                        WriteSpot
                    </h1>
                    <ul className="flex flex-col gap-4 font-nunito">
                        {navItems.map(item => (
                            <li key={item.id} className="border-b py-2 text-gray-800 hover:text-[#074B03] cursor-pointer">
                                {item.text}
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col gap-4 mt-12">
                        <a href="#">Sign In</a>
                        <button className="bg-[#074B03] pt-2 pb-2 pr-4 pl-4 text-white rounded-md">Sign Up Now</button>
                    </div>
                </div>
            </ul>

        </>
    )
}

export default NavBar;