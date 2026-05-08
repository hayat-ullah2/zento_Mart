import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../lib/api";
import { formatPrice } from "../../hooks/usePriceFormat";
import { useToast } from "../../context/ToastContext";

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-100 text-amber-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-indigo-100 text-indigo-700",
    Delivered: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-red-100 text-red-700",
    Refunded: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const AdminOrderDetail = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const { data, loading, refetch } = useFetch(`/orders/${id}`);
  const order = data?.order;
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      await api.put(`/orders/${id}`, { status });
      showToast(`Status updated to "${status}"`, "success");
      refetch();
    } catch (err) {
      showToast(err.message || "Update failed", "error");
    } finally {
      setUpdating(false);
    }
  };

  const saveTracking = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.put(`/orders/${id}`, {
        tracking: {
          number: formData.get("number"),
          carrier: formData.get("carrier"),
        },
      });
      showToast("Tracking saved & customer notified", "success");
      refetch();
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-charcoal/60">
          <span className="w-5 h-5 rounded-full border-2 border-rosegold/20 border-t-rosegold animate-spin" />
          Loading order…
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="font-serif text-3xl text-navy mb-2">Order not found</h2>
        <Link to="/admin/orders" className="text-rosegold hover:underline">
          ← Back to orders
        </Link>
      </div>
    );
  }

  const timeline = [
    { label: "Order placed", date: new Date(order.createdAt).toLocaleDateString(), done: true },
    { label: "Payment confirmed", date: new Date(order.createdAt).toLocaleDateString(), done: order.payment?.status === "Paid" },
    { label: "Processing", date: "—", done: ["Processing", "Shipped", "Delivered"].includes(order.status) },
    { label: "Shipped", date: "—", done: ["Shipped", "Delivered"].includes(order.status) },
    { label: "Delivered", date: "—", done: order.status === "Delivered" },
  ];

  return (
    <div className="space-y-6">
      <Link to="/admin/orders" className="text-xs text-rosegold hover:underline">
        ← Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy">Order #{order.code}</h1>
          <p className="text-charcoal/60 text-sm mt-1 flex items-center gap-3">
            Placed on {new Date(order.createdAt).toLocaleDateString()} <StatusBadge status={order.status} />
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => showToast("Invoice downloaded", "success")}
            className="px-4 py-2.5 rounded-full border border-charcoal/15 text-sm hover:border-rosegold transition"
          >
            Print Invoice
          </button>
          <button
            onClick={() => updateStatus("Refunded")}
            disabled={updating}
            className="px-4 py-2.5 rounded-full border border-red-200 text-red-600 text-sm hover:bg-red-50 transition disabled:opacity-60"
          >
            Issue Refund
          </button>
          <select
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updating}
            className="px-4 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition"
          >
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden">
            <div className="p-5 border-b border-charcoal/5">
              <h3 className="font-serif text-xl text-navy">Items ({order.items.length})</h3>
            </div>
            <ul className="divide-y divide-charcoal/5">
              {order.items.map((it, i) => (
                <li key={i} className="p-5 flex items-center gap-4">
                  <div className="w-16 h-20 rounded-lg bg-blush/30 shrink-0">
                    <img
                      src={it.image || `https://picsum.photos/seed/o${i}/200/250`}
                      alt={it.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal line-clamp-1">{it.name}</p>
                    <p className="text-xs text-charcoal/60 mt-0.5">
                      {it.color} · Size {it.size} · Qty {it.qty}
                    </p>
                  </div>
                  <span className="text-charcoal font-medium">{formatPrice(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="p-5 bg-cream/40 border-t border-charcoal/5 space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(order.subtotal)} />
              <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatPrice(order.shipping)} />
              <Row label="Tax" value={formatPrice(order.tax)} />
              <div className="flex justify-between pt-2 border-t border-charcoal/10 font-serif text-lg text-navy">
                <span>Total</span>
                <span className="font-semibold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-soft border border-charcoal/5">
            <h3 className="font-serif text-xl text-navy mb-5">Order Timeline</h3>
            <ol className="space-y-4">
              {timeline.map((t, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      t.done ? "bg-rosegold text-white" : "bg-cream border border-charcoal/15 text-charcoal/30"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${t.done ? "text-charcoal" : "text-charcoal/40"}`}>
                      {t.label}
                    </p>
                    <p className="text-xs text-charcoal/50">{t.date}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-soft border border-charcoal/5">
            <h3 className="font-serif text-lg text-navy mb-4">Customer</h3>
            <div className="flex items-center gap-3 mb-4">
              {order.customer.avatar && (
                <img src={order.customer.avatar} alt="" className="w-12 h-12 rounded-full" />
              )}
              <div>
                <p className="font-medium text-charcoal text-sm">{order.customer.name}</p>
                <p className="text-xs text-charcoal/60">{order.customer.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-soft border border-charcoal/5">
            <h3 className="font-serif text-lg text-navy mb-3">Tracking</h3>
            <form onSubmit={saveTracking} className="space-y-3">
              <input
                name="number"
                placeholder="Tracking number"
                defaultValue={order.tracking?.number || ""}
                className="input"
              />
              <select name="carrier" defaultValue={order.tracking?.carrier || ""} className="input">
                <option value="">Select carrier...</option>
                <option>UPS</option>
                <option>FedEx</option>
                <option>DHL</option>
                <option>USPS</option>
              </select>
              <button type="submit" className="w-full py-2.5 rounded-full bg-rosegold text-white text-sm hover:bg-rosegold-dark transition">
                Save & Notify Customer
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-charcoal/70">{label}</span>
    <span className="text-charcoal font-medium">{value}</span>
  </div>
);

export default AdminOrderDetail;
