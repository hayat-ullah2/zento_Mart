import { useFetch } from "../../hooks/useFetch";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { EditIcon, PlusAdminIcon, TrashAdminIcon } from "../../components/admin/AdminIcons";

const AdminCollections = () => {
  const { showToast } = useToast();
  const { data, loading, refetch } = useFetch("/collections");
  const collections = data?.collections || [];

  const handleDelete = async (id) => {
    try {
      await api.delete(`/collections/${id}`);
      showToast("Collection deleted", "success");
      refetch();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy">Collections</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            Group your handbags into themed edits — Spring 2026, Best Sellers, Evening Edit.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft">
          <PlusAdminIcon className="w-4 h-4" />
          New Collection
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-soft border border-charcoal/5">
          <div className="inline-flex items-center gap-3 text-charcoal/60">
            <span className="w-5 h-5 rounded-full border-2 border-rosegold/20 border-t-rosegold animate-spin" />
            Loading collections…
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden hover:shadow-luxury transition group"
            >
              <div className="aspect-[5/3] overflow-hidden bg-blush/30 relative">
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <span
                  className={`absolute top-3 right-3 text-[10px] uppercase tracking-widest font-medium px-2.5 py-1 rounded-full ${
                    c.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : c.status === "Draft"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-xl text-navy">{c.name}</h3>
                <p className="text-xs text-charcoal/60 mt-0.5">
                  {c.productIds?.length || 0} products
                </p>
                {c.description && (
                  <p className="text-xs text-charcoal/60 mt-1 line-clamp-2">{c.description}</p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <button className="text-xs text-rosegold hover:underline">View products →</button>
                  <div className="flex gap-1">
                    <button className="p-2 rounded-lg hover:bg-cream text-charcoal/60 hover:text-rosegold transition">
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-charcoal/60 hover:text-red-600 transition"
                    >
                      <TrashAdminIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCollections;
