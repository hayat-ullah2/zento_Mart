import { Link, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { formatPrice } from "../../hooks/usePriceFormat";

const AdminCustomerDetail = () => {
  const { id } = useParams();
  const { data, loading } = useFetch(`/customers/${id}`);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-charcoal/60">
          <span className="w-5 h-5 rounded-full border-2 border-rosegold/20 border-t-rosegold animate-spin" />
          Loading customer…
        </div>
      </div>
    );
  }

  if (!data?.customer) {
    return (
      <div className="text-center py-20">
        <h2 className="font-serif text-3xl text-navy mb-2">Customer not found</h2>
        <Link to="/admin/customers" className="text-rosegold hover:underline">
          ← Back to customers
        </Link>
      </div>
    );
  }

  const customer = data.customer;
  const customerOrders = data.orders || [];

  return (
    <div className="space-y-6">
      <Link to="/admin/customers" className="text-xs text-rosegold hover:underline">
        ← Back to Customers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-charcoal/5 text-center">
            {customer.avatar && (
              <img src={customer.avatar} alt="" className="w-24 h-24 rounded-full mx-auto ring-4 ring-rosegold/30 mb-4" />
            )}
            <h2 className="font-serif text-2xl text-navy">{customer.name}</h2>
            <p className="text-sm text-charcoal/60 mt-1">{customer.email}</p>
            {customer.location && <p className="text-xs text-charcoal/50 mt-1">{customer.location}</p>}
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-rosegold/15 text-rosegold-dark text-xs font-medium">
                {customer.tag}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-charcoal/10">
              <div>
                <p className="font-serif text-2xl text-navy font-semibold">{customer.orders}</p>
                <p className="text-xs text-charcoal/50 uppercase tracking-widest">Orders</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-navy font-semibold">{formatPrice(customer.spent)}</p>
                <p className="text-xs text-charcoal/50 uppercase tracking-widest">LTV</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden">
            <div className="p-5 border-b border-charcoal/5">
              <h3 className="font-serif text-xl text-navy">Order History</h3>
            </div>
            {customerOrders.length === 0 ? (
              <p className="p-6 text-charcoal/60 italic text-sm">No orders yet from this customer.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-cream/50 text-xs uppercase tracking-widest text-charcoal/50">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">Order</th>
                    <th className="px-5 py-3 text-left font-medium">Date</th>
                    <th className="px-5 py-3 text-left font-medium">Items</th>
                    <th className="px-5 py-3 text-left font-medium">Total</th>
                    <th className="px-5 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {customerOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-cream/30">
                      <td className="px-5 py-3.5">
                        <Link to={`/admin/orders/${o.code}`} className="text-rosegold hover:underline">
                          #{o.code}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/70">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/80">{o.items.length}</td>
                      <td className="px-5 py-3.5 font-medium">{formatPrice(o.total)}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-charcoal/70">{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerDetail;
