import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { formatPrice } from "../hooks/usePriceFormat";
import Breadcrumb from "../components/Breadcrumb";
import ImageZoom from "../components/ImageZoom";
import RelatedProducts from "../components/RelatedProducts";
import RecentlyViewed from "../components/RecentlyViewed";
import Rating from "../components/Rating";
import StockIndicator from "../components/StockIndicator";
import {
  BagIcon,
  CheckIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShieldIcon,
  SparkleIcon,
  TruckIcon,
} from "../components/Icons";
import { cartIconRef } from "../components/Navbar";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, getRelated, loading } = useProducts();
  const product = getById(id);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addedFlash, setAddedFlash] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const related = useMemo(() => getRelated(product, 6), [product, getRelated]);

  // Reset color/size if product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
      setQuantity(1);
      setActiveImageIdx(0);
      addRecentlyViewed(product.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-32 px-4">
        <div className="inline-flex items-center gap-3 text-charcoal/60">
          <span className="w-6 h-6 rounded-full border-2 border-rosegold/20 border-t-rosegold animate-spin" />
          Loading product…
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto text-center py-32 px-4">
        <h1 className="font-serif text-4xl text-navy mb-4">Product not found</h1>
        <p className="text-charcoal/60 mb-8">
          The piece you're looking for has been retired from our atelier.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-7 py-3.5 rounded-full bg-rosegold text-white font-medium hover:bg-rosegold-dark transition"
        >
          Back to Collection
        </button>
      </div>
    );
  }

  const liked = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Active main image: prefer color swatch image, fall back to gallery
  const mainImage =
    activeImageIdx === 0 ? selectedColor.image : product.gallery[activeImageIdx] || selectedColor.image;

  // Build image strip: color image first, then gallery extras
  const galleryImages = [
    selectedColor.image,
    ...product.gallery.filter((g) => g !== selectedColor.image),
  ];

  const triggerFlyToCart = () => {
    if (!cartIconRef.current) return;
    const startEl = document.querySelector("[data-main-image]");
    if (!startEl) return;
    const start = startEl.getBoundingClientRect();
    const end = cartIconRef.current.getBoundingClientRect();
    const ghost = document.createElement("img");
    ghost.src = mainImage;
    ghost.style.cssText = `
      position: fixed;
      left: ${start.left + start.width / 2 - 40}px;
      top: ${start.top + start.height / 2 - 50}px;
      width: 80px;
      height: 100px;
      border-radius: 14px;
      object-fit: cover;
      z-index: 1000;
      pointer-events: none;
      transition: all 0.8s cubic-bezier(0.5, -0.3, 0.5, 1.4);
      box-shadow: 0 16px 40px rgba(106,91,94,0.4);
    `;
    document.body.appendChild(ghost);
    requestAnimationFrame(() => {
      ghost.style.left = `${end.left + end.width / 2 - 12}px`;
      ghost.style.top = `${end.top + end.height / 2 - 12}px`;
      ghost.style.width = "24px";
      ghost.style.height = "24px";
      ghost.style.opacity = "0.2";
      ghost.style.transform = "rotate(25deg)";
    });
    setTimeout(() => ghost.remove(), 850);
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    triggerFlyToCart();
    addToCart(product, { color: selectedColor, size: selectedSize, quantity });
    showToast(`${product.name} added to cart`, "success");
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1500);
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    showToast(
      liked ? "Removed from wishlist" : `${product.name} saved to wishlist`,
      liked ? "info" : "success"
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          { label: product.style + "s", to: `/products?style=${product.style}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-8">
        {/* GALLERY */}
        <div className="lg:sticky lg:top-28 self-start">
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbs */}
            <div className="flex sm:flex-col gap-3 sm:w-20 shrink-0">
              {galleryImages.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-16 h-20 sm:w-full sm:h-24 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    i === activeImageIdx
                      ? "border-rosegold shadow-soft"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image with zoom */}
            <div className="flex-1 group" data-main-image>
              <ImageZoom
                src={activeImageIdx === 0 ? selectedColor.image : galleryImages[activeImageIdx]}
                alt={product.name}
              />
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div>
          {/* Title block */}
          <div className="flex items-center gap-2 mb-3">
            {product.isBestSeller && (
              <span className="bg-rosegold text-white text-[10px] tracking-widest font-medium px-2.5 py-1 rounded-full uppercase">
                Best Seller
              </span>
            )}
            {product.isNew && (
              <span className="bg-navy text-cream text-[10px] tracking-widest font-medium px-2.5 py-1 rounded-full uppercase">
                New
              </span>
            )}
            <span className="text-xs uppercase tracking-[0.25em] text-rosegold">
              {product.material}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy leading-tight mb-3">
            {product.name}
          </h1>
          <div className="flex items-center gap-4 mb-5">
            <Rating rating={product.rating} reviews={product.reviews} size="lg" />
            <span className="text-charcoal/40">|</span>
            <StockIndicator stock={product.stock} detailed />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-serif text-3xl sm:text-4xl text-navy font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base text-charcoal/40 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs font-medium text-rosegold bg-blush px-2 py-1 rounded-full">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-charcoal/70 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* COLOR SWATCHES */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium tracking-widest uppercase text-charcoal">
                Color
              </h3>
              <span className="text-sm text-charcoal/70 font-medium">
                {selectedColor.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => {
                const active = c.name === selectedColor.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColor(c);
                      setActiveImageIdx(0);
                    }}
                    title={c.name}
                    aria-label={c.name}
                    className={`relative w-12 h-12 rounded-full transition-all ${
                      active
                        ? "ring-2 ring-rosegold ring-offset-2 ring-offset-cream scale-110"
                        : "hover:scale-105"
                    }`}
                  >
                    <span
                      className="absolute inset-1 rounded-full border border-charcoal/15 shadow-soft"
                      style={{ backgroundColor: c.code }}
                    />
                    {active && (
                      <CheckIcon className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SIZES */}
          {product.sizes.length > 1 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium tracking-widest uppercase text-charcoal">
                  Size
                </h3>
                <a href="#" className="text-xs text-rosegold hover:underline">
                  Size Guide
                </a>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => {
                  const active = s === selectedSize;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[3.5rem] px-4 py-2.5 rounded-full border-2 text-sm font-medium transition ${
                        active
                          ? "bg-navy text-cream border-navy"
                          : "border-charcoal/15 text-charcoal hover:border-rosegold hover:text-rosegold"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div className="mb-8">
            <h3 className="text-sm font-medium tracking-widest uppercase text-charcoal mb-3">
              Quantity
            </h3>
            <div className="inline-flex items-center border-2 border-charcoal/15 rounded-full">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2.5 hover:text-rosegold disabled:opacity-30"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <MinusIcon className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 font-medium min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock || 1, q + 1))
                }
                disabled={quantity >= product.stock}
                className="px-4 py-2.5 hover:text-rosegold disabled:opacity-30"
                aria-label="Increase quantity"
              >
                <PlusIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 relative overflow-hidden flex items-center justify-center gap-2 py-4 rounded-full font-medium tracking-wide transition shadow-luxury ${
                !product.inStock
                  ? "bg-charcoal/30 text-cream/70 cursor-not-allowed"
                  : addedFlash
                  ? "bg-emerald-500 text-white"
                  : "bg-rosegold hover:bg-rosegold-dark text-white"
              }`}
            >
              {addedFlash ? (
                <>
                  <CheckIcon className="w-5 h-5" />
                  Added to Bag!
                </>
              ) : !product.inStock ? (
                "Sold Out"
              ) : (
                <>
                  <BagIcon className="w-5 h-5" />
                  Add to Bag — {formatPrice(product.price * quantity)}
                </>
              )}
              {/* Ripple */}
              {addedFlash && (
                <span className="absolute inset-0 bg-white/30 animate-fade-in" />
              )}
            </button>

            <button
              onClick={handleWishlist}
              aria-label="Toggle wishlist"
              className={`p-4 rounded-full border-2 transition ${
                liked
                  ? "border-rosegold bg-rosegold text-white"
                  : "border-charcoal/15 text-charcoal hover:border-rosegold hover:text-rosegold"
              }`}
            >
              <HeartIcon filled={liked} className="w-5 h-5" />
            </button>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y border-rosegold/15 mb-8">
            <Trust icon={<TruckIcon className="w-5 h-5" />} label="Free shipping over Rs. 5,000" />
            <Trust icon={<ShieldIcon className="w-5 h-5" />} label="2-Year warranty" />
            <Trust icon={<SparkleIcon className="w-5 h-5" />} label="Made in Italy" />
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-6 border-b border-charcoal/10 mb-5">
              {["description", "details", "shipping"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`pb-3 text-sm uppercase tracking-widest font-medium transition border-b-2 -mb-px ${
                    activeTab === t
                      ? "text-rosegold border-rosegold"
                      : "text-charcoal/50 border-transparent hover:text-charcoal"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="text-charcoal/70 text-sm leading-relaxed min-h-[120px]">
              {activeTab === "description" && (
                <p>
                  {product.description} Each piece is finished by hand, with care
                  taken at every seam — from the rolled handles to the edge-painted
                  trim. Your bag will arrive nestled in a soft dust bag and
                  protective box, ready to be cherished.
                </p>
              )}
              {activeTab === "details" && (
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>Material: {product.material}</li>
                  <li>Style: {product.style}</li>
                  <li>Hardware: Rose-gold finish</li>
                  <li>Lining: Soft suede interior</li>
                  <li>Closure: Magnetic snap with leather strap detail</li>
                  <li>Made in Florence, Italy</li>
                </ul>
              )}
              {activeTab === "shipping" && (
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>Complimentary shipping on orders over Rs. 5,000</li>
                  <li>Standard delivery: 3–5 business days</li>
                  <li>Express delivery: 1–2 business days (Rs. 500)</li>
                  <li>30-day free returns on unworn items</li>
                  <li>2-year atelier warranty included</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      <RelatedProducts products={related} />

      {/* Recently Viewed */}
      <RecentlyViewed excludeId={product.id} />
    </div>
  );
};

const Trust = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-2 text-center text-charcoal">
    <span className="text-rosegold">{icon}</span>
    <span className="text-[11px] leading-tight">{label}</span>
  </div>
);

export default ProductDetails;
