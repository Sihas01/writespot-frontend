import React from 'react';
import { RiHome5Line } from "react-icons/ri";
import { GoBook } from "react-icons/go";
import { MdOutlineStorefront } from "react-icons/md";

const Navigation = ({ activeTab, onTabChange, isSticky }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: RiHome5Line },
    { id: 'store', label: 'Store', icon: MdOutlineStorefront },
    // { id: 'revenue', label: 'Revenue', icon: CiViewList }
  ];

  return (
    <nav 
      className={`bg-white border-b border-gray-200 px-4 lg:px-32 transition-all duration-300 ${
        isSticky ? 'fixed top-0 left-0 right-0 z-40 shadow-md' : 'relative'
      }`}
    >
      <div className="flex gap-8 font-nunito justify-center md:justify-start">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 py-4 border-b-2 transition ${
                activeTab === item.id
                  ? 'border-gray-800 text-gray-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              
              <span className="font-medium">{item.label}</span>
              <Icon className="w-6 h-6 hidden md:inline" />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;