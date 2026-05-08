import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../hooks/usePriceFormat";
import { BagIcon, HeartIcon } from "./Icons";
import { cartIconRef } from "./Navbar";
import Rating from "./Rating";
import BuyNowModal from "./BuyNowModal";

const ProductCard = ({ product, compact = false }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const liked = isInWishlist(product.id);
  const imgRef = useRef(null);
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBuyOpen(true);
  };
  // 3D tilt: rotation in deg + cursor-relative position (0..1) for the highlight
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  // Only enable tilt/highlight on devices with a real pointer — phones/tablets
  // get a clean static card with the same shadow + image-zoom behavior.
  const canHover =
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  const TILT_MAX = 8; // degrees — keep subtle for luxury feel

  const handleMouseMove = (e) => {
    if (!canHover) return;
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;   // 0..1
    const py = (e.clientY - r.top) / r.height;   // 0..1
    setTilt({
      ry: (px - 0.5) * 2 * TILT_MAX,             // left→right rotates Y
      rx: -(py - 0.5) * 2 * TILT_MAX,            // top→bottom rotates X (inverted)
      mx: px * 100,
      my: py * 100,
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const triggerFlyToCart = (origin) => {
    if (!cartIconRef.current || !imgRef.current) return;
    const start = origin || imgRef.current.getBoundingClientRect();
    const end = cartIconRef.current.getBoundingClientRect();
    const ghost = document.createElement("img");
    ghost.src = product.mainImage;
    ghost.style.cssText = `
      position: fixed;
      left: ${start.left + start.width / 2 - 30}px;
      top: ${start.top + start.height / 2 - 30}px;
      width: 60px;
      height: 75px;
      border-radius: 12px;
      object-fit: cover;
      z-index: 1000;
      pointer-events: none;
      transition: all 0.7s cubic-bezier(0.5, -0.3, 0.5, 1.4);
      box-shadow: 0 12px 30px rgba(106, 91, 94, 0.35);
    `;
    document.body.appendChild(ghost);
    requestAnimationFrame(() => {
      ghost.style.left = `${end.left + end.width / 2 - 12}px`;
      ghost.style.top = `${end.top + end.height / 2 - 12}px`;
      ghost.style.width = "24px";
      ghost.style.height = "24px";
      ghost.style.opacity = "0.2";
      ghost.style.transform = "rotate(20deg)";
    });
    setTimeout(() => ghost.remove(), 800);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    triggerFlyToCart();
    addToCart(product, { quantity: 1 });
    showToast(`${product.name} added to cart`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(
      liked ? `Removed from wishlist` : `${product.name} saved to wishlist`,
      liked ? "info" : "success"
    );
  };

  return (
    <>
    <Link
      ref={cardRef}
      to={`/products/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden relative will-change-transform [transform-style:preserve-3d] transition-[transform,box-shadow] duration-300 ease-out"
      style={{
        transform: canHover
          ? `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) ${
              hovered ? "scale(1.015)" : "scale(1)"
            }`
          : "none",
        boxShadow: hovered
          ? "0 24px 50px -16px rgba(28, 27, 27, 0.28), 0 6px 14px -6px rgba(28, 27, 27, 0.18)"
          : "0 14px 32px -14px rgba(28, 27, 27, 0.22), 0 4px 10px -4px rgba(28, 27, 27, 0.10)",
      }}
      onMouseEnter={() => canHover && setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left accent — refined two-tone luxury stripe */}
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-[3px] sm:w-[4px] z-10"
        style={{
          background:
            "linear-gradient(180deg, #d5c2c6 0%, #e9c349 50%, #6a5b5e 100%)",
          boxShadow: "0 0 10px rgba(233, 195, 73, 0.35)",
          transform: "translateZ(40px)",
        }}
      />

      {/* Image */}
      <div
        className="relative aspect-[4/5] overflow-hidden bg-blush/30"
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
      >
        <img
          ref={imgRef}
          src={product.mainImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Specular highlight — follows cursor */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.35), rgba(255,255,255,0) 45%)`,
            mixBlendMode: "soft-light",
          }}
        />

        {/* Hover overlay image (gallery second image) */}
        {product.gallery?.[1] && (
          <img
            src={product.gallery[1]}
            alt=""
            aria-hidden
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-navy text-cream text-[10px] tracking-widest font-medium px-2.5 py-1 rounded-full uppercase">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-rosegold text-white text-[10px] tracking-widest font-medium px-2.5 py-1 rounded-full uppercase">
              Best Seller
            </span>
          )}
          {discount > 0 && (
            <span className="bg-charcoal text-cream text-[10px] tracking-widest font-medium px-2.5 py-1 rounded-full uppercase">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-soft transition-all hover:scale-110 ${
            liked ? "text-rosegold" : "text-charcoal/70 hover:text-rosegold"
          }`}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon filled={liked} className="w-4 h-4" />
        </button>

        {/* Quick add */}
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`absolute bottom-3 left-3 right-3 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 ${
            product.inStock
              ? "bg-navy/90 text-cream hover:bg-rosegold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
              : "bg-charcoal/60 text-cream/70 cursor-not-allowed opacity-0 group-hover:opacity-100"
          }`}
        >
          <BagIcon className="w-4 h-4" />
          {product.inStock ? "Quick Add" : "Sold Out"}
        </button>
      </div>

      {/* Body */}
      <div
        className={`p-3 sm:p-4 ${compact ? "pb-3" : "pb-4 sm:pb-5"}`}
        style={{ transform: "translateZ(15px)" }}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] uppercase tracking-widest text-rosegold font-medium shrink-0">
            {product.style}
          </span>
          {!compact && <Rating rating={product.rating} reviews={product.reviews} />}
        </div>

        <h3 className="font-serif text-charcoal text-sm sm:text-lg leading-snug line-clamp-1 group-hover:text-rosegold transition-colors">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-charcoal font-semibold text-sm sm:text-base">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[11px] sm:text-xs text-charcoal/40 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {!compact && (
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className={`mt-3 w-full py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              product.inStock
                ? "bg-navy text-cream hover:bg-rosegold"
                : "bg-charcoal/30 text-cream/70 cursor-not-allowed"
            }`}
          >
            <BagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {product.inStock ? "Buy Now" : "Sold Out"}
          </button>
        )}

        {/* Color dots */}
        {!compact && product.colors?.length > 1 && (
          <div className="flex items-center gap-1.5 mt-3">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-3.5 h-3.5 rounded-full border border-charcoal/15"
                style={{ backgroundColor: c.code }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-charcoal/50">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
    {buyOpen && (
      <BuyNowModal product={product} onClose={() => setBuyOpen(false)} />
    )}
    </>
  );
};

export default ProductCard;
