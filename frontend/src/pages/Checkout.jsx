import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../hooks/usePriceFormat";
import { api } from "../lib/api";
import Breadcrumb from "../components/Breadcrumb";
import { CheckIcon, ShieldIcon, TruckIcon } from "../components/Icons";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    country: "Pakistan",
    phone: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Express shipping in Pakistan: Rs. 500 flat
  const expressShipping = shippingMethod === "express" ? 500 : shipping;
  const grandTotal = subtotal + expressShipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-32 px-4">
        <h1 className="font-serif text-4xl text-navy mb-3">Your bag is empty</h1>
        <p className="text-charcoal/60 mb-8">Add a piece to begin checkout.</p>
        <Link
          to="/products"
          className="inline-block px-7 py-3.5 rounded-full bg-rosegold text-white font-medium hover:bg-rosegold-dark transition"
        >
          Shop Handbags
        </Link>
      </div>
    );
  }

  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (placing) return;
    setPlacing(true);

    // Build the order payload to match the backend Order model
    const payload = {
      customer: {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        avatar: `https://picsum.photos/seed/${encodeURIComponent(form.email || "guest")}/100`,
      },
      shippingAddress: {
        line1: form.address,
        line2: form.apt,
        city: form.city,
        state: form.state,
        zip: form.zip,
        country: form.country || "Pakistan",
        phone: form.phone,
      },
      items: items.map((it) => ({
        productId: it.id,
        name: it.name,
        color: it.color,
        size: it.size,
        qty: it.quantity,
        price: it.price,
        image: it.image,
      })),
      subtotal,
      shipping: expressShipping,
      tax,
      total: grandTotal,
      payment: { method: "Cash on Delivery", status: "Pending" },
    };

    try {
      const data = await api.post("/orders", payload);
      const code = data?.order?.code || "";
      showToast(
        `Order ${code ? "#" + code + " " : ""}placed — we'll be in touch soon! 🛍️`,
        "success",
        4500
      );
      clearCart();
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      showToast(err.message || "Could not place the order. Please try again.", "error");
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Cart", to: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <h1 className="font-serif text-4xl sm:text-5xl text-navy mt-6 mb-3">Checkout</h1>

      {/* Step indicator — Payment removed (Cash on Delivery only, no payment step needed) */}
      <div className="flex items-center gap-2 mb-10 text-sm">
        {["Information", "Shipping"].map((label, idx, arr) => {
          const i = idx + 1;
          const active = step === i;
          const done = step > i;
          return (
            <div key={label} className="flex items-center">
              <div
                className={`flex items-center gap-2 ${
                  active ? "text-rosegold" : done ? "text-charcoal" : "text-charcoal/40"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                    active
                      ? "bg-rosegold text-white"
                      : done
                      ? "bg-navy text-cream"
                      : "border border-charcoal/20"
                  }`}
                >
                  {done ? <CheckIcon className="w-3.5 h-3.5" /> : i}
                </span>
                <span className="hidden sm:inline tracking-wide">{label}</span>
              </div>
              {idx < arr.length - 1 && (
                <div className="w-6 sm:w-12 h-px bg-charcoal/15 mx-2" />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: form */}
        <div className="lg:col-span-2 space-y-8">
          {/* CONTACT */}
          <Section title="Contact Information">
            <Field label="Email">
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Phone">
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input"
                placeholder="(555) 555-0117"
              />
            </Field>
          </Section>

          {/* SHIPPING */}
          <Section title="Shipping Address">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name">
                <input
                  required
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="input"
                />
              </Field>
              <Field label="Last name">
                <input
                  required
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="input"
                />
              </Field>
            </div>
            <Field label="Address">
              <input
                required
                name="address"
                value={form.address}
                onChange={handleChange}
                className="input"
                placeholder="Street address"
              />
            </Field>
            <Field label="Apt, suite (optional)">
              <input name="apt" value={form.apt} onChange={handleChange} className="input" />
            </Field>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="City">
                <input
                  required
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="input"
                />
              </Field>
              <Field label="State">
                <input
                  required
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="input"
                />
              </Field>
              <Field label="ZIP">
                <input
                  required
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  className="input"
                />
              </Field>
            </div>
          </Section>

          {/* SHIPPING METHOD */}
          <Section title="Shipping Method">
            <div className="space-y-3">
              <RadioCard
                checked={shippingMethod === "standard"}
                onChange={() => setShippingMethod("standard")}
                title="Standard Delivery"
                desc="3–5 business days"
                price={subtotal > 5000 ? "Free" : formatPrice(250)}
              />
              <RadioCard
                checked={shippingMethod === "express"}
                onChange={() => setShippingMethod("express")}
                title="Express Delivery"
                desc="1–2 business days"
                price={formatPrice(500)}
              />
            </div>
          </Section>

          {/* PAYMENT — Cash on Delivery only (Pakistan) */}
          <Section title="Payment Method">
            <div className="rounded-2xl border-2 border-rosegold bg-blush/30 p-5 flex items-start gap-4">
              <span className="mt-1 w-5 h-5 rounded-full border-2 border-rosegold flex items-center justify-center shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rosegold" />
              </span>
              <div className="flex-1">
                <p className="font-medium text-charcoal flex items-center gap-2">
                  <TruckIcon className="w-5 h-5 text-rosegold" />
                  Cash on Delivery
                </p>
                <p className="text-sm text-charcoal/70 mt-1.5 leading-relaxed">
                  Pay in cash when your order arrives at your doorstep — no advance
                  payment required. Our courier will collect the amount upon delivery.
                </p>
                <ul className="mt-3 space-y-1 text-xs text-charcoal/60">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    Available across all major cities in Pakistan
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    Inspect your order before paying
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    Easy returns within 30 days
                  </li>
                </ul>
              </div>
            </div>
          </Section>
        </div>

        {/* RIGHT: summary */}
        <aside className="lg:sticky lg:top-28 self-start">
          <div className="bg-white rounded-3xl shadow-soft p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-navy mb-5">Order Summary</h2>

            <ul className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-5">
              {items.map((it) => (
                <li key={it.key} className="flex gap-3">
                  <div className="relative w-14 h-16 rounded-xl overflow-hidden shrink-0 bg-blush/30">
                    <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 bg-navy text-cream text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {it.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal line-clamp-1">{it.name}</p>
                    <p className="text-xs text-charcoal/60">
                      {it.color} · {it.size}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-charcoal whitespace-nowrap">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 text-sm border-t border-rosegold/15 pt-4">
              <div className="flex justify-between">
                <span className="text-charcoal/70">Subtotal</span>
                <span className="text-charcoal font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/70">Shipping</span>
                <span className="text-charcoal font-medium">
                  {expressShipping === 0 ? "Free" : formatPrice(expressShipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/70">Tax</span>
                <span className="text-charcoal font-medium">{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="border-t border-rosegold/15 mt-4 pt-4 flex justify-between items-baseline">
              <span className="font-serif text-lg text-navy">Total</span>
              <span className="font-serif text-2xl text-navy font-semibold">
                {formatPrice(grandTotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="w-full mt-6 py-4 rounded-full bg-rosegold text-white font-medium hover:bg-rosegold-dark transition shadow-luxury disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {placing ? "Placing order…" : "Place Order"}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-charcoal/60">
              <ShieldIcon className="w-4 h-4 text-emerald-600" />
              Secure SSL encrypted checkout
            </div>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-charcoal/60">
              <TruckIcon className="w-4 h-4 text-rosegold" />
              Free 30-day returns
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section className="bg-white rounded-3xl shadow-soft p-6 sm:p-8 space-y-5">
    <h2 className="font-serif text-2xl text-navy">{title}</h2>
    {children}
  </section>
);

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-xs uppercase tracking-widest text-charcoal/60 mb-1.5">{label}</span>
    {children}
  </label>
);

const RadioCard = ({ checked, onChange, title, desc, price }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition text-left ${
      checked
        ? "border-rosegold bg-blush/20"
        : "border-charcoal/10 hover:border-rosegold/40"
    }`}
  >
    <div className="flex items-center gap-4">
      <span
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
          checked ? "border-rosegold" : "border-charcoal/30"
        }`}
      >
        {checked && <span className="w-2.5 h-2.5 rounded-full bg-rosegold" />}
      </span>
      <div>
        <p className="font-medium text-charcoal text-sm">{title}</p>
        <p className="text-xs text-charcoal/60">{desc}</p>
      </div>
    </div>
    <span className="text-sm font-medium text-charcoal">{price}</span>
  </button>
);

export default Checkout;
