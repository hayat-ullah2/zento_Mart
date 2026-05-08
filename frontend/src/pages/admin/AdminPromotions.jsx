import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import {
  PlusAdminIcon,
  TrashAdminIcon,
  EditIcon,
  CloseAdminIcon,
} from "../../components/admin/AdminIcons";

const AdminPromotions = () => {
  const { showToast } = useToast();
  const [tab, setTab] = useState("Active");
  const [showForm, setShowForm] = useState(false);
  const { data, loading, refetch } = useFetch("/promotions");
  const promotions = data?.promotions || [];

  const filtered = promotions.filter((p) => (tab === "All" ? true : p.status === tab));

  const handleDelete = async (id) => {
    try {
      await api.delete(`/promotions/${id}`);
      showToast("Coupon deleted", "success");
      refetch();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await api.post("/promotions", {
        code: fd.get("code"),
        type: fd.get("type"),
        value: Number(fd.get("value") || 0),
        minSpend: Number(fd.get("minSpend") || 0),
        limit: Number(fd.get("limit") || 0),
        expires: fd.get("expires") || undefined,
      });
      showToast("Coupon created", "success");
      setShowForm(false);
      refetch();
    } catch (err) {
      showToast(err.message || "Create failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy">Promotions & Coupons</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            {loading ? "Loading…" : `${promotions.length} codes total`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft"
        >
          <PlusAdminIcon className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      <div className="flex gap-2">
        {["All", "Active", "Scheduled", "Expired"].map((s) => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              tab === s
                ? "bg-navy text-cream border-navy"
                : "bg-white border-charcoal/15 text-charcoal hover:border-rosegold"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-2xl p-5 shadow-soft border border-charcoal/5 flex gap-4 items-start"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rosegold/15 to-rosegold/5 text-rosegold flex items-center justify-center font-serif text-xl">
              %
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <code className="font-mono font-medium text-navy text-base">{p.code}</code>
                <span
                  className={`text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full ${
                    p.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : p.status === "Expired"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <p className="text-sm text-charcoal/80">
                {p.type === "Free shipping" ? "Free shipping" : `${p.value}% off`}
                {p.minSpend > 0 && ` · Min. spend Rs. ${p.minSpend.toLocaleString("en-PK")}`}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-charcoal/60">
                <span>Used: {p.used}{p.limit > 0 && ` / ${p.limit}`}</span>
                {p.expires && <span>Expires: {new Date(p.expires).toLocaleDateString()}</span>}
              </div>
              {p.limit > 0 && (
                <div className="mt-2 h-1.5 bg-cream rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rosegold rounded-full"
                    style={{ width: `${Math.min(100, (p.used / p.limit) * 100)}%` }}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <button className="p-2 rounded-lg hover:bg-cream text-charcoal/60 hover:text-rosegold">
                <EditIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="p-2 rounded-lg hover:bg-red-50 text-charcoal/60 hover:text-red-600"
              >
                <TrashAdminIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-luxury animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-2xl text-navy">Create Coupon</h3>
              <button onClick={() => setShowForm(false)}>
                <CloseAdminIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <Field label="Code">
                <input name="code" className="input" placeholder="SUMMER20" required />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Type">
                  <select name="type" className="input">
                    <option>% off</option>
                    <option>$ off</option>
                    <option>Free shipping</option>
                  </select>
                </Field>
                <Field label="Value">
                  <input name="value" type="number" className="input" placeholder="20" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Min. Spend">
                  <input name="minSpend" type="number" className="input" placeholder="100" />
                </Field>
                <Field label="Usage Limit">
                  <input name="limit" type="number" className="input" placeholder="500" />
                </Field>
              </div>
              <Field label="Expires On">
                <input name="expires" type="date" className="input" />
              </Field>
              <button type="submit" className="w-full py-3 rounded-full bg-rosegold text-white font-medium hover:bg-rosegold-dark transition">
                Save Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-xs uppercase tracking-widest text-charcoal/60 mb-1.5">{label}</span>
    {children}
  </label>
);

export default AdminPromotions;
