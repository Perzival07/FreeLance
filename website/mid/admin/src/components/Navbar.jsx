import { assets } from "../assets/assets";
import { FiExternalLink, FiLogOut } from "react-icons/fi";

const Navbar = ({ setToken }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-cream-300 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img className="h-11 w-11" src={assets.logo} alt="Loknath Sofa Center" />
          <div className="leading-tight">
            <p className="font-display text-xl font-semibold text-stone-900">Loknath Sofa Center</p>
            <p className="text-xs text-stone-500">Admin panel</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-cream-100 sm:flex">
            <FiExternalLink /> View store
          </a>
          <button type="button" onClick={() => setToken("")} className="btn-gold-outline px-4 py-2">
            <FiLogOut /> Log out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
