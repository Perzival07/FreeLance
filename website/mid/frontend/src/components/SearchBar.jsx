import { useEffect, useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const locatiion = useLocation();

  useEffect(() => {
    if (locatiion.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [locatiion]);

  return showSearch && visible ? (
    <div className="border-t border-b border-gold-500/15 bg-ink-900 text-center">
      <div className="inline-flex items-center justify-center border border-gold-500/30 focus-within:border-gold-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 transition-colors">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm text-ivory-100 placeholder-ivory-500"
          type="text"
          placeholder="Search"
        />
        <img onClick={() => setShowSearch(true)} className="icon-luxury w-4 cursor-pointer" src={assets.search_icon} alt="icon" />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        className="icon-luxury inline w-3 cursor-pointer"
        src={assets.cross_icon}
        alt="icon"
      />
    </div>
  ) : null;
};

export default SearchBar;
