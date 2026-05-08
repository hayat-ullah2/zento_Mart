import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../hooks/usePriceFormat";
import { CloseIcon } from "./Icons";

const BuyNowModal = ({ product, onClose }) => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Pakistan",
  });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const subtotal = product.price * qty;
  const shipping = 250;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.name || !form.phone || !form.address || !form.city) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    setSubmitting(true);

    const payload = {
      customer: {
        name: form.name,
        email: form.email || `${form.phone}@guest.zentomart.com`,
        avatar: `https://picsum.photos/seed/${encodeURIComponent(form.email || form.phone)}/100`,
      },
      shippingAddress: {
        line1: form.address,
        line2: "",
        city: form.city,
        state: "",
        zip: "",
        country: form.country || "Pakistan",
        phone: form.phone,
      },
      items: [
        {
          productId: product.id,
          name: product.name,
          color: product.colors?.[0]?.name || "",
          size: "",
          qty,
          price: product.price,
          image: product.mainImage,
        },
      ],
      subtotal,
      shipping,
      tax,
      total,
      payment: { method: "Cash on Delivery", status: "Pending" },
    };

    try {
      const data = await api.post("/orders", payload);
      const code = data?.order?.code || "";
      showToast(
        `Order ${code ? "#" + code + " " : ""}placed — we'll be in touch soon!`,
        "success",
        4500,
      );
      onClose();
    } catch (err) {
      showToast(err.message || "Could not place the order. Please try again.", "error");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full sm:w-[480px] sm:max-w-[92vw] max-h-[92vh] overflow-y-auto bg-white sm:rounded-2xl rounded-t-2xl shadow-luxury animate-fade-in-up">
        <div className="sticky top-0 bg-white px-5 py-4 border-b border-charcoal/10 flex items-center justify-between z-10">
          <h2 className="font-serif text-lg sm:text-xl text-navy">Order this piece</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-charcoal/5 text-charcoal/60"
            aria-label="Close"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Product summary */}
          <div className="flex gap-3 p-3 rounded-xl bg-charcoal/[0.03]">
            <img
              src={product.mainImage}
              alt={product.name}
              className="w-16 h-20 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-charcoal line-clamp-1">{product.name}</p>
              <p className="text-xs text-charcoal/50 uppercase tracking-wider mt-0.5">
                {product.style}
              </p>
              <p className="font-semibold text-charcoal mt-1">{formatPrice(product.price)}</p>
            </div>
            <div className="flex flex-col items-end justify-center gap-1">
              <span className="text-[10px] uppercase tracking-wider text-charcoal/50">Qty</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full border border-charcoal/15 hover:bg-rosegold hover:text-white text-sm"
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="text-sm font-medium w-5 text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-7 h-7 rounded-full border border-charcoal/15 hover:bg-rosegold hover:text-white text-sm"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field name="name" label="Full name *" value={form.name} onChange={handleChange} />
              <Field name="phone" label="Phone *" value={form.phone} onChange={handleChange} />
            </div>
            <Field name="email" label="Email (optional)" type="email" value={form.email} onChange={handleChange} />
            <Field name="address" label="Address *" value={form.address} onChange={handleChange} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field name="city" label="City *" value={form.city} onChange={handleChange} />
              <Field name="country" label="Country" value={form.country} onChange={handleChange} />
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-charcoal/10 text-sm space-y-1.5">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Shipping" value={formatPrice(shipping)} />
              <Row label="Tax (5%)" value={formatPrice(tax)} />
              <Row label="Total" value={formatPrice(total)} bold />
              <p className="text-[11px] text-charcoal/50 pt-1">
                Payment: Cash on Delivery
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3.5 rounded-full bg-navy text-cream text-sm font-medium tracking-wide uppercase hover:bg-rosegold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Placing order…" : `Place order · ${formatPrice(total)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Field = ({ name, label, value, onChange, type = "text" }) => (
  <label className="block">
    <span className="text-[11px] uppercase tracking-wider text-charcoal/60 font-medium">
      {label}
    </span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-charcoal/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rosegold/30 focus:border-rosegold transition"
    />
  </label>
);

const Row = ({ label, value, bold = false }) => (
  <div className={`flex items-center justify-between ${bold ? "font-semibold text-base pt-1" : "text-charcoal/70"}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default BuyNowModal;
