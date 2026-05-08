import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import {
  BellIcon,
  ChevronDownIcon,
  LogoutIcon,
  SearchAdminIcon,
} from "./AdminIcons";

// Format a Date as "5m ago", "2h ago", "3d ago", "Apr 14"
const timeAgo = (date) => {
  const d = new Date(date);
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 7 * 86400) return `${Math.floor(diffSec / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const titles = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "Add Product",
  "/admin/inventory": "Inventory",
  "/admin/collections": "Collections",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/promotions": "Promotions",
  "/admin/reviews": "Reviews",
  "/admin/content": "Content",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
  "/admin/profile": "Profile",
};

const AdminTopbar = ({ onMenuClick }) => {
  const { admin, logout } = useAuth();
  const { pathname } = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Pull recent orders + pending reviews from the API every 20 seconds
  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const [ordersData, reviewsData] = await Promise.all([
          api.get("/orders?limit=8").catch(() => ({ orders: [] })),
          api.get("/reviews?status=Pending").catch(() => ({ reviews: [] })),
        ]);
        if (cancelled) return;

        const orderItems = (ordersData.orders || []).slice(0, 6).map((o) => ({
          type: "order",
          link: `/admin/orders/${o.code}`,
          message: `${o.status === "Pending" ? "New" : o.status} order #${o.code} — ${o.customer?.name || "Customer"}`,
          createdAt: o.createdAt,
          isNew: o.status === "Pending",
        }));

        const reviewItems = (reviewsData.reviews || []).slice(0, 4).map((r) => ({
          type: "review",
          link: "/admin/reviews",
          message: `${r.rating}★ review by ${r.customer} on ${r.productName}`,
          createdAt: r.createdAt,
          isNew: true,
        }));

        const combined = [...orderItems, ...reviewItems]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 8);

        setNotifications(combined);
        setUnread(combined.filter((n) => n.isNew).length);
      } catch {
        /* swallow — banner already warns when API is down */
      }
    };

    fetchAll();
    const id = setInterval(fetchAll, 20000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Resolve dynamic titles like /admin/products/12 → "Edit Product"
  let title = titles[pathname] || "";
  if (!title && pathname.startsWith("/admin/products/")) title = "Edit Product";
  if (!title && pathname.startsWith("/admin/orders/")) title = "Order Detail";
  if (!title && pathname.startsWith("/admin/customers/")) title = "Customer Detail";

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  return (
    <header className="sticky top-0 z-20 bg-white border-b border-charcoal/10">
      <div className="flex items-center gap-4 px-5 lg:px-8 h-16">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-charcoal hover:text-rosegold"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Title */}
        <div className="hidden sm:block">
          <h1 className="font-serif text-2xl text-navy leading-tight">{title}</h1>
          <p className="text-xs text-charcoal/50">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md ml-auto">
          <div className="relative">
            <SearchAdminIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-cream border border-transparent focus:outline-none focus:ring-2 focus:ring-rosegold/30 focus:border-rosegold text-sm placeholder:text-charcoal/40"
            />
          </div>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setUnread(0); // viewing the panel = "read"
            }}
            className="relative p-2 rounded-full hover:bg-cream transition"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5 text-charcoal" />
            {unread > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] rounded-full bg-rosegold text-white text-[10px] font-semibold flex items-center justify-center px-1">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-luxury border border-charcoal/10 overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-charcoal/10 flex justify-between items-center">
                <p className="font-serif text-charcoal font-medium">Notifications</p>
                <button
                  onClick={() => setUnread(0)}
                  className="text-xs text-rosegold hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-charcoal/50 italic">
                    No notifications yet
                  </li>
                ) : (
                  notifications.map((n, i) => (
                    <Link
                      key={i}
                      to={n.link}
                      onClick={() => setNotifOpen(false)}
                      className="block px-4 py-3 hover:bg-cream cursor-pointer border-b border-charcoal/5 last:border-0"
                    >
                      <p className="text-sm text-charcoal leading-tight">{n.message}</p>
                      <p className="text-xs text-charcoal/50 mt-1">{timeAgo(n.createdAt)}</p>
                    </Link>
                  ))
                )}
              </ul>
              <div className="px-4 py-3 border-t border-charcoal/10 text-center">
                <Link
                  to="/admin/orders"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-rosegold hover:underline"
                >
                  View all orders
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-cream transition"
          >
            <img
              src={admin?.avatar}
              alt={admin?.name}
              className="w-8 h-8 rounded-full ring-2 ring-rosegold/30 object-cover"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-charcoal leading-tight">{admin?.name}</p>
              <p className="text-[10px] text-charcoal/50">{admin?.role}</p>
            </div>
            <ChevronDownIcon className="w-3.5 h-3.5 text-charcoal/50" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-luxury border border-charcoal/10 overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-charcoal/10">
                <p className="text-sm font-medium text-charcoal">{admin?.name}</p>
                <p className="text-xs text-charcoal/50 truncate">{admin?.email}</p>
              </div>
              <ul className="py-2 text-sm">
                <li>
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-charcoal hover:bg-cream"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-charcoal hover:bg-cream"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-charcoal hover:bg-cream"
                  >
                    View Storefront
                  </Link>
                </li>
              </ul>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-charcoal/10"
              >
                <LogoutIcon className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
