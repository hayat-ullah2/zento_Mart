import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../hooks/usePriceFormat";
import {
  EditIcon,
  EyeIcon,
  PlusAdminIcon,
  SearchAdminIcon,
  TrashAdminIcon,
} from "../../components/admin/AdminIcons";
import StockIndicator from "../../components/StockIndicator";

const AdminProducts = () => {
  const { products, loading, deleteProduct } = useProducts();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [confirmDelete, setConfirmDelete] = useState(null);

  const styles = useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.style)))],
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.style.toLowerCase().includes(search.toLowerCase()) ||
        p.material.toLowerCase().includes(search.toLowerCase());
      const matchesStyle = styleFilter === "all" || p.style === styleFilter;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in" && p.stock > 10) ||
        (stockFilter === "low" && p.stock > 0 && p.stock <= 10) ||
        (stockFilter === "out" && p.stock === 0);
      return matchesSearch && matchesStyle && matchesStock;
    });
  }, [products, search, styleFilter, stockFilter]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all([...selected].map((id) => deleteProduct(id)));
      showToast(`${selected.size} products deleted`, "success");
      setSelected(new Set());
    } catch (err) {
      showToast(err.message || "Bulk delete failed", "error");
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await deleteProduct(id);
      setConfirmDelete(null);
      showToast(`"${name}" deleted`, "success");
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy">Products</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            {filtered.length} of {products.length} pieces
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft"
          >
            <PlusAdminIcon className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-soft border border-charcoal/5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <SearchAdminIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, style, or material..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-cream border border-transparent focus:outline-none focus:ring-2 focus:ring-rosegold/30 text-sm"
          />
        </div>

        <select
          value={styleFilter}
          onChange={(e) => setStyleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-full bg-cream border border-transparent text-sm focus:outline-none focus:ring-2 focus:ring-rosegold/30"
        >
          {styles.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Styles" : s}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2.5 rounded-full bg-cream border border-transparent text-sm focus:outline-none focus:ring-2 focus:ring-rosegold/30"
        >
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>

        {selected.size > 0 && (
          <div className="flex items-center gap-2 ml-auto bg-blush/40 rounded-full px-4 py-2 border border-rosegold/20">
            <span className="text-xs text-charcoal">{selected.size} selected</span>
            <button
              onClick={handleBulkDelete}
              className="text-xs text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/50 text-xs uppercase tracking-widest text-charcoal/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-rosegold rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Style</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium">Stock</th>
                <th className="px-4 py-3 text-left font-medium">Rating</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-16">
                    <div className="inline-flex items-center gap-3 text-charcoal/60">
                      <span className="w-5 h-5 rounded-full border-2 border-rosegold/20 border-t-rosegold animate-spin" />
                      Loading products from MongoDB…
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16">
                    <p className="font-serif text-2xl text-navy mb-2">No products match</p>
                    <p className="text-charcoal/60 text-sm">
                      Try a different search or filter, or add your first piece.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-cream/30 transition">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="w-4 h-4 accent-rosegold rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded-lg shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/admin/products/${p.id}`}
                            className="font-medium text-charcoal hover:text-rosegold line-clamp-1"
                          >
                            {p.name}
                          </Link>
                          <p className="text-xs text-charcoal/50">{p.material}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-charcoal/80">{p.style}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-charcoal">{formatPrice(p.price)}</span>
                      {p.originalPrice && (
                        <div className="text-xs text-charcoal/40 line-through">
                          {formatPrice(p.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-charcoal/80">{p.stock}</td>
                    <td className="px-4 py-3 text-charcoal/80">
                      <span className="flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        {p.rating?.toFixed(1) || "—"}{" "}
                        <span className="text-charcoal/40 text-xs">({p.reviews || 0})</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StockIndicator stock={p.stock} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/products/${p.id}`}
                          target="_blank"
                          className="p-2 rounded-lg hover:bg-cream text-charcoal/60 hover:text-rosegold transition"
                          title="View on storefront"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/${p.id}`}
                          className="p-2 rounded-lg hover:bg-cream text-charcoal/60 hover:text-rosegold transition"
                          title="Edit"
                        >
                          <EditIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(p)}
                          className="p-2 rounded-lg hover:bg-red-50 text-charcoal/60 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <TrashAdminIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-luxury animate-fade-in">
            <h3 className="font-serif text-2xl text-navy mb-3">Delete this product?</h3>
            <p className="text-charcoal/70 text-sm mb-6">
              "<span className="font-medium">{confirmDelete.name}</span>" will be removed from the
              storefront. You can restore default products at any time.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2.5 rounded-full border border-charcoal/15 text-sm hover:border-rosegold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id, confirmDelete.name)}
                className="px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
