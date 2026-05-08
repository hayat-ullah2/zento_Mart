import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useProducts } from "../context/ProductsContext";
import { formatPrice } from "../hooks/usePriceFormat";
import Breadcrumb from "../components/Breadcrumb";
import RecentlyViewed from "../components/RecentlyViewed";
import StockIndicator from "../components/StockIndicator";
import { BagIcon, HeartIcon, TrashIcon } from "../components/Icons";

const Wishlist = () => {
  const { ids, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { products: allProducts } = useProducts();

  const items = ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Wishlist" }]} />
        <div className="text-center py-24">
          <div className="w-24 h-24 rounded-full bg-rosegold/10 flex items-center justify-center mx-auto mb-6">
            <HeartIcon className="w-12 h-12 text-rosegold" />
          </div>
          <h1 className="font-serif text-4xl text-navy mb-3">Your wishlist is empty</h1>
          <p className="text-charcoal/60 max-w-sm mx-auto mb-8">
            Tap the heart on any handbag to save it for later — your future self will thank you.
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-4 rounded-full bg-rosegold text-white font-medium hover:bg-rosegold-dark transition"
          >
            Discover Handbags
          </Link>
        </div>
      </div>
    );
  }

  const handleMoveAllToCart = () => {
    items.forEach((p) => {
      if (p.inStock) addToCart(p, { quantity: 1 });
    });
    showToast("All available items added to bag", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Wishlist" }]} />

      <div className="flex flex-wrap justify-between items-end gap-4 mt-6 mb-10">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl text-navy mb-2">
            Your Wishlist
          </h1>
          <p className="text-charcoal/60">{items.length} pieces saved with love</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleMoveAllToCart}
            className="px-5 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition"
          >
            Add All to Bag
          </button>
          <button
            onClick={() => {
              clearWishlist();
              showToast("Wishlist cleared", "info");
            }}
            className="px-5 py-2.5 rounded-full border border-charcoal/15 text-sm text-charcoal hover:border-red-400 hover:text-red-500 transition"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl shadow-soft overflow-hidden flex flex-col"
          >
            <Link to={`/products/${p.id}`} className="relative block aspect-[5/4] bg-blush/30">
              <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover" />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWishlist(p.id);
                  showToast("Removed from wishlist", "info");
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-rosegold hover:bg-rosegold hover:text-white transition shadow-soft"
                aria-label="Remove from wishlist"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </Link>
            <div className="p-5 flex-1 flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-rosegold mb-1">
                {p.style}
              </span>
              <Link
                to={`/products/${p.id}`}
                className="font-serif text-lg text-charcoal hover:text-rosegold leading-tight"
              >
                {p.name}
              </Link>
              <div className="flex items-center justify-between mt-2 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-charcoal">{formatPrice(p.price)}</span>
                  {p.originalPrice && (
                    <span className="text-xs text-charcoal/40 line-through">
                      {formatPrice(p.originalPrice)}
                    </span>
                  )}
                </div>
                <StockIndicator stock={p.stock} />
              </div>
              <button
                onClick={() => {
                  if (!p.inStock) return;
                  addToCart(p, { quantity: 1 });
                  showToast(`${p.name} added to bag`, "success");
                }}
                disabled={!p.inStock}
                className={`mt-auto flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition ${
                  p.inStock
                    ? "bg-navy text-cream hover:bg-rosegold"
                    : "bg-charcoal/15 text-charcoal/40 cursor-not-allowed"
                }`}
              >
                <BagIcon className="w-4 h-4" />
                {p.inStock ? "Add to Bag" : "Sold Out"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <RecentlyViewed />
    </div>
  );
};

export default Wishlist;
