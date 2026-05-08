// Phase 2 seed data — mirrors the original frontend mock so the admin UI looks identical

export const customerSeeds = [
  { name: "Sophia Chen", email: "sophia.chen@example.com", avatar: "https://picsum.photos/seed/c1/100", location: "New York, USA", orders: 6, spent: 1832.0, joined: "2024-09-12", tag: "VIP" },
  { name: "Olivia Mendes", email: "olivia.m@example.com", avatar: "https://picsum.photos/seed/c2/100", location: "Lisbon, Portugal", orders: 4, spent: 1247.5, joined: "2025-01-22", tag: "Loyal" },
  { name: "Amelia Park", email: "amelia.park@example.com", avatar: "https://picsum.photos/seed/c3/100", location: "Seoul, South Korea", orders: 3, spent: 1099.0, joined: "2025-03-04", tag: "Loyal" },
  { name: "Charlotte Wood", email: "charlotte.w@example.com", avatar: "https://picsum.photos/seed/c4/100", location: "London, UK", orders: 2, spent: 658.0, joined: "2025-06-19", tag: "New" },
  { name: "Isabella Russo", email: "isabella.r@example.com", avatar: "https://picsum.photos/seed/c5/100", location: "Milan, Italy", orders: 5, spent: 1640.0, joined: "2024-11-30", tag: "VIP" },
  { name: "Mia Thompson", email: "mia.t@example.com", avatar: "https://picsum.photos/seed/c6/100", location: "Sydney, Australia", orders: 1, spent: 169.0, joined: "2026-03-15", tag: "New" },
  { name: "Aria Blake", email: "aria.b@example.com", avatar: "https://picsum.photos/seed/c7/100", location: "Toronto, Canada", orders: 2, spent: 478.0, joined: "2025-09-08", tag: "At-risk" },
  { name: "Emma Lopez", email: "emma.l@example.com", avatar: "https://picsum.photos/seed/c8/100", location: "Madrid, Spain", orders: 3, spent: 1117.0, joined: "2025-04-11", tag: "Loyal" },
];

const buildOrder = (code, daysAgo, customer, items, status, payment = "Paid") => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal > 250 ? 0 : 15;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  return {
    code,
    customer,
    items,
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    status,
    payment: { method: "Cash on Delivery", status: payment === "Refunded" ? "Refunded" : "Paid" },
    createdAt: date,
    updatedAt: date,
  };
};

export const orderSeeds = [
  buildOrder("ZM-1042", 1, { name: "Sophia Chen", email: "sophia.chen@example.com", avatar: "https://picsum.photos/seed/c1/100" },
    [{ productId: 1, name: "Luxury Croc Embossed Tote", color: "Black", size: "M", qty: 1, price: 299 }], "Pending"),
  buildOrder("ZM-1041", 2, { name: "Olivia Mendes", email: "olivia.m@example.com", avatar: "https://picsum.photos/seed/c2/100" },
    [
      { productId: 5, name: "Heritage Bridle Satchel", color: "Brown", size: "M", qty: 1, price: 459 },
      { productId: 2, name: "Velvet Rose Evening Clutch", color: "Burgundy", size: "One Size", qty: 1, price: 189 },
    ], "Processing"),
  buildOrder("ZM-1040", 3, { name: "Amelia Park", email: "amelia.park@example.com", avatar: "https://picsum.photos/seed/c3/100" },
    [{ productId: 8, name: "Onyx Structured Top-Handle", color: "Navy", size: "L", qty: 1, price: 549 }], "Shipped"),
  buildOrder("ZM-1039", 3, { name: "Charlotte Wood", email: "charlotte.w@example.com", avatar: "https://picsum.photos/seed/c4/100" },
    [{ productId: 3, name: "Parisian Quilted Crossbody", color: "Black", size: "M", qty: 1, price: 329 }], "Shipped"),
  buildOrder("ZM-1038", 6, { name: "Isabella Russo", email: "isabella.r@example.com", avatar: "https://picsum.photos/seed/c5/100" },
    [
      { productId: 11, name: "Modernist Leather Backpack", color: "Black", size: "M", qty: 1, price: 399 },
      { productId: 12, name: "Atelier Mini Bucket", color: "Burgundy", size: "S", qty: 2, price: 239 },
    ], "Delivered"),
  buildOrder("ZM-1037", 7, { name: "Mia Thompson", email: "mia.t@example.com", avatar: "https://picsum.photos/seed/c6/100" },
    [{ productId: 7, name: "Riviera Straw Bucket", color: "Natural", size: "M", qty: 1, price: 169 }], "Delivered"),
  buildOrder("ZM-1036", 9, { name: "Aria Blake", email: "aria.b@example.com", avatar: "https://picsum.photos/seed/c7/100" },
    [{ productId: 9, name: "Suede Fringe Hobo", color: "Tan", size: "M", qty: 1, price: 259 }], "Cancelled", "Refunded"),
  buildOrder("ZM-1035", 10, { name: "Emma Lopez", email: "emma.l@example.com", avatar: "https://picsum.photos/seed/c8/100" },
    [{ productId: 13, name: "Equestrian Saddle Bag", color: "Brown", size: "S", qty: 1, price: 419 }], "Delivered"),
];

export const promotionSeeds = [
  { code: "SPRING25", type: "% off", value: 25, minSpend: 200, expires: new Date("2026-06-30"), used: 142, limit: 500, status: "Active" },
  { code: "WELCOME10", type: "% off", value: 10, minSpend: 0, expires: new Date("2026-12-31"), used: 318, limit: 0, status: "Active" },
  { code: "FREESHIP", type: "Free shipping", value: 0, minSpend: 100, expires: new Date("2026-05-15"), used: 87, limit: 200, status: "Active" },
  { code: "WINTER40", type: "% off", value: 40, minSpend: 300, expires: new Date("2026-02-28"), used: 412, limit: 500, status: "Expired" },
];

export const reviewSeeds = [
  { productId: 5, productName: "Heritage Bridle Satchel", customer: "Olivia Mendes", avatar: "https://picsum.photos/seed/c2/100", rating: 5, title: "An heirloom-grade piece", body: "I cannot stop staring at this bag — the leather smells incredible and it gets compliments everywhere I go.", status: "Pending" },
  { productId: 1, productName: "Luxury Croc Embossed Tote", customer: "Sophia Chen", avatar: "https://picsum.photos/seed/c1/100", rating: 5, title: "Worth every penny", body: "Fits my laptop, keys, and wallet beautifully. The hardware feels solid.", status: "Approved" },
  { productId: 3, productName: "Parisian Quilted Crossbody", customer: "Amelia Park", avatar: "https://picsum.photos/seed/c3/100", rating: 4, title: "Lovely but heavier than expected", body: "The chain strap is gorgeous but a bit weighty. Otherwise stunning.", status: "Pending" },
  { productId: 2, productName: "Velvet Rose Evening Clutch", customer: "Charlotte Wood", avatar: "https://picsum.photos/seed/c4/100", rating: 5, title: "Showstopper", body: "Wore it to a wedding — three people asked where it was from!", status: "Approved" },
];

export const collectionSeeds = [
  { name: "Spring 2026", description: "Fresh silhouettes for the new season", productIds: [1, 2, 4, 7, 11], status: "Active", image: "https://picsum.photos/seed/col1/600" },
  { name: "Best Sellers", description: "Loved by many", productIds: [1, 3, 5, 8, 13], status: "Active", image: "https://picsum.photos/seed/col2/600" },
  { name: "Evening Edit", description: "For after-dark moments", productIds: [2, 6, 10], status: "Active", image: "https://picsum.photos/seed/col3/600" },
  { name: "Heritage Collection", description: "Made to last", productIds: [5, 8, 11, 13], status: "Active", image: "https://picsum.photos/seed/col4/600" },
  { name: "Summer Capsule", description: "Coming soon", productIds: [], status: "Draft", image: "https://picsum.photos/seed/col5/600" },
];

export const bannerSeeds = [
  { title: "Spring 2026 Collection Launch", placement: "Homepage Hero", status: "Active", schedule: "Apr 1 — May 31, 2026", image: "https://picsum.photos/seed/banner1/1200/600" },
  { title: "Free Shipping Over $250", placement: "Top Announcement", status: "Active", schedule: "Always on", image: "https://picsum.photos/seed/banner2/1200/600" },
  { title: "Mother's Day Edit", placement: "Homepage Mid", status: "Scheduled", schedule: "May 5 — May 12, 2026", image: "https://picsum.photos/seed/banner3/1200/600" },
];

export const subscriberSeeds = [
  { email: "sophia.chen@example.com", source: "Newsletter signup" },
  { email: "olivia.m@example.com", source: "Checkout opt-in" },
  { email: "amelia.park@example.com", source: "Newsletter signup" },
  { email: "charlotte.w@example.com", source: "Account creation" },
  { email: "isabella.r@example.com", source: "Newsletter signup" },
  { email: "mia.t@example.com", source: "Checkout opt-in" },
];
