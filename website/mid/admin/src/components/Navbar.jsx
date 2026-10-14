import React from "react";
import { assets } from "../assets/assets";
import { FiLogOut } from "react-icons/fi"; // logout icon

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <span className="inline-block rounded-2xl bg-gradient-to-b from-ivory-50 to-ivory-200 p-2 ring-1 ring-gold-500/40 shadow-gold">
        <img className="w-[max(10%,80px)]" src={assets.logo} alt="admin_logo" />
      </span>

      <button
        onClick={() => setToken("")}
        className="flex items-center gap-2 border border-gold-500/40 text-ivory-200 px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:border-gold-400 hover:text-gold-300 hover:bg-gold-500/10 transition cursor-pointer"
      >
        <FiLogOut className="text-lg" /> {/* Icon */}
        Logout
      </button>
    </div>
  );
};

export default Navbar;
