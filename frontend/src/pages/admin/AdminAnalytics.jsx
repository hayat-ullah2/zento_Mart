import { useFetch } from "../../hooks/useFetch";
import { formatPrice } from "../../hooks/usePriceFormat";
import { LineChart, DonutChart, BarMini } from "../../components/admin/Charts";
import StatCard from "../../components/admin/StatCard";
import {
  ChartIcon,
  OrderIcon,
  RevenueIcon,
  UsersIcon,
} from "../../components/admin/AdminIcons";

const AdminAnalytics = () => {
  const { data: sales } = useFetch("/analytics/sales?days=14");
  const { data: traffic } = useFetch("/analytics/traffic-sources");
  const { data: top } = useFetch("/analytics/top-products?limit=5");

  const dailySales = sales?.data || [];
  const topByRevenue = top?.products || [];
  const totalRevenue = dailySales.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = dailySales.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy">Analytics</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            How your store is performing — last 14 days
          </p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2.5 rounded-full bg-white border border-charcoal/15 text-sm">
            <option>Last 14 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Year to date</option>
          </select>
          <button className="px-4 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft">
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={RevenueIcon} label="Revenue" value={formatPrice(totalRevenue)} accent="rosegold" />
        <StatCard icon={OrderIcon} label="Orders" value={totalOrders} accent="navy" />
        <StatCard icon={UsersIcon} label="Visitors" value="12,840" change={6.8} accent="emerald" />
        <StatCard icon={ChartIcon} label="Conv. Rate" value="3.6%" change={-1.1} trend="down" accent="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-soft border border-charcoal/5">
          <h3 className="font-serif text-xl text-navy mb-1">Revenue & Orders</h3>
          <p className="text-xs text-charcoal/50 mb-5">Daily revenue trend</p>
          {dailySales.length > 0 ? (
            <LineChart data={dailySales} valueKey="revenue" />
          ) : (
            <p className="text-sm text-charcoal/50 italic py-12 text-center">
              No data available yet.
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-soft border border-charcoal/5">
          <h3 className="font-serif text-xl text-navy mb-1">Traffic Sources</h3>
          <p className="text-xs text-charcoal/50 mb-5">Visitor acquisition</p>
          {traffic?.sources && <DonutChart data={traffic.sources} />}
        </div>
      </div>

      {/* Conversion funnel */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-soft border border-charcoal/5">
        <h3 className="font-serif text-xl text-navy mb-1">Conversion Funnel</h3>
        <p className="text-xs text-charcoal/50 mb-5">Visitor journey from arrival to purchase</p>

        <div className="space-y-3">
          {[
            { label: "Site Visits", value: 12840, color: "#1c1b1b" },
            { label: "Product Views", value: 7320, color: "#6a5b5e" },
            { label: "Added to Cart", value: 1840, color: "#5e604d" },
            { label: "Reached Checkout", value: 720, color: "#735c00" },
            { label: "Purchased", value: 462, color: "#d5c2c6" },
          ].map((row, i, arr) => {
            const pct = (row.value / arr[0].value) * 100;
            return (
              <div key={row.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-charcoal/80">{row.label}</span>
                  <span className="text-charcoal font-medium">
                    {row.value.toLocaleString()}{" "}
                    <span className="text-charcoal/50">({pct.toFixed(1)}%)</span>
                  </span>
                </div>
                <div className="h-3 bg-cream rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: row.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden">
        <div className="p-5 border-b border-charcoal/5">
          <h3 className="font-serif text-xl text-navy">Top Products by Revenue</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-cream/50 text-xs uppercase tracking-widest text-charcoal/50">
            <tr>
              <th className="px-5 py-3 text-left font-medium">#</th>
              <th className="px-5 py-3 text-left font-medium">Product</th>
              <th className="px-5 py-3 text-left font-medium">Style</th>
              <th className="px-5 py-3 text-left font-medium">Trend</th>
              <th className="px-5 py-3 text-right font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {topByRevenue.map((p, i) => (
              <tr key={p._id} className="hover:bg-cream/30">
                <td className="px-5 py-3.5 text-charcoal/50 font-medium">{i + 1}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <img src={p.mainImage} alt="" className="w-9 h-11 object-cover rounded-md" />
                    <span className="text-charcoal font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-charcoal/70">{p.style}</td>
                <td className="px-5 py-3.5">
                  <BarMini values={[3, 5, 4, 7, 6, 8, 9, 7, 10, 12, 11, 14]} />
                </td>
                <td className="px-5 py-3.5 text-right font-medium">
                  {formatPrice(p.price * (p.reviews || 1))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAnalytics;
