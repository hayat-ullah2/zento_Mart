import { NavLink, Link } from "react-router-dom";
import {
  BoxIcon,
  ChartIcon,
  DashboardIcon,
  DocIcon,
  FolderIcon,
  InventoryIcon,
  LogoutIcon,
  OrderIcon,
  SettingsIcon,
  StarOutlineIcon,
  TagIcon,
  UsersIcon,
  CloseAdminIcon,
} from "./AdminIcons";
import { useAuth } from "../../context/AuthContext";

const navSections = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: DashboardIcon, end: true }],
  },
  {
    label: "Catalog",
    items: [
      { to: "/admin/products", label: "Products", icon: BoxIcon },
      { to: "/admin/inventory", label: "Inventory", icon: InventoryIcon },
      { to: "/admin/collections", label: "Collections", icon: FolderIcon },
    ],
  },
  {
    label: "Sales",
    items: [
      { to: "/admin/orders", label: "Orders", icon: OrderIcon },
      { to: "/admin/customers", label: "Customers", icon: UsersIcon },
      { to: "/admin/promotions", label: "Promotions", icon: TagIcon },
    ],
  },
  {
    label: "Engagement",
    items: [
      { to: "/admin/reviews", label: "Reviews", icon: StarOutlineIcon },
      { to: "/admin/content", label: "Content", icon: DocIcon },
      { to: "/admin/analytics", label: "Analytics", icon: ChartIcon },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

const AdminSidebar = ({ open, onClose }) => {
  const { admin, logout } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-navy text-cream/80 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between p-5 border-b border-cream/10">
          <Link to="/admin" className="font-serif text-2xl font-bold text-cream">
            Zento<span className="text-rosegold italic">Admin</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-cream/70 hover:text-cream"
            aria-label="Close menu"
          >
            <CloseAdminIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Profile chip */}
        {admin && (
          <div className="px-5 py-4 border-b border-cream/10 flex items-center gap-3">
            <img
              src={admin.avatar}
              alt={admin.name}
              className="w-10 h-10 rounded-full ring-2 ring-rosegold/40 object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-cream truncate">{admin.name}</p>
              <p className="text-xs text-rosegold truncate">{admin.role}</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navSections.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40 px-5 mb-2">
                {section.label}
              </p>
              <ul>
                {section.items.map(({ to, label, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-2.5 text-sm transition-all border-l-2 ${
                          isActive
                            ? "bg-rosegold/15 text-cream border-rosegold font-medium"
                            : "border-transparent text-cream/70 hover:text-cream hover:bg-cream/5"
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-cream/10 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs text-cream/70 hover:text-cream hover:bg-cream/5 transition"
          >
            ← View Storefront
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs bg-cream/5 hover:bg-rosegold/20 text-cream transition"
          >
            <LogoutIcon className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
