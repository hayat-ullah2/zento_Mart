import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const AdminProfile = () => {
  const { admin } = useAuth();
  const { showToast } = useToast();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl text-navy">My Profile</h1>
        <p className="text-charcoal/60 text-sm mt-1">Personal info, security, and notifications.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-charcoal/5">
        <div className="flex items-center gap-5 pb-6 border-b border-charcoal/10">
          <img
            src={admin?.avatar}
            alt={admin?.name}
            className="w-20 h-20 rounded-full ring-4 ring-rosegold/30 object-cover"
          />
          <div>
            <h2 className="font-serif text-2xl text-navy">{admin?.name}</h2>
            <p className="text-sm text-charcoal/60">{admin?.email}</p>
            <p className="text-xs text-rosegold mt-1">{admin?.role}</p>
          </div>
          <button className="ml-auto text-xs text-rosegold hover:underline">Change photo</button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast("Profile updated", "success");
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6"
        >
          <Field label="Full name">
            <input className="input" defaultValue={admin?.name} />
          </Field>
          <Field label="Email">
            <input className="input" defaultValue={admin?.email} />
          </Field>
          <Field label="Phone">
            <input className="input" defaultValue="+1 (555) 555-0117" />
          </Field>
          <Field label="Time zone">
            <select className="input">
              <option>Europe/Florence (CET)</option>
              <option>America/New_York (EST)</option>
              <option>America/Los_Angeles (PST)</option>
            </select>
          </Field>

          <div className="sm:col-span-2 flex justify-end pt-3 border-t border-charcoal/10 mt-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-charcoal/5">
        <h2 className="font-serif text-xl text-navy mb-5">Security</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast("Password updated", "success");
          }}
          className="space-y-4"
        >
          <Field label="Current password">
            <input type="password" className="input" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="New password">
              <input type="password" className="input" />
            </Field>
            <Field label="Confirm new password">
              <input type="password" className="input" />
            </Field>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-navy text-cream text-sm font-medium hover:bg-rosegold transition"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-charcoal/5">
        <h2 className="font-serif text-xl text-navy mb-5">Recent Activity</h2>
        <ul className="space-y-3 text-sm">
          {[
            { action: "Updated product 'Heritage Bridle Satchel'", time: "10 min ago" },
            { action: "Approved 1 review", time: "1 hour ago" },
            { action: "Marked order #ZM-1038 as shipped", time: "Yesterday" },
            { action: "Created coupon 'SPRING25'", time: "3 days ago" },
            { action: "Signed in from new device", time: "Apr 28" },
          ].map((a, i) => (
            <li key={i} className="flex justify-between items-center pb-3 border-b border-charcoal/5 last:border-0 last:pb-0">
              <span className="text-charcoal/80">{a.action}</span>
              <span className="text-xs text-charcoal/50">{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-xs uppercase tracking-widest text-charcoal/60 mb-1.5">{label}</span>
    {children}
  </label>
);

export default AdminProfile;
