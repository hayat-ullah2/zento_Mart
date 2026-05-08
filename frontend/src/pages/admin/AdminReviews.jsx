import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

const AdminReviews = () => {
  const { showToast } = useToast();
  const [tab, setTab] = useState("Pending");
  const { data, loading, refetch } = useFetch("/reviews");
  const reviews = data?.reviews || [];

  const filtered = reviews.filter((r) => (tab === "All" ? true : r.status === tab));

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/reviews/${id}`, { status });
      showToast(`Review ${status.toLowerCase()}`, "success");
      refetch();
    } catch (err) {
      showToast(err.message || "Update failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-navy">Reviews</h1>
        <p className="text-charcoal/60 text-sm mt-1">
          Moderate customer reviews — keep the conversation honest and on-brand.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["Pending", "Approved", "Rejected", "All"].map((s) => (
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
            <span className={`ml-1.5 text-xs ${tab === s ? "text-cream/70" : "text-charcoal/50"}`}>
              ({s === "All" ? reviews.length : reviews.filter((r) => r.status === s).length})
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-soft border border-charcoal/5">
            <div className="inline-flex items-center gap-3 text-charcoal/60">
              <span className="w-5 h-5 rounded-full border-2 border-rosegold/20 border-t-rosegold animate-spin" />
              Loading reviews…
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-soft border border-charcoal/5">
            <p className="font-serif text-2xl text-navy mb-1">All caught up</p>
            <p className="text-sm text-charcoal/60">No reviews need attention right now.</p>
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-2xl p-5 shadow-soft border border-charcoal/5"
            >
              <div className="flex items-start gap-4">
                {r.avatar && (
                  <img src={r.avatar} alt={r.customer} className="w-11 h-11 rounded-full object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-medium text-charcoal">{r.customer}</p>
                    <span className="text-xs text-charcoal/50">on</span>
                    <span className="text-xs text-rosegold">{r.productName}</span>
                    <span
                      className={`ml-auto text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full ${
                        r.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : r.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-amber-400 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < r.rating ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <span className="text-xs text-charcoal/50">
                      · {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-serif text-charcoal text-base mb-1.5">{r.title}</p>
                  <p className="text-sm text-charcoal/70 leading-relaxed">{r.body}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {r.status === "Pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(r._id, "Approved")}
                          className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(r._id, "Rejected")}
                          className="px-4 py-2 rounded-full border border-charcoal/15 text-xs hover:border-red-400 hover:text-red-600 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {r.status === "Approved" && (
                      <button
                        onClick={() => updateStatus(r._id, "Rejected")}
                        className="px-4 py-2 rounded-full border border-charcoal/15 text-xs hover:border-red-400 hover:text-red-600 transition"
                      >
                        Reject
                      </button>
                    )}
                    {r.status === "Rejected" && (
                      <button
                        onClick={() => updateStatus(r._id, "Approved")}
                        className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
