import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { formatPrice } from "../../hooks/usePriceFormat";
import StatCard from "../../components/admin/StatCard";
import { LineChart, DonutChart } from "../../components/admin/Charts";
import {
  BoxIcon,
  OrderIcon,
  RevenueIcon,
  UsersIcon,
} from "../../components/admin/AdminIcons";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { admin } = useAuth();
  const { data: dash, loading: dashLoading } = useFetch("/analytics/dashboard");
  const { data: sales } = useFetch("/analytics/sales?days=14");
  const { data: traffic } = useFetch("/analytics/traffic-sources");

  if (dashLoading || !dash) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-charcoal/60">
          <span className="w-5 h-5 rounded-full border-2 border-rosegold/20 border-t-rosegold animate-spin" />
          Loading dashboard…
        </div>
      </div>
    );
  }

  const { kpis, alerts, recentOrders, topProducts } = dash;
  const dailySales = sales?.data || [];
  const totalRevenue = dailySales.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Welcome row */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy">Hello, {admin?.name?.split(" ")[0]} ✨</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            Here's what's happening at ZentoMart today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/products/new"
            className="px-4 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft"
          >
            + Add Product
          </Link>
          <button className="px-4 py-2.5 rounded-full border border-charcoal/15 text-sm hover:border-rosegold transition">
            Export Report
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={RevenueIcon}
          label="Today's Revenue"
          value={formatPrice(kpis.todayRevenue)}
          change={kpis.revenueChange}
          trend={kpis.revenueChange >= 0 ? "up" : "down"}
          accent="rosegold"
        />
        <StatCard
          icon={OrderIcon}
          label="Today's Orders"
          value={kpis.todayOrders}
          accent="navy"
        />
        <StatCard
          icon={UsersIcon}
          label="Customers"
          value={kpis.customerCount}
          accent="emerald"
        />
        <StatCard
          icon={BoxIcon}
          label="Catalog"
          value={kpis.productCount}
          accent="amber"
        />
      </div>

      {/* Chart + Donut */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-soft border border-charcoal/5">
          <div className="flex justify-between items-end mb-5 flex-wrap gap-2">
            <div>
              <h3 className="font-serif text-xl text-navy">Revenue Trend</h3>
              <p className="text-xs text-charcoal/50">
                {formatPrice(totalRevenue)} earned over the last {dailySales.length} days
              </p>
            </div>
          </div>
          {dailySales.length > 0 ? (
            <LineChart data={dailySales} valueKey="revenue" />
          ) : (
            <p className="text-sm text-charcoal/50 italic py-12 text-center">
              No sales data yet — orders will populate this chart.
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-soft border border-charcoal/5">
          <h3 className="font-serif text-xl text-navy mb-1">Traffic Sources</h3>
          <p className="text-xs text-charcoal/50 mb-5">Where your customers come from</p>
          {traffic?.sources && <DonutChart data={traffic.sources} size={180} />}
        </div>
      </div>

      {/* Recent orders + Top sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-charcoal/5">
            <h3 className="font-serif text-xl text-navy">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-rosegold hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream/50 text-xs uppercase tracking-widest text-charcoal/50">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Order</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Total</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {recentOrders?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-charcoal/50 italic">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders?.map((o) => (
                    <tr key={o._id} className="hover:bg-cream/40 transition">
                      <td className="px-5 py-3.5 font-medium text-charcoal">#{o.code}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {o.customer.avatar && (
                            <img src={o.customer.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                          )}
                          <span className="text-charcoal/80">{o.customer.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/80">{formatPrice(o.total)}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-soft border border-charcoal/5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-serif text-xl text-navy">Top Sellers</h3>
            <Link to="/admin/products" className="text-xs text-rosegold hover:underline">
              All →
            </Link>
          </div>
          <ul className="space-y-3">
            {topProducts?.map((p, i) => (
              <li
                key={p._id}
                className="flex items-center gap-3 hover:bg-cream/40 -mx-2 p-2 rounded-xl transition"
              >
                <span className="w-5 h-5 text-xs rounded-full bg-rosegold/10 text-rosegold flex items-center justify-center font-medium">
                  {i + 1}
                </span>
                <img src={p.mainImage} alt={p.name} className="w-12 h-14 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/admin/products/${p.id}`}
                    className="font-medium text-charcoal text-sm leading-tight line-clamp-1 hover:text-rosegold"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-charcoal/50">{p.reviews} reviews</p>
                </div>
                <span className="text-sm font-semibold text-charcoal">{formatPrice(p.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <AlertPanel
          title="Low Stock"
          subtitle={`${alerts.lowStock.length} products with ≤10 units`}
          items={alerts.lowStock}
          emptyText="All inventory healthy"
          tone="amber"
        />
        <AlertPanel
          title="Out of Stock"
          subtitle={`${alerts.outOfStock.length} products to restock`}
          items={alerts.outOfStock}
          emptyText="No products are out of stock"
          tone="red"
        />
      </div>
    </div>
  );
};

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
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

const AlertPanel = ({ title, subtitle, items, emptyText, tone }) => {
  const toneCls = {
    amber: "from-amber-50 to-amber-100/40 text-amber-700",
    red: "from-red-50 to-red-100/40 text-red-700",
  };
  return (
    <div className={`rounded-2xl p-5 shadow-soft border border-charcoal/5 bg-gradient-to-br ${toneCls[tone]}`}>
      <h4 className="font-serif text-xl mb-1">{title}</h4>
      <p className="text-xs opacity-70 mb-4">{subtitle}</p>
      {items.length === 0 ? (
        <p className="text-sm opacity-60 italic">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((p) => (
            <li key={p._id || p.id} className="flex items-center gap-3 bg-white/60 rounded-xl p-2">
              <img src={p.mainImage} alt="" className="w-9 h-11 object-cover rounded-md" />
              <div className="flex-1 min-w-0">
                <Link to={`/admin/products/${p.id}`} className="text-sm font-medium text-charcoal line-clamp-1 hover:underline">
                  {p.name}
                </Link>
                <p className="text-xs text-charcoal/60">{p.stock} units</p>
              </div>
              <Link to={`/admin/products/${p.id}`} className="text-xs text-rosegold hover:underline">
                Restock
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
