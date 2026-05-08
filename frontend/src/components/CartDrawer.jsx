import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../hooks/usePriceFormat";
import {
  BagIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "./Icons";

const CartDrawer = ({ open, onClose }) => {
  const { items, subtotal, itemCount, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[420px] bg-[#4c5c2f] shadow-luxury flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-rosegold/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <BagIcon className="w-5 h-5 text-rosegold" />
            <h2 className="font-serif text-xl text-navy">
              Your Bag <span className="text-charcoal/50 text-sm">({itemCount})</span>
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close cart" className="hover:text-rosegold transition">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
                <BagIcon className="w-10 h-10 text-rosegold" />
              </div>
              <h3 className="font-serif text-2xl text-navy mb-2">Your bag is empty</h3>
              <p className="text-charcoal/60 text-sm mb-6">
                Discover our latest handbag collections, hand-picked for you.
              </p>
              <Link
                to="/products"
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li
                  key={it.key}
                  className="flex gap-4 bg-white rounded-2xl p-3 shadow-soft"
                >
                  <Link to={`/products/${it.id}`} onClick={onClose} className="shrink-0">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-20 h-24 object-cover rounded-xl"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${it.id}`}
                      onClick={onClose}
                      className="font-serif text-charcoal text-sm leading-tight hover:text-rosegold line-clamp-2"
                    >
                      {it.name}
                    </Link>
                    <p className="text-xs text-charcoal/60 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-charcoal/20 inline-block"
                          style={{ backgroundColor: it.colorCode }}
                        />
                        {it.color}
                      </span>
                      {" · "}Size {it.size}
                    </p>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-rosegold/30 rounded-full">
                        <button
                          onClick={() => updateQuantity(it.key, it.quantity - 1)}
                          className="p-1.5 hover:text-rosegold"
                          aria-label="Decrease"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium min-w-[24px] text-center">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(it.key, it.quantity + 1)}
                          className="p-1.5 hover:text-rosegold"
                          aria-label="Increase"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-charcoal">
                        {formatPrice(it.price * it.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(it.key)}
                    className="text-charcoal/40 hover:text-red-500 self-start"
                    aria-label="Remove"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-rosegold/20 p-5 bg-white/50 backdrop-blur-sm shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-charcoal/70 text-sm">Subtotal</span>
              <span className="text-xl font-serif text-navy font-semibold">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-charcoal/50 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="space-y-2.5">
              <Link
                to="/checkout"
                onClick={onClose}
                className="block text-center py-3 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition"
              >
                Checkout
              </Link>
              <Link
                to="/cart"
                onClick={onClose}
                className="block text-center py-3 rounded-full border border-navy/20 text-charcoal text-sm font-medium hover:bg-navy hover:text-cream transition"
              >
                View Bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
