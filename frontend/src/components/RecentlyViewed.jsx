import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "./ProductCard";

const RecentlyViewed = ({ excludeId }) => {
  const { ids, clearRecentlyViewed } = useRecentlyViewed();
  const { products: allProducts } = useProducts();
  const items = ids
    .filter((id) => id !== excludeId)
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-end mb-8 gap-4 flex-wrap">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-rosegold">
            Just for you
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-navy mt-2">
            Recently Viewed
          </h2>
        </div>
        <button
          onClick={clearRecentlyViewed}
          className="text-xs text-charcoal/60 hover:text-rosegold underline"
        >
          Clear Recently Viewed
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} compact />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
