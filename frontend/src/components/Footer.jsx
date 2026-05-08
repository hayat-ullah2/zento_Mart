import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-navy text-cream/80 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <Link to="/" aria-label="ZentoMart home" className="inline-block mb-4">
            <div className="h-20 w-20 rounded-full overflow-hidden">
              <img
                src="/logo.jpeg"
                alt="ZentoMart"
                className="h-full w-full object-cover scale-110 mix-blend-multiply"
              />
            </div>
          </Link>
          <p className="text-sm leading-relaxed">
            Crafting moments of quiet luxury, one handbag at a time. Designed in Paris,
            handmade in Italy.
          </p>
          <div className="flex gap-3 mt-6">
            {["Instagram", "Facebook", "Pinterest", "TikTok"].map((s) => (
              <a
                key={s}
                href="#"
                aria-label={s}
                className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-rosegold hover:border-rosegold transition"
              >
                <SocialGlyph name={s} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-cream font-medium mb-4 tracking-wider uppercase text-xs">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-rosegold transition">All Handbags</Link></li>
            <li><Link to="/products?style=Tote" className="hover:text-rosegold transition">Totes</Link></li>
            <li><Link to="/products?style=Crossbody" className="hover:text-rosegold transition">Crossbody</Link></li>
            <li><Link to="/products?style=Clutch" className="hover:text-rosegold transition">Clutches</Link></li>
            <li><Link to="/products?sort=best" className="hover:text-rosegold transition">Best Sellers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream font-medium mb-4 tracking-wider uppercase text-xs">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-rosegold transition">Our Story</a></li>
            <li><a href="#" className="hover:text-rosegold transition">Craftsmanship</a></li>
            <li><a href="#" className="hover:text-rosegold transition">Sustainability</a></li>
            <li><a href="#" className="hover:text-rosegold transition">Press</a></li>
            <li><a href="#" className="hover:text-rosegold transition">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream font-medium mb-4 tracking-wider uppercase text-xs">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-rosegold transition">Contact</a></li>
            <li><a href="#" className="hover:text-rosegold transition">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-rosegold transition">Care Guide</a></li>
            <li><a href="#" className="hover:text-rosegold transition">FAQ</a></li>
            <li><a href="#" className="hover:text-rosegold transition">Track Order</a></li>
          </ul>
          <div className="mt-6 text-xs text-cream/60 space-y-1">
            <p>concierge@zentomart.com</p>
            <p>+1 (800) 555-0117</p>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream/60">
          <p>© {new Date().getFullYear()} ZentoMart. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-rosegold transition">Privacy</a>
            <a href="#" className="hover:text-rosegold transition">Terms</a>
            <a href="#" className="hover:text-rosegold transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialGlyph = ({ name }) => {
  const cls = "w-4 h-4";
  switch (name) {
    case "Instagram":
      return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
      );
    case "Facebook":
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 22v-8h3l1-4h-4V7c0-1.1.9-2 2-2h2V1h-3a5 5 0 00-5 5v4H6v4h3v8h4z" />
        </svg>
      );
    case "Pinterest":
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 00-3.6 19.34c-.1-.84-.18-2.13.04-3.05l1.34-5.7s-.34-.69-.34-1.7c0-1.6.93-2.79 2.08-2.79.98 0 1.45.74 1.45 1.62 0 .99-.63 2.46-.96 3.83-.27 1.15.58 2.08 1.7 2.08 2.05 0 3.62-2.16 3.62-5.27 0-2.75-1.98-4.68-4.81-4.68a4.99 4.99 0 00-5.21 5c0 .99.38 2.05.86 2.63a.35.35 0 01.08.33c-.09.36-.28 1.15-.32 1.31-.05.21-.16.26-.38.16-1.4-.65-2.27-2.7-2.27-4.34 0-3.53 2.56-6.78 7.39-6.78 3.88 0 6.9 2.77 6.9 6.46 0 3.86-2.43 6.96-5.81 6.96-1.13 0-2.2-.59-2.56-1.29l-.7 2.66c-.25.97-.93 2.18-1.39 2.92A10 10 0 1012 2z" />
        </svg>
      );
    case "TikTok":
    default:
      return (
        <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.6 6.3a4.9 4.9 0 01-2.9-1A4.9 4.9 0 0115 2h-3v13.7a2.7 2.7 0 11-2.7-2.7c.27 0 .53.04.78.12V10a5.7 5.7 0 105.62 5.7V9.5a8 8 0 004.7 1.5V8a5 5 0 01-.8-1.7z" />
        </svg>
      );
  }
};

export default Footer;
