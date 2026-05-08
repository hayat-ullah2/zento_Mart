import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

const RelatedProducts = ({ products, title = "You May Also Love" }) => {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      el.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [products]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-rel-card]");
    const distance = card ? card.clientWidth + 24 : 320;
    el.scrollBy({ left: dir * distance, behavior: "smooth" });
  };

  if (!products?.length) return null;

  return (
    <section className="py-12">
      <div className="flex justify-between items-end mb-8 gap-4 flex-wrap">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-rosegold">
            Curated for you
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-navy mt-2">{title}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            aria-label="Previous"
            className={`w-11 h-11 rounded-full border border-rosegold/30 flex items-center justify-center transition ${
              canPrev
                ? "hover:bg-rosegold hover:text-white hover:border-rosegold"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            aria-label="Next"
            className={`w-11 h-11 rounded-full border border-rosegold/30 flex items-center justify-center transition ${
              canNext
                ? "hover:bg-rosegold hover:text-white hover:border-rosegold"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar"
      >
        {products.map((p) => (
          <div
            key={p.id}
            data-rel-card
            className="snap-start shrink-0 w-[78%] sm:w-[44%] lg:w-[23.5%]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
