import { useMemo, useState } from "react";
import { useProducts } from "../../context/ProductsContext";
import { useToast } from "../../context/ToastContext";
import StockIndicator from "../../components/StockIndicator";
import { SearchAdminIcon } from "../../components/admin/AdminIcons";

const AdminInventory = () => {
  const { products, updateProduct } = useProducts();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [edits, setEdits] = useState({}); // {productId: pendingStock}

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "in" && p.stock > 10) ||
        (filter === "low" && p.stock > 0 && p.stock <= 10) ||
        (filter === "out" && p.stock === 0);
      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outCount = products.filter((p) => p.stock === 0).length;

  const setPending = (id, value) =>
    setEdits((prev) => ({ ...prev, [id]: value }));

  const saveStock = async (p) => {
    const next = edits[p.id];
    if (next == null || next === p.stock) return;
    try {
      await updateProduct(p.id, { stock: Number(next), inStock: Number(next) > 0 });
      showToast(`Stock for "${p.name}" updated to ${next}`, "success");
      setEdits((prev) => {
        const { [p.id]: _, ...rest } = prev;
        return rest;
      });
    } catch (err) {
      showToast(err.message || "Stock update failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy">Inventory</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            {totalUnits.toLocaleString()} total units across {products.length} SKUs
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft">
          Bulk Import CSV
        </button>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Tile label="Total SKUs" value={products.length} accent="navy" />
        <Tile label="Healthy Stock" value={products.filter(p => p.stock > 10).length} accent="emerald" />
        <Tile label="Low Stock" value={lowCount} accent="amber" />
        <Tile label="Out of Stock" value={outCount} accent="red" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-soft border border-charcoal/5 flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[240px]">
          <SearchAdminIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-cream border border-transparent focus:outline-none focus:ring-2 focus:ring-rosegold/30 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: "all", label: "All" },
            { id: "in", label: "In Stock" },
            { id: "low", label: "Low" },
            { id: "out", label: "Out" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-medium transition ${
                filter === f.id
                  ? "bg-navy text-cream"
                  : "bg-cream text-charcoal hover:bg-rosegold/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/50 text-xs uppercase tracking-widest text-charcoal/50">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Product</th>
                <th className="px-5 py-3 text-left font-medium">SKU</th>
                <th className="px-5 py-3 text-left font-medium">Variants</th>
                <th className="px-5 py-3 text-left font-medium">Stock</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {filtered.map((p) => {
                const pending = edits[p.id];
                const dirty = pending != null && Number(pending) !== p.stock;
                return (
                  <tr key={p.id} className="hover:bg-cream/30 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={p.mainImage} alt="" className="w-10 h-12 object-cover rounded-md" />
                        <div className="min-w-0">
                          <p className="font-medium text-charcoal line-clamp-1">{p.name}</p>
                          <p className="text-xs text-charcoal/50">{p.style}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-charcoal/60 font-mono">ZM-{String(p.id).padStart(4, "0")}</td>
                    <td className="px-5 py-3.5 text-charcoal/80">
                      {p.colors.length} colors · {p.sizes.length} sizes
                    </td>
                    <td className="px-5 py-3.5 font-medium text-charcoal">{p.stock}</td>
                    <td className="px-5 py-3.5">
                      <StockIndicator stock={p.stock} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end items-center gap-2">
                        <input
                          type="number"
                          value={pending != null ? pending : p.stock}
                          onChange={(e) => setPending(p.id, e.target.value)}
                          className="w-20 px-2.5 py-1.5 rounded-lg border border-charcoal/15 text-sm focus:outline-none focus:ring-2 focus:ring-rosegold/30"
                          min="0"
                        />
                        <button
                          onClick={() => saveStock(p)}
                          disabled={!dirty}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            dirty
                              ? "bg-rosegold text-white hover:bg-rosegold-dark"
                              : "bg-charcoal/10 text-charcoal/40 cursor-not-allowed"
                          }`}
                        >
                          Save
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Tile = ({ label, value, accent }) => {
  const cls = {
    navy: "bg-navy text-cream",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <div className={`rounded-2xl p-5 shadow-soft border border-charcoal/5 ${cls[accent]}`}>
      <p className="text-xs uppercase tracking-widest opacity-70">{label}</p>
      <p className="font-serif text-3xl mt-1.5 font-semibold">{value}</p>
    </div>
  );
};

export default AdminInventory;
