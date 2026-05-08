import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../hooks/usePriceFormat";
import Breadcrumb from "../components/Breadcrumb";
import {
  BagIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  ShieldIcon,
  TrashIcon,
  TruckIcon,
} from "../components/Icons";

const Cart = () => {
  const { items, subtotal, shipping, tax, total, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
        <div className="text-center py-24">
          <div className="w-24 h-24 rounded-full bg-rosegold/10 flex items-center justify-center mx-auto mb-6">
            <BagIcon className="w-12 h-12 text-rosegold" />
          </div>
          <h1 className="font-serif text-4xl text-navy mb-3">Your bag is empty</h1>
          <p className="text-charcoal/60 max-w-sm mx-auto mb-8">
            Begin curating your collection — discover handbags hand-picked just for you.
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-4 rounded-full bg-rosegold text-white font-medium hover:bg-rosegold-dark transition"
          >
            Shop Handbags
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />

      <h1 className="font-serif text-4xl sm:text-5xl text-navy mt-6 mb-2">Your Bag</h1>
      <p className="text-charcoal/60 mb-10">
        {items.reduce((sum, it) => sum + it.quantity, 0)} items, ready for the next chapter
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((it) => (
            <div
              key={it.key}
              className="bg-white rounded-3xl shadow-soft p-4 sm:p-5 flex gap-4 sm:gap-6"
            >
              <Link
                to={`/products/${it.id}`}
                className="shrink-0 w-24 sm:w-32 aspect-[4/5] rounded-2xl overflow-hidden bg-blush/20"
              >
                <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link
                      to={`/products/${it.id}`}
                      className="font-serif text-charcoal text-lg sm:text-xl hover:text-rosegold leading-tight line-clamp-2"
                    >
                      {it.name}
                    </Link>
                    <div className="flex items-center gap-3 mt-2 text-xs text-charcoal/60">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-charcoal/20"
                          style={{ backgroundColor: it.colorCode }}
                        />
                        {it.color}
                      </span>
                      <span>·</span>
                      <span>Size {it.size}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(it.key);
                      showToast("Item removed from bag", "info");
                    }}
                    className="text-charcoal/40 hover:text-red-500 transition shrink-0"
                    aria-label="Remove"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 mt-auto pt-4">
                  <div className="inline-flex items-center border-2 border-charcoal/10 rounded-full">
                    <button
                      onClick={() => updateQuantity(it.key, it.quantity - 1)}
                      className="px-3 py-2 hover:text-rosegold"
                      aria-label="Decrease"
                    >
                      <MinusIcon className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-sm font-medium min-w-[28px] text-center">
                      {it.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(it.key, it.quantity + 1)}
                      className="px-3 py-2 hover:text-rosegold"
                      aria-label="Increase"
                    >
                      <PlusIcon className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-right">
                    {it.originalPrice && (
                      <div className="text-xs text-charcoal/40 line-through">
                        {formatPrice(it.originalPrice * it.quantity)}
                      </div>
                    )}
                    <div className="font-serif text-lg sm:text-xl text-navy font-semibold">
                      {formatPrice(it.price * it.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-rosegold hover:text-rosegold-dark mt-4 text-sm font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 self-start">
          <div className="bg-white rounded-3xl shadow-soft p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-navy mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row
                label="Shipping"
                value={shipping === 0 ? "Free" : formatPrice(shipping)}
                hint={shipping === 0 ? "Free over Rs. 5,000" : undefined}
              />
              <Row label="Tax (8%)" value={formatPrice(tax)} />
            </div>

            <div className="border-t border-rosegold/20 my-5 pt-5 flex justify-between items-baseline">
              <span className="font-serif text-lg text-navy">Total</span>
              <span className="font-serif text-2xl text-navy font-semibold">
                {formatPrice(total)}
              </span>
            </div>

            {/* Promo code */}
            <div className="flex gap-2 mb-5">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 px-4 py-2.5 rounded-full text-sm border border-charcoal/15 focus:outline-none focus:ring-2 focus:ring-rosegold/30"
              />
              <button
                onClick={() => showToast("Promo code applied", "success")}
                className="px-5 py-2.5 rounded-full bg-charcoal text-cream text-sm hover:bg-navy transition"
              >
                Apply
              </button>
            </div>

            <Link
              to="/checkout"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-rosegold text-white font-medium hover:bg-rosegold-dark transition shadow-luxury"
            >
              Proceed to Checkout
              <ChevronRightIcon className="w-4 h-4" />
            </Link>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-charcoal/70">
              <div className="flex items-center gap-2">
                <TruckIcon className="w-4 h-4 text-rosegold" />
                Free returns
              </div>
              <div className="flex items-center gap-2">
                <ShieldIcon className="w-4 h-4 text-rosegold" />
                Secure checkout
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Row = ({ label, value, hint }) => (
  <div className="flex justify-between">
    <div>
      <span className="text-charcoal/70">{label}</span>
      {hint && <span className="block text-xs text-rosegold">{hint}</span>}
    </div>
    <span className="text-charcoal font-medium">{value}</span>
  </div>
);

export default Cart;
