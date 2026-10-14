import { assets } from "./../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";


const adminPanelUrl =
  import.meta.env.VITE_ADMIN_URL || "/admin/";

function Navbar() {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    wishlist,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken("");
    // toast.success("Logout successful");
    setCartItems({});
    
    


  };

  return (
    <div className="flex items-center justify-between py-2 font-medium">
      <Link to={"/"} className="flex items-center gap-3">
        <img
          src={assets.logo_dark}
          className="w-16 sm:w-20 drop-shadow-[0_0_14px_rgba(201,162,75,0.25)] transition duration-300 hover:scale-105 hover:drop-shadow-[0_0_18px_rgba(201,162,75,0.55)]"
          alt="Loknath Sofa Center"
        />
      </Link>

      <ul className="hidden sm:flex gap-8 text-sm tracking-[0.12em] text-ivory-300">
        <NavLink to="/" className="flex flex-col items-center gap-1 hover:text-gold-400 transition-colors">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gold-500 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1 hover:text-gold-400 transition-colors">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gold-500 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1 hover:text-gold-400 transition-colors">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gold-500 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1 hover:text-gold-400 transition-colors">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gold-500 hidden" />
        </NavLink>


        <NavLink
          target="_blank"
          rel="noopener noreferrer"
          to={adminPanelUrl}
          className="flex flex-col items-center gap-1 "
        >
          <span className="border border-gold-500/50 px-5 text-xs py-1.5 rounded-full -mt-1 hover:border-gold-400 hover:bg-gold-500/10 hover:text-gold-300 transition-all">Admin Panel</span>
          <hr className="w-2/4 border-none h-[1.5px] bg-gold-500 hidden" />
        </NavLink>

      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="icon-luxury w-5 cursor-pointer"
          alt="searchIcon"
        />

        <div className="group relative">
          <img
            onClick={() => token ? null : navigate("/login")}
            src={assets.profile_icon}
            className="icon-luxury w-5 cursor-pointer"
            alt="pofileIcon"
          />

          {/* dropdown menu for profile icon */}
          {token &&
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-40 py-4 px-5 card-luxury text-ivory-300 rounded shadow-gold">
                <p onClick={() => navigate("/profile")} className="cursor-pointer hover:text-gold-400 transition-colors">My Profile</p>
                <p onClick={() => navigate("/orders")} className="cursor-pointer hover:text-gold-400 transition-colors">Orders</p>
                <p onClick={() => navigate("/wishlist")} className="cursor-pointer hover:text-gold-400 transition-colors">Wishlist</p>
                <p onClick={logout} className="cursor-pointer hover:text-gold-400 transition-colors">
                  Logout
                </p>
              </div>
            </div>
          }

        </div>



        <Link to="/wishlist" className="relative" aria-label="Wishlist">
          <img
            src={assets.wishlist_icon}
            className="icon-luxury w-5 min-w-5"
            alt=""
          />
          {wishlist.length > 0 ? (
            <span className="absolute right-[-6px] bottom-[-6px] min-w-[16px] h-4 px-0.5 text-center leading-4 bg-gold-500 text-ink-900 rounded-full text-[9px] font-semibold">
              {wishlist.length > 99 ? "99+" : wishlist.length}
            </span>
          ) : null}
        </Link>

        {/* card icon start */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="icon-luxury w-5 min-w-5" alt="cartIco" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-gold-500 text-ink-900 aspect-square rounded-full text-[8px] font-semibold">
            {getCartCount()}
          </p>
        </Link>
        {/* card icon end */}

        {/* mobile responsive menu icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt="menu_icon"
          className="icon-luxury w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* sidebar menu for small screen basically for mobile */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-ink-800 border-l border-gold-500/20 transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-ivory-300">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              className="icon-luxury h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="close_icon"
            />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-t border-gold-500/15 hover:bg-gold-500/5 hover:text-gold-400 transition-colors"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-t border-gold-500/15 hover:bg-gold-500/5 hover:text-gold-400 transition-colors"
            to="/collection"
          >
            Collection
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-t border-gold-500/15 hover:bg-gold-500/5 hover:text-gold-400 transition-colors"
            to="/about"
          >
            About
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-t border-gold-500/15 hover:bg-gold-500/5 hover:text-gold-400 transition-colors"
            to="/contact"
          >
            Contact
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-t border-gold-500/15 hover:bg-gold-500/5 hover:text-gold-400 transition-colors"
            to="/wishlist"
          >
            Wishlist
          </NavLink>
            <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-t border-b border-gold-500/15 hover:bg-gold-500/5 hover:text-gold-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            to={adminPanelUrl}
          >
            Admin Panel
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
