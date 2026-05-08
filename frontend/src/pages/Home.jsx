import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import NewsletterSignup from "../components/NewsletterSignup";
import RecentlyViewed from "../components/RecentlyViewed";
import { ShieldIcon, SparkleIcon, TruckIcon } from "../components/Icons";

const Home = () => {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-charcoal/60">
          <div className="w-10 h-10 rounded-full border-4 border-rosegold/20 border-t-rosegold animate-spin" />
          <p className="text-xs uppercase tracking-[0.3em]">Loading collection…</p>
        </div>
      </div>
    );
  }

  // Intentional empty state — no products in DB yet
  if (products.length === 0) {
    return (
      <section className="min-h-[80vh] bg-[#e3dec5] flex items-center justify-center px-6 py-24">
        <div className="max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-rosegold font-medium mb-6">
            ✦ Coming Soon
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl text-navy leading-[1.05] mb-6">
            Our atelier is <em className="italic text-rosegold">curating</em> the first collection.
          </h1>
          <p className="text-charcoal/70 max-w-md mx-auto mb-10 leading-relaxed">
            New pieces are being hand-selected. Check back soon — or sign in to the admin
            panel to publish your first handbag.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/admin"
              className="px-7 py-3.5 rounded-full bg-rosegold text-white font-medium hover:bg-rosegold-dark transition shadow-luxury"
            >
              Go to Admin
            </a>
            <a
              href="mailto:concierge@zentomart.com"
              className="px-7 py-3.5 rounded-full border border-navy/20 text-charcoal font-medium hover:bg-navy hover:text-cream transition"
            >
              Notify Me
            </a>
          </div>
        </div>
      </section>
    );
  }

  const featured = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const heroBags = [products[0], products[3] || products[0], products[7] || products[0]].filter(Boolean);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#e3dec5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-rosegold font-medium mb-5">
              <SparkleIcon className="w-4 h-4" />
              The Spring 2026 Collection
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-navy leading-[1.05] mb-6">
              Carry the
              <span className="italic text-rosegold"> art </span>
              of arrival.
            </h1>
            <p className="text-charcoal/70 max-w-lg text-base sm:text-lg leading-relaxed mb-8">
              Sculpted leathers, hand-stitched craftsmanship and silhouettes
              made for women who arrive on their own terms. Discover
              ZentoMart's signature handbag atelier.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="px-8 py-4 rounded-full bg-rosegold text-white font-medium hover:bg-rosegold-dark transition shadow-luxury"
              >
                Shop the Collection
              </Link>
              <Link
                to="/products?sort=best"
                className="px-8 py-4 rounded-full border border-navy/20 text-charcoal font-medium hover:bg-navy hover:text-cream transition"
              >
                Best Sellers
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-rosegold/15">
              <div>
                <div className="font-serif text-2xl text-navy">12k+</div>
                <div className="text-xs text-charcoal/60 tracking-wide">Five-star reviews</div>
              </div>
              <div>
                <div className="font-serif text-2xl text-navy">100%</div>
                <div className="text-xs text-charcoal/60 tracking-wide">Italian leather</div>
              </div>
              <div>
                <div className="font-serif text-2xl text-navy">2-Year</div>
                <div className="text-xs text-charcoal/60 tracking-wide">Atelier guarantee</div>
              </div>
            </div>
          </div>

          {/* Stacked hero images */}
          <div className="relative h-[500px] lg:h-[600px] animate-fade-in">
            <div className="absolute top-0 right-0 w-3/4 h-3/5 rounded-3xl overflow-hidden shadow-luxury rotate-2 hover:rotate-0 transition-transform duration-700">
              <img
                src={heroBags[0].mainImage}
                alt={heroBags[0].name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-3/5 h-3/5 rounded-3xl overflow-hidden shadow-luxury -rotate-3 hover:rotate-0 transition-transform duration-700">
              <img
                src={heroBags[1].mainImage}
                alt={heroBags[1].name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-1/3 left-1/3 w-1/2 h-2/5 rounded-3xl overflow-hidden shadow-luxury rotate-6 hover:rotate-0 transition-transform duration-700 hidden md:block">
              <img
                src={heroBags[2].mainImage}
                alt={heroBags[2].name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* floating badge */}
            <div className="absolute bottom-6 right-6 bg-white shadow-luxury rounded-2xl p-4 max-w-[200px] animate-fade-in-up">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <p className="text-xs text-charcoal/70 italic">
                "Easily the most refined bag I've owned." — Vogue
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PERKS BAR */}
      <section className="border-y border-rosegold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <Perk icon={<TruckIcon className="w-6 h-6" />} title="Free Shipping" desc="On orders Rs. 5,000+" />
          <Perk icon={<ShieldIcon className="w-6 h-6" />} title="2-Year Warranty" desc="Atelier guaranteed" />
          <Perk icon={<SparkleIcon className="w-6 h-6" />} title="Hand-Crafted" desc="Made in Italy" />
          <Perk icon={<HeartGlyph />} title="30-Day Returns" desc="No questions asked" />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-rosegold">Shop by Style</span>
          <h2 className="font-serif text-4xl sm:text-5xl text-navy mt-3">Featured Collections</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <CategoryCard
            title="Totes"
            tagline="Statement carry-alls"
            image={(products[0] || {}).mainImage}
            to="/products?style=Tote"
          />
          <CategoryCard
            title="Crossbody"
            tagline="Hands-free elegance"
            image={(products[2] || products[0] || {}).mainImage}
            to="/products?style=Crossbody"
          />
          <CategoryCard
            title="Clutches"
            tagline="Evening sparkle"
            image={(products[1] || products[0] || {}).mainImage}
            to="/products?style=Clutch"
          />
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-10 gap-4 flex-wrap">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-rosegold">Best Sellers</span>
            <h2 className="font-serif text-4xl sm:text-5xl text-navy mt-3">
              Loved by Many.
            </h2>
          </div>
          <Link
            to="/products?sort=best"
            className="text-rosegold text-sm font-medium hover:text-rosegold-dark transition tracking-wide"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury">
              <img
                src="https://picsum.photos/id/1027/600/750"
                alt="Atelier"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 hidden md:block w-48 h-48 bg-rosegold rounded-3xl rotate-6 -z-10" />
            <div className="absolute -top-8 -left-8 hidden md:block w-32 h-32 bg-blush rounded-3xl -rotate-6 -z-10" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-rosegold">Our Atelier</span>
            <h2 className="font-serif text-4xl sm:text-5xl text-navy mt-3 mb-6 leading-tight">
              Quiet luxury, <em className="italic text-rosegold">hand-stitched.</em>
            </h2>
            <p className="text-charcoal/70 leading-relaxed mb-5">
              Every ZentoMart bag is crafted by a small team of master leatherworkers
              in Florence, Italy. We source from heritage tanneries, finish each piece
              by hand, and refuse to compromise on the details that take time —
              because the quietest luxuries are the ones that last.
            </p>
            <p className="text-charcoal/70 leading-relaxed mb-8">
              When you carry ZentoMart, you carry decades of know-how, the patience
              of slow craft, and a piece designed to grow more beautiful with you.
            </p>
            <Link
              to="/products"
              className="inline-block px-7 py-3.5 rounded-full border-2 border-navy text-charcoal font-medium hover:bg-navy hover:text-cream transition tracking-wide"
            >
              Discover the Craft
            </Link>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-end mb-10 gap-4 flex-wrap">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-rosegold">Just In</span>
              <h2 className="font-serif text-4xl sm:text-5xl text-navy mt-3">
                New Arrivals.
              </h2>
            </div>
            <Link to="/products" className="text-rosegold text-sm font-medium hover:text-rosegold-dark transition">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed />

      <NewsletterSignup />
    </div>
  );
};

const Perk = ({ icon, title, desc }) => (
  <div className="flex items-center gap-3">
    <span className="text-rosegold shrink-0">{icon}</span>
    <div>
      <p className="font-medium text-charcoal text-sm">{title}</p>
      <p className="text-xs text-charcoal/60">{desc}</p>
    </div>
  </div>
);

const HeartGlyph = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const CategoryCard = ({ title, tagline, image, to }) => (
  <Link
    to={to}
    className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-soft hover:shadow-luxury transition-all"
  >
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-7">
      <p className="text-cream/80 text-xs uppercase tracking-[0.3em] mb-2">{tagline}</p>
      <h3 className="font-serif text-cream text-3xl mb-3">{title}</h3>
      <span className="inline-block text-cream text-sm tracking-wider border-b border-cream/40 pb-1 group-hover:border-rosegold group-hover:text-rosegold transition">
        Explore →
      </span>
    </div>
  </Link>
);

export default Home;
