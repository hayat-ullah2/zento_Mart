import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { formatPrice } from "../../hooks/usePriceFormat";
import { SearchAdminIcon } from "../../components/admin/AdminIcons";

const tagStyle = {
  VIP: "bg-rosegold/15 text-rosegold-dark",
  Loyal: "bg-emerald-100 text-emerald-700",
  New: "bg-blue-100 text-blue-700",
  "At-risk": "bg-amber-100 text-amber-700",
};

const AdminCustomers = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const { data, loading } = useFetch("/customers");
  const customers = data?.customers || [];

  const tags = ["All", "VIP", "Loyal", "New", "At-risk"];

  const filtered = customers.filter((c) => {
    const matchesTag = filter === "All" || c.tag === filter;
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const totalSpent = customers.reduce((sum, c) => sum + (c.spent || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy">Customers</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            {loading ? "Loading…" : `${customers.length} customers · ${formatPrice(totalSpent)} lifetime revenue`}
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft">
          Export CSV
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition ${
              filter === t
                ? "bg-navy text-cream border-navy"
                : "bg-white border-charcoal/15 text-charcoal hover:border-rosegold"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-soft border border-charcoal/5 flex gap-3">
        <div className="relative flex-1">
          <SearchAdminIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-cream border border-transparent focus:outline-none focus:ring-2 focus:ring-rosegold/30 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/50 text-xs uppercase tracking-widest text-charcoal/50">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Customer</th>
                <th className="px-5 py-3 text-left font-medium">Location</th>
                <th className="px-5 py-3 text-left font-medium">Orders</th>
                <th className="px-5 py-3 text-left font-medium">Total Spent</th>
                <th className="px-5 py-3 text-left font-medium">Joined</th>
                <th className="px-5 py-3 text-left font-medium">Tag</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-charcoal/60">
                    Loading customers…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-charcoal/60 italic">
                    No customers match
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-cream/30 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {c.avatar && <img src={c.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />}
                        <div>
                          <Link
                            to={`/admin/customers/${c._id}`}
                            className="font-medium text-charcoal hover:text-rosegold"
                          >
                            {c.name}
                          </Link>
                          <p className="text-xs text-charcoal/50">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-charcoal/80">{c.location}</td>
                    <td className="px-5 py-3.5 text-charcoal/80">{c.orders}</td>
                    <td className="px-5 py-3.5 font-medium text-charcoal">{formatPrice(c.spent)}</td>
                    <td className="px-5 py-3.5 text-charcoal/70">
                      {c.joined ? new Date(c.joined).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${tagStyle[c.tag]}`}>
                        {c.tag}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/admin/customers/${c._id}`}
                        className="text-xs text-rosegold hover:underline"
                      >
                        View →
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

export default AdminCustomers;
