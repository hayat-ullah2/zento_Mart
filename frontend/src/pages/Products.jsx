import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Breadcrumb from "../components/Breadcrumb";
import { ProductGridSkeleton } from "../components/LoadingSkeleton";
import RecentlyViewed from "../components/RecentlyViewed";
import { CloseIcon, MenuIcon } from "../components/Icons";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best", label: "Best Selling" },
  { value: "rating", label: "Top Rated" },
  { value: "new", label: "Newest" },
];

const Products = () => {
  const { products: allProducts } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStyle = searchParams.get("style");
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "featured";

  const [filters, setFilters] = useState({
    priceMax: 50000,
    colors: [],
    styles: initialStyle ? [initialStyle] : [],
    materials: [],
  });
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Simulated load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Sync sort to URL
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (sort && sort !== "featured") next.set("sort", sort);
    else next.delete("sort");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line
  }, [sort]);

  // Sync search input + style filter when URL changes (so navbar style links update the page)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    const urlStyle = searchParams.get("style");
    if (urlStyle) {
      setFilters((prev) =>
        prev.styles.length === 1 && prev.styles[0] === urlStyle
          ? prev
          : { ...prev, styles: [urlStyle] }
      );
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.style.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    list = list.filter((p) => p.price <= filters.priceMax);

    if (filters.styles.length) {
      list = list.filter((p) => filters.styles.includes(p.style));
    }
    if (filters.materials.length) {
      list = list.filter((p) => filters.materials.includes(p.material));
    }
    if (filters.colors.length) {
      list = list.filter((p) =>
        p.colors.some((c) => filters.colors.includes(c.name))
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "best":
        list.sort((a, b) => b.reviews - a.reviews);
        break;
      case "new":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
    }

    return list;
  }, [filters, sort, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Products" },
        ]}
      />

      {/* Header */}
      <div className="mt-6 mb-10 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-rosegold">
          {filtered.length} pieces
        </span>
        <h1 className="font-serif text-5xl text-navy mt-2 mb-3">
          {initialStyle ? `${initialStyle}s` : "All Handbags"}
        </h1>
        <p className="text-charcoal/60 max-w-2xl mx-auto">
          {search
            ? `Search results for "${search}"`
            : "Heritage craftsmanship for the woman who carries her own story."}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-charcoal/15 text-sm hover:border-rosegold transition"
        >
          <MenuIcon className="w-4 h-4" />
          Filters
        </button>

        <div className="flex items-center gap-3 ml-auto">
          <label className="text-sm text-charcoal/70">Sort:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-charcoal/15 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rosegold/30 hover:border-rosegold transition"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Sidebar — desktop */}
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        {/* Mobile sidebar */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 animate-slide-in-right">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onClose={() => setMobileFiltersOpen(false)}
                isMobile
              />
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl">
              <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center mx-auto mb-4">
                <CloseIcon className="w-7 h-7 text-rosegold" />
              </div>
              <h3 className="font-serif text-2xl text-navy">No matches found</h3>
              <p className="text-charcoal/60 text-sm mt-2">
                Try widening your filters or clearing your search.
              </p>
              <button
                onClick={() => {
                  setFilters({ priceMax: 50000, colors: [], styles: [], materials: [] });
                  setSearch("");
                  setSearchParams({});
                }}
                className="mt-6 px-6 py-2.5 rounded-full bg-rosegold text-white text-sm hover:bg-rosegold-dark transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <RecentlyViewed />
    </div>
  );
};

export default Products;
