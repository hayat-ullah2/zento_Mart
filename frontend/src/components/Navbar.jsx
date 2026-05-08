import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  BagIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
  CloseIcon,
} from "./Icons";
import CartDrawer from "./CartDrawer";

// A ref the rest of the app can target so flying-cart animations know where to land
export const cartIconRef = { current: null };

const Navbar = () => {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [bumpCart, setBumpCart] = useState(false);
  const localCartRef = useRef(null);

  // expose to global ref for fly-to-cart animation
  useEffect(() => {
    cartIconRef.current = localCartRef.current;
  }, []);

  // Cart bounce when itemCount changes
  const prevCount = useRef(itemCount);
  useEffect(() => {
    if (itemCount > prevCount.current) {
      setBumpCart(true);
      const t = setTimeout(() => setBumpCart(false), 600);
      return () => clearTimeout(t);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setMobileOpen(false);
    setSearchQuery("");
  };

  const navLink = "relative px-1 py-2 text-sm font-medium tracking-wide hover:text-rosegold transition-colors";

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-navy text-cream text-xs sm:text-sm py-2 text-center px-4">
        <span className="font-light tracking-[0.2em] uppercase">Complimentary Shipping on Orders Over Rs. 5,000</span>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#4c5c2f]/90 backdrop-blur-md shadow-soft" : "bg-[#4c5c2f]"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Mobile menu */}
            <button
              className="lg:hidden text-cream hover:text-rosegold transition"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="ZentoMart home">
              <div className="h-14 w-14 lg:h-16 lg:w-16 rounded-full overflow-hidden">
                <img
                  src="/logo.jpeg"
                  alt="ZentoMart"
                  className="h-full w-full object-cover scale-110 mix-blend-multiply"
                />
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8 text-cream">
              <Link to="/" className={navLink}>
                Home
              </Link>
              <Link to="/products" className={navLink}>
                Shop All
              </Link>
              <Link to="/products?style=Tote" className={navLink}>
                Totes
              </Link>
              <Link to="/products?style=Crossbody" className={navLink}>
                Crossbody
              </Link>
              <Link to="/products?style=Clutch" className={navLink}>
                Clutches
              </Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 sm:gap-2 text-cream">
              <button
                onClick={() => setSearchOpen((s) => !s)}
                className="p-2 hover:text-rosegold transition rounded-full hover:bg-rosegold/10"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              <Link
                to="/wishlist"
                className="p-2 hover:text-rosegold transition rounded-full hover:bg-rosegold/10 relative"
                aria-label="Wishlist"
              >
                <HeartIcon className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rosegold text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                ref={localCartRef}
                onClick={() => setCartOpen(true)}
                className={`p-2 hover:text-rosegold transition rounded-full hover:bg-rosegold/10 relative ${
                  bumpCart ? "animate-bounce-gentle" : ""
                }`}
                aria-label="Cart"
                data-cart-icon
              >
                <BagIcon className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rosegold text-white text-[10px] font-semibold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                className="hidden sm:block p-2 hover:text-rosegold transition rounded-full hover:bg-rosegold/10"
                aria-label="Account"
              >
                <UserIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <form onSubmit={handleSearch} className="pb-4 animate-fade-in">
              <div className="flex gap-2 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for handbags, styles, materials..."
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-rosegold/30 bg-white focus:outline-none focus:ring-2 focus:ring-rosegold/40 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-navy text-cream text-sm font-medium hover:bg-rosegold transition"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-3 hover:text-rosegold"
                  aria-label="Close search"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#4c5c2f] shadow-luxury animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-rosegold/20">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img
                  src="/logo.jpeg"
                  alt="ZentoMart"
                  className="h-full w-full object-cover scale-110 mix-blend-multiply"
                />
              </div>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-cream">
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-charcoal">
              <Link to="/" onClick={() => setMobileOpen(false)} className="py-2 border-b border-rosegold/10">
                Home
              </Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="py-2 border-b border-rosegold/10">
                Shop All
              </Link>
              <Link
                to="/products?style=Tote"
                onClick={() => setMobileOpen(false)}
                className="py-2 border-b border-rosegold/10"
              >
                Totes
              </Link>
              <Link
                to="/products?style=Crossbody"
                onClick={() => setMobileOpen(false)}
                className="py-2 border-b border-rosegold/10"
              >
                Crossbody
              </Link>
              <Link
                to="/products?style=Clutch"
                onClick={() => setMobileOpen(false)}
                className="py-2 border-b border-rosegold/10"
              >
                Clutches
              </Link>
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="py-2">
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
