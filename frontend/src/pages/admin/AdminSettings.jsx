import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

const TABS = [
  { id: "store", label: "Store Profile" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "tax", label: "Tax" },
  { id: "notifications", label: "Notifications" },
  { id: "staff", label: "Staff & Roles" },
  { id: "theme", label: "Theme" },
];

const AdminSettings = () => {
  const { showToast } = useToast();
  const [active, setActive] = useState("store");
  const { data, loading, refetch } = useFetch("/settings");
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (data?.settings) setForm(data.settings);
  }, [data]);

  const update = (path, value) => {
    setForm((prev) => {
      const next = JSON.parse(JSON.stringify(prev || {}));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = obj[keys[i]] || {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put("/settings", form);
      showToast("Settings saved", "success");
      refetch();
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    }
  };

  if (loading || !form) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-charcoal/60">
          <span className="w-5 h-5 rounded-full border-2 border-rosegold/20 border-t-rosegold animate-spin" />
          Loading settings…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-navy">Settings</h1>
        <p className="text-charcoal/60 text-sm mt-1">Configure your store from one place.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <nav className="bg-white rounded-2xl p-3 shadow-soft border border-charcoal/5 lg:sticky lg:top-24 self-start">
          <ul className="space-y-1">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setActive(t.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition ${
                    active === t.id
                      ? "bg-rosegold/10 text-rosegold-dark font-medium"
                      : "text-charcoal/70 hover:bg-cream"
                  }`}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-charcoal/5">
          {active === "store" && (
            <form onSubmit={save} className="space-y-5">
              <h2 className="font-serif text-2xl text-navy">Store Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Store Name">
                  <input className="input" value={form.store?.name || ""} onChange={(e) => update("store.name", e.target.value)} />
                </Field>
                <Field label="Support Email">
                  <input className="input" value={form.store?.email || ""} onChange={(e) => update("store.email", e.target.value)} />
                </Field>
              </div>
              <Field label="Tagline">
                <input className="input" value={form.store?.tagline || ""} onChange={(e) => update("store.tagline", e.target.value)} />
              </Field>
              <Field label="Address">
                <textarea className="input resize-none" rows="3" value={form.store?.address || ""} onChange={(e) => update("store.address", e.target.value)} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Phone">
                  <input className="input" value={form.store?.phone || ""} onChange={(e) => update("store.phone", e.target.value)} />
                </Field>
                <Field label="Currency">
                  <select className="input" value={form.store?.currency || "PKR"} onChange={(e) => update("store.currency", e.target.value)}>
                    <option value="PKR">PKR - Pakistani Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </Field>
              </div>
              <SaveBar />
            </form>
          )}

          {active === "shipping" && (
            <form onSubmit={save} className="space-y-5">
              <h2 className="font-serif text-2xl text-navy">Shipping</h2>
              <Field label="Free shipping threshold (Rs.)">
                <input type="number" className="input" value={form.shipping?.freeOver || 0} onChange={(e) => update("shipping.freeOver", Number(e.target.value))} />
              </Field>
              <Field label="Standard shipping rate (Rs.)">
                <input type="number" className="input" value={form.shipping?.standard || 0} onChange={(e) => update("shipping.standard", Number(e.target.value))} />
              </Field>
              <Field label="Express shipping rate (Rs.)">
                <input type="number" className="input" value={form.shipping?.express || 0} onChange={(e) => update("shipping.express", Number(e.target.value))} />
              </Field>
              <Field label="Shipping zones">
                <textarea className="input resize-none" rows="4" value={form.shipping?.zones || ""} onChange={(e) => update("shipping.zones", e.target.value)} />
              </Field>
              <SaveBar />
            </form>
          )}

          {active === "payment" && (
            <form onSubmit={save} className="space-y-5">
              <h2 className="font-serif text-2xl text-navy">Payment Methods</h2>
              <div className="space-y-3">
                {[
                  { key: "cashOnDelivery", label: "Cash on Delivery" },
                  { key: "bankTransfer", label: "Bank Transfer" },
                  { key: "easypaisa", label: "Easypaisa" },
                  { key: "jazzcash", label: "JazzCash" },
                ].map((p) => (
                  <Toggle
                    key={p.key}
                    label={p.label}
                    checked={!!form.payment?.[p.key]}
                    onChange={(v) => update(`payment.${p.key}`, v)}
                  />
                ))}
              </div>
              <SaveBar />
            </form>
          )}

          {active === "tax" && (
            <form onSubmit={save} className="space-y-5">
              <h2 className="font-serif text-2xl text-navy">Tax Rates</h2>
              <p className="text-xs text-charcoal/60">
                Pakistan GST is typically 17%. Set to 0 to absorb tax into product pricing.
              </p>
              <Field label="Default rate (%)">
                <input type="number" step="0.1" className="input" value={form.tax?.defaultRate ?? 0} onChange={(e) => update("tax.defaultRate", Number(e.target.value))} />
              </Field>
              <Toggle label="Apply tax to shipping" checked={!!form.tax?.applyToShipping} onChange={(v) => update("tax.applyToShipping", v)} />
              <SaveBar />
            </form>
          )}

          {active === "notifications" && (
            <form onSubmit={save} className="space-y-5">
              <h2 className="font-serif text-2xl text-navy">Email Notifications</h2>
              <div className="space-y-3">
                {[
                  { key: "orderPlacedAdmin", label: "Order placed — to admin" },
                  { key: "orderPlacedCustomer", label: "Order placed — to customer" },
                  { key: "orderShipped", label: "Order shipped — to customer" },
                  { key: "orderDelivered", label: "Order delivered — to customer" },
                  { key: "lowStock", label: "Low stock alert" },
                  { key: "newReview", label: "New review submitted" },
                  { key: "weeklyDigest", label: "Weekly sales digest" },
                ].map((n) => (
                  <Toggle
                    key={n.key}
                    label={n.label}
                    checked={!!form.notifications?.[n.key]}
                    onChange={(v) => update(`notifications.${n.key}`, v)}
                  />
                ))}
              </div>
              <SaveBar />
            </form>
          )}

          {active === "staff" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-2xl text-navy">Staff & Roles</h2>
                <button className="px-4 py-2 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition">
                  + Add Member
                </button>
              </div>
              <p className="text-sm text-charcoal/60">
                Run <code className="text-rosegold">npm run seed:admin</code> on the backend to add seeded staff. A
                full UI for inviting team members will arrive in a future release.
              </p>
            </div>
          )}

          {active === "theme" && (
            <form onSubmit={save} className="space-y-5">
              <h2 className="font-serif text-2xl text-navy">Theme</h2>
              <Field label="Primary brand color">
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={form.theme?.primaryColor || "#6a5b5e"}
                    onChange={(e) => update("theme.primaryColor", e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    className="input"
                    value={form.theme?.primaryColor || ""}
                    onChange={(e) => update("theme.primaryColor", e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Heading font">
                <select
                  className="input"
                  value={form.theme?.headingFont || "Noto Serif"}
                  onChange={(e) => update("theme.headingFont", e.target.value)}
                >
                  <option>Noto Serif</option>
                  <option>Playfair Display</option>
                  <option>Cormorant Garamond</option>
                  <option>DM Serif Display</option>
                </select>
              </Field>
              <SaveBar />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-xs uppercase tracking-widest text-charcoal/60 mb-1.5">{label}</span>
    {children}
  </label>
);

const Toggle = ({ label, checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="flex items-center justify-between w-full p-3 rounded-xl border border-charcoal/10 hover:border-rosegold/40 transition text-left"
  >
    <span className="text-sm text-charcoal">{label}</span>
    <span className={`relative w-11 h-6 rounded-full transition ${checked ? "bg-rosegold" : "bg-charcoal/20"}`}>
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </span>
  </button>
);

const SaveBar = () => (
  <div className="flex justify-end pt-4 border-t border-charcoal/10">
    <button
      type="submit"
      className="px-6 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft"
    >
      Save Changes
    </button>
  </div>
);

export default AdminSettings;
