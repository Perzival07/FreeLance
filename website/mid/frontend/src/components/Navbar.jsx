import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Icon, { WhatsAppIcon } from "./Icons";
import { NAV_CATEGORIES, ROOMS, SITE, TRENDING_SEARCHES, whatsappLink } from "../config/site";
import { showroomStatus } from "../utils/format";

const RECENT_KEY = "recentSearches";

const readRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]").slice(0, 5);
  } catch {
    return [];
  }
};

const saveRecentSearch = (term) => {
  try {
    const list = readRecentSearches().filter((t) => t.toLowerCase() !== term.toLowerCase());
    localStorage.setItem(RECENT_KEY, JSON.stringify([term, ...list].slice(0, 5)));
  } catch {
    // ignore
  }
};

const collectionLink = (params) => `/collection?${new URLSearchParams(params)}`;

const SearchBox = ({ onDone, autoFocus = false, id }) => {
  const { navigate } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [term, setTerm] = useState(searchParams.get("q") || "");
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const recent = open ? readRecentSearches() : [];

  useEffect(() => {
    setTerm(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (value) => {
    const q = value.trim();
    setOpen(false);
    if (q) saveRecentSearch(q);
    navigate(q ? collectionLink({ q }) : "/collection");
    onDone?.();
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go(term);
        }}
        className="flex items-center rounded-md border border-stone-300 bg-cream-50 focus-within:border-stone-900"
      >
        <label htmlFor={id} className="sr-only">
          Search furniture
        </label>
        <input
          id={id}
          type="search"
          value={term}
          autoFocus={autoFocus}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Search sofas, beds, wardrobes…"
          className="w-full bg-transparent px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none"
          autoComplete="off"
        />
        <button type="submit" className="px-3 text-stone-600 hover:text-stone-900" aria-label="Search">
          <Icon name="search" />
        </button>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border border-cream-300 bg-white p-4 shadow-lg">
          {recent.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">Recent searches</p>
              <div className="flex flex-wrap gap-2">
                {recent.map((t) => (
                  <button key={t} type="button" onClick={() => go(t)} className="rounded-full bg-cream-200 px-3 py-1 text-sm text-stone-700 hover:bg-cream-300">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">Trending</p>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((t) => (
              <button key={t} type="button" onClick={() => go(t)} className="rounded-full border border-cream-300 px-3 py-1 text-sm text-stone-700 hover:border-stone-900">
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

SearchBox.propTypes = {
  onDone: PropTypes.func,
  autoFocus: PropTypes.bool,
  id: PropTypes.string.isRequired,
};

const CountBadge = ({ count }) =>
  count > 0 ? (
    <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-stone-900">
      {count > 99 ? "99+" : count}
    </span>
  ) : null;

CountBadge.propTypes = { count: PropTypes.number.isRequired };

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [roomsOpen, setRoomsOpen] = useState(false);
  const accountRef = useRef(null);
  const location = useLocation();
  const status = showroomStatus();

  const { getCartCount, navigate, token, setToken, setCartItems, wishlist } = useContext(ShopContext);
  const cartCount = getCartCount();

  // Close menus on navigation
  useEffect(() => {
    setDrawerOpen(false);
    setAccountOpen(false);
    setRoomsOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setAccountOpen(false);
        setDrawerOpen(false);
        setRoomsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken("");
    setCartItems({});
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `whitespace-nowrap py-3 text-sm transition-colors hover:text-gold-800 ${isActive ? "text-gold-800" : "text-stone-700"}`;

  return (
    <header className="sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-ink-900 text-xs text-stone-300">
        <div className="container-site flex h-9 items-center justify-between gap-4">
          <Link to="/showroom" className="flex min-w-0 items-center gap-2 hover:text-white">
            <span className={`h-2 w-2 shrink-0 rounded-full ${status.open ? "bg-green-400" : "bg-stone-500"}`} aria-hidden="true" />
            <span className="truncate">
              <span className="hidden sm:inline">Showroom: {SITE.address.line1}, {SITE.address.locality} · </span>
              {status.text}
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-4">
            <a href={SITE.phoneHref} className="flex items-center gap-1.5 hover:text-white">
              <Icon name="phone" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{SITE.phone}</span>
              <span className="sm:hidden">Call</span>
            </a>
            <a href={whatsappLink("Hi Loknath Sofa Center, I have a question.")} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 hover:text-white sm:flex">
              <WhatsAppIcon className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            <Link to="/track-order" className="hidden hover:text-white md:inline">
              Track order
            </Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-cream-300 bg-white">
        <div className="container-site flex h-16 items-center gap-4 lg:h-20 lg:gap-8">
          <button type="button" onClick={() => setDrawerOpen(true)} className="-ml-1 p-1 text-stone-800 lg:hidden" aria-label="Open menu">
            <Icon name="menu" className="h-6 w-6" />
          </button>

          <Link to="/" className="flex shrink-0 items-center" aria-label={`${SITE.name} — home`}>
            <img src={assets.logo} alt={SITE.name} width="64" height="64" className="h-12 w-12 lg:h-16 lg:w-16" />
          </Link>

          <div className="hidden flex-1 md:block">
            <SearchBox id="search-desktop" />
          </div>

          <div className="ml-auto flex items-center gap-4 sm:gap-5">
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => (token ? setAccountOpen((o) => !o) : navigate("/login"))}
                className="flex items-center gap-1.5 text-stone-800 hover:text-gold-800"
                aria-label={token ? "Account menu" : "Log in"}
                aria-expanded={token ? accountOpen : undefined}
              >
                <Icon name="user" className="h-6 w-6" />
                <span className="hidden text-sm xl:inline">{token ? "Account" : "Log in"}</span>
              </button>
              {token && accountOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border border-cream-300 bg-white py-2 text-sm shadow-lg">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-cream-100">My profile</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-cream-100">My orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 hover:bg-cream-100">Wishlist</Link>
                  <button type="button" onClick={logout} className="block w-full px-4 py-2 text-left hover:bg-cream-100">
                    Log out
                  </button>
                </div>
              )}
            </div>

            <Link to="/wishlist" className="relative text-stone-800 hover:text-gold-800" aria-label={`Wishlist, ${wishlist.length} items`}>
              <Icon name="heart" className="h-6 w-6" />
              <CountBadge count={wishlist.length} />
            </Link>

            <Link to="/cart" className="relative text-stone-800 hover:text-gold-800" aria-label={`Cart, ${cartCount} items`}>
              <Icon name="bag" className="h-6 w-6" />
              <CountBadge count={cartCount} />
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="container-site pb-3 md:hidden">
          <SearchBox id="search-mobile" />
        </div>

        {/* Category row (desktop) */}
        <nav aria-label="Product categories" className="hidden border-t border-cream-200 lg:block">
          <div className="container-site flex items-center gap-7">
            <NavLink to="/collection" end className={navLinkClass}>
              All Furniture
            </NavLink>
            {NAV_CATEGORIES.map((c) => (
              <Link key={c.label} to={collectionLink({ subCategory: c.subCategory })} className="whitespace-nowrap py-3 text-sm text-stone-700 hover:text-gold-800">
                {c.label}
              </Link>
            ))}
            <div className="relative" onMouseLeave={() => setRoomsOpen(false)}>
              <button
                type="button"
                onClick={() => setRoomsOpen((o) => !o)}
                onMouseEnter={() => setRoomsOpen(true)}
                className="flex items-center gap-1 py-3 text-sm text-stone-700 hover:text-gold-800"
                aria-expanded={roomsOpen}
              >
                Shop by Room <Icon name="chevronDown" className="h-4 w-4" />
              </button>
              {roomsOpen && (
                <div className="absolute left-0 top-full z-50 w-64 rounded-md border border-cream-300 bg-white py-2 shadow-lg">
                  {ROOMS.map((r) => (
                    <Link key={r.label} to={collectionLink({ category: r.category })} className="block px-4 py-2 hover:bg-cream-100">
                      <span className="block text-sm font-medium text-stone-900">{r.label}</span>
                      <span className="block text-xs text-stone-500">{r.blurb}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="ml-auto flex items-center gap-6">
              <NavLink to="/custom-furniture" className={navLinkClass}>
                Custom Furniture
              </NavLink>
              <NavLink to="/showroom" className={({ isActive }) => `flex items-center gap-1.5 whitespace-nowrap py-3 text-sm font-medium ${isActive ? "text-gold-800" : "text-stone-900"} hover:text-gold-800`}>
                <Icon name="store" className="h-4 w-4" /> Visit Showroom
              </NavLink>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-white">
            <div className="flex items-center justify-between border-b border-cream-300 px-4 py-3">
              <img src={assets.logo} alt={SITE.name} className="h-12 w-12" />
              <button type="button" onClick={() => setDrawerOpen(false)} className="p-1" aria-label="Close menu">
                <Icon name="close" className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4" aria-label="Mobile">
              <p className="eyebrow mb-2">Shop</p>
              <Link to="/collection" className="block py-2.5 text-stone-900">All Furniture</Link>
              {NAV_CATEGORIES.map((c) => (
                <Link key={c.label} to={collectionLink({ subCategory: c.subCategory })} className="block py-2.5 text-stone-800">
                  {c.label}
                </Link>
              ))}

              <p className="eyebrow mb-2 mt-6">Shop by room</p>
              {ROOMS.map((r) => (
                <Link key={r.label} to={collectionLink({ category: r.category })} className="block py-2.5 text-stone-800">
                  {r.label}
                </Link>
              ))}

              <p className="eyebrow mb-2 mt-6">Services</p>
              <Link to="/showroom" className="block py-2.5 text-stone-800">Visit our showroom</Link>
              <Link to="/book-visit" className="block py-2.5 text-stone-800">Book a visit</Link>
              <Link to="/custom-furniture" className="block py-2.5 text-stone-800">Custom furniture</Link>
              <Link to="/bulk-orders" className="block py-2.5 text-stone-800">Bulk orders</Link>
              <Link to="/track-order" className="block py-2.5 text-stone-800">Track order</Link>

              <p className="eyebrow mb-2 mt-6">Account</p>
              {token ? (
                <>
                  <Link to="/profile" className="block py-2.5 text-stone-800">My profile</Link>
                  <Link to="/orders" className="block py-2.5 text-stone-800">My orders</Link>
                  <Link to="/wishlist" className="block py-2.5 text-stone-800">Wishlist</Link>
                  <button type="button" onClick={logout} className="block py-2.5 text-stone-800">Log out</button>
                </>
              ) : (
                <Link to="/login" className="block py-2.5 text-stone-800">Log in / Sign up</Link>
              )}
            </nav>

            <div className="space-y-2 border-t border-cream-300 p-4">
              <a href={SITE.phoneHref} className="btn-outline w-full">
                <Icon name="phone" className="h-4 w-4" /> Call {SITE.phone}
              </a>
              <a href={whatsappLink("Hi Loknath Sofa Center, I have a question.")} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
                <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
