# ZentoMart — Luxury Women's Handbags

A premium, luxurious React.js + Tailwind CSS frontend for a single-category women's handbag e-commerce store. Built with a "wow-factor" aesthetic targeting fashion-conscious women.

## ✨ Highlights

- **Image Zoom on Hover** — Magnifying lens + side panel zoom on the Product Details page
- **Color Swatch Selector** — Clicking a color swatch swaps the main product image
- **Breadcrumb Navigation** — On Products, Product Details, Cart, Checkout, and Wishlist pages
- **Recently Viewed Products** — Last 6 viewed products stored in localStorage with "Clear" button
- **Related Products Carousel** — Horizontal scrollable carousel with prev/next buttons & snap points (4 / 2 / 1 cards on desktop / tablet / mobile)
- **Currency-Formatted Prices** — Always `$299.00` with sale price + crossed-out original
- **Stock Status Indicator** — Color-coded (green/yellow/red) on cards & details, exact count on details
- **Add to Cart Animation** — Product image flies from button to cart icon with bounce + "Added!" button flash + toast

## 🛠 Tech Stack

- React 18 (functional components + hooks)
- React Router v6
- Tailwind CSS
- Vite

## 📁 Structure

```
frontend/
├── public/
├── src/
│   ├── components/      # Navbar, Footer, ProductCard, CartDrawer, FilterSidebar,
│   │                    # ImageZoom, RelatedProducts, RecentlyViewed, etc.
│   ├── context/         # CartContext, WishlistContext, ToastContext
│   ├── data/            # products.js (13 mock handbags + filter options)
│   ├── hooks/           # useRecentlyViewed, usePriceFormat
│   ├── pages/           # Home, Products, ProductDetails, Cart, Checkout, Wishlist
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## 🚀 Getting Started

```bash
cd d:/ZentoMart/frontend
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

## 🎨 Design System

- **Cream** `#FAF9F6` — page background
- **Rose Gold** `#B76E79` — primary accent
- **Navy** `#1A2A3A` — headings & primary CTAs alt
- **Charcoal** `#2C2C2C` — body text
- **Blush** `#F5DCDC` — soft surfaces
- **Playfair Display** — serif headings
- **Poppins** — sans-serif body

## 💾 Persisted via localStorage

| Key | Stores |
|---|---|
| `zentomart_cart` | Cart items |
| `zentomart_wishlist` | Wishlist product IDs |
| `zentomart_recently_viewed` | Last 6 viewed product IDs |

## 🧭 Routes

### Storefront

| Path | Page |
|---|---|
| `/` | Home |
| `/products` | Products listing (filters + sort + search via `?style=`, `?search=`, `?sort=`) |
| `/products/:id` | Product Details |
| `/cart` | Cart |
| `/checkout` | Checkout (3-step form) |
| `/wishlist` | Wishlist |

### Admin Panel

| Path | Page |
|---|---|
| `/admin/login` | Admin sign-in |
| `/admin` | Dashboard (KPIs, chart, recent orders, top sellers, low-stock alerts) |
| `/admin/products` | Products table (search / filter / bulk delete) |
| `/admin/products/new` | Create new product (5-tab form + live preview) |
| `/admin/products/:id` | Edit product |
| `/admin/inventory` | Stock adjuster |
| `/admin/collections` | Collections grid |
| `/admin/orders` | Orders list (status tabs) |
| `/admin/orders/:id` | Order detail (items, timeline, customer, tracking) |
| `/admin/customers` | Customers table |
| `/admin/customers/:id` | Customer detail (order history, address) |
| `/admin/promotions` | Coupon management |
| `/admin/reviews` | Review moderation |
| `/admin/content` | Banners + newsletter subscribers |
| `/admin/analytics` | Sales report, traffic, conversion funnel |
| `/admin/settings` | Tabbed settings (store, shipping, payment, tax, etc.) |
| `/admin/profile` | Admin profile + security |

### 🔑 Demo Admin Credentials

| Role | Email | Password |
|---|---|---|
| Owner | `admin@zentomart.com` | `admin123` |
| Manager | `manager@zentomart.com` | `manager123` |

The login page has a one-click "Use" button next to each demo account.

### ✨ Admin → Storefront Sync

Products created or edited at `/admin/products/new` (or `/admin/products/:id`) are persisted in `localStorage` under `zentomart_custom_products` and **immediately appear on the public storefront** — Home, Products, search, etc. Click "Restore Defaults" to undo all admin edits.
