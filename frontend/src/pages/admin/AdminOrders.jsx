import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { formatPrice } from "../../hooks/usePriceFormat";
import { EyeIcon, SearchAdminIcon } from "../../components/admin/AdminIcons";

const STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

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
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const AdminOrders = () => {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const { data, loading } = useFetch("/orders");
  const orders = data?.orders || [];

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = s === "All" ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const filtered = orders.filter((o) => {
    const matchesTab = tab === "All" || o.status === tab;
    const matchesSearch =
      !search ||
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy">Orders</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            {loading ? "Loading…" : `${orders.length} total orders`}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 rounded-full border border-charcoal/15 text-sm hover:border-rosegold transition">
            Export CSV
          </button>
          <button className="px-4 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft">
            + Manual Order
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition ${
              tab === s
                ? "bg-navy text-cream border-navy"
                : "bg-white border-charcoal/15 text-charcoal hover:border-rosegold"
            }`}
          >
            {s}
            <span className={`ml-2 text-xs ${tab === s ? "text-cream/70" : "text-charcoal/50"}`}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-soft border border-charcoal/5 flex gap-3 items-center">
        <div className="relative flex-1">
          <SearchAdminIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-cream border border-transparent focus:outline-none focus:ring-2 focus:ring-rosegold/30 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/50 text-xs uppercase tracking-widest text-charcoal/50">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Order</th>
                <th className="px-5 py-3 text-left font-medium">Customer</th>
                <th className="px-5 py-3 text-left font-medium">Items</th>
                <th className="px-5 py-3 text-left font-medium">Total</th>
                <th className="px-5 py-3 text-left font-medium">Date</th>
                <th className="px-5 py-3 text-left font-medium">Payment</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-charcoal/60">
                    <div className="inline-flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full border-2 border-rosegold/20 border-t-rosegold animate-spin" />
                      Loading orders…
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-charcoal/60 italic">
                    No orders match this view
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o._id} className="hover:bg-cream/30 transition">
                    <td className="px-5 py-3.5 font-medium text-charcoal">#{o.code}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {o.customer.avatar && (
                          <img src={o.customer.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                        )}
                        <div className="min-w-0">
                          <p className="text-charcoal text-sm">{o.customer.name}</p>
                          <p className="text-xs text-charcoal/50 truncate">{o.customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-charcoal/80">
                      {o.items.length} item{o.items.length > 1 ? "s" : ""}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-charcoal">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3.5 text-charcoal/70">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs ${
                          o.payment?.status === "Paid" ? "text-emerald-600" : "text-charcoal/60"
                        }`}
                      >
                        {o.payment?.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/admin/orders/${o.code}`}
                        className="inline-flex items-center gap-1 text-xs text-rosegold hover:underline"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
