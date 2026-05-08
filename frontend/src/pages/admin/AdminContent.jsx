import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import {
  EditIcon,
  PlusAdminIcon,
  TrashAdminIcon,
} from "../../components/admin/AdminIcons";

const AdminContent = () => {
  const { showToast } = useToast();
  const [tab, setTab] = useState("Banners");

  const { data: bannerData, loading: bannersLoading, refetch: refetchBanners } = useFetch("/banners");
  const { data: subData, loading: subsLoading, refetch: refetchSubs } = useFetch("/subscribers");
  const banners = bannerData?.banners || [];
  const subscribers = subData?.subscribers || [];

  const deleteBanner = async (id) => {
    try {
      await api.delete(`/banners/${id}`);
      showToast("Banner deleted", "success");
      refetchBanners();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  const deleteSubscriber = async (id) => {
    try {
      await api.delete(`/subscribers/${id}`);
      showToast("Subscriber removed", "success");
      refetchSubs();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-navy">Content</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            Banners, newsletter subscribers, and brand stories.
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["Banners", "Subscribers", "Stories"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition ${
              tab === t
                ? "bg-navy text-cream border-navy"
                : "bg-white border-charcoal/15 text-charcoal hover:border-rosegold"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Banners" && (
        <>
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft">
              <PlusAdminIcon className="w-4 h-4" />
              Add Banner
            </button>
          </div>

          {bannersLoading ? (
            <p className="text-center py-8 text-charcoal/60">Loading banners…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {banners.map((b) => (
                <div
                  key={b._id}
                  className="bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-blush/30 relative">
                    {b.image && (
                      <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                    )}
                    <span
                      className={`absolute top-3 right-3 text-[10px] uppercase tracking-widest font-medium px-2.5 py-1 rounded-full ${
                        b.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : b.status === "Scheduled"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif text-lg text-navy">{b.title}</h4>
                    <p className="text-xs text-charcoal/60 mt-1">📍 {b.placement}</p>
                    {b.schedule && (
                      <p className="text-xs text-charcoal/60 mt-0.5">📅 {b.schedule}</p>
                    )}
                    <div className="flex justify-end gap-1 mt-3">
                      <button className="p-2 rounded-lg hover:bg-cream text-charcoal/60 hover:text-rosegold">
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteBanner(b._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-charcoal/60 hover:text-red-600"
                      >
                        <TrashAdminIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "Subscribers" && (
        <>
          <div className="flex justify-between items-center flex-wrap gap-3">
            <p className="text-sm text-charcoal/60">{subscribers.length} subscribers</p>
            <button
              onClick={() => showToast("Subscribers exported as CSV", "success")}
              className="px-4 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft"
            >
              Export CSV
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream/50 text-xs uppercase tracking-widest text-charcoal/50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Email</th>
                  <th className="px-5 py-3 text-left font-medium">Source</th>
                  <th className="px-5 py-3 text-left font-medium">Subscribed On</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {subsLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-charcoal/60">
                      Loading…
                    </td>
                  </tr>
                ) : (
                  subscribers.map((s) => (
                    <tr key={s._id} className="hover:bg-cream/30">
                      <td className="px-5 py-3.5 text-charcoal">{s.email}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">{s.source}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => deleteSubscriber(s._id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "Stories" && (
        <div className="bg-white rounded-2xl p-12 shadow-soft border border-charcoal/5 text-center">
          <p className="font-serif text-3xl text-navy mb-2">Brand Stories</p>
          <p className="text-charcoal/60 max-w-md mx-auto mb-6">
            Behind-the-scenes journal posts about your atelier — coming soon to ZentoMart Admin.
          </p>
          <button className="px-5 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition">
            Notify me when ready
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
