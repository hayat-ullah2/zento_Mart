import { useRef, useState } from "react";

const ImageZoom = ({ src, alt }) => {
  const containerRef = useRef(null);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-blush/30 cursor-zoom-in shadow-luxury"
        onMouseEnter={() => setZoomVisible(true)}
        onMouseLeave={() => setZoomVisible(false)}
        onMouseMove={handleMove}
        onTouchMove={(e) => {
          if (e.touches[0]) {
            const t = e.touches[0];
            handleMove({ clientX: t.clientX, clientY: t.clientY });
          }
        }}
        onTouchStart={() => setZoomVisible(true)}
        onTouchEnd={() => setTimeout(() => setZoomVisible(false), 1500)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Zoom lens (visible on hover) */}
        {zoomVisible && (
          <div
            className="absolute hidden md:block w-32 h-32 border-2 border-rosegold rounded-full pointer-events-none shadow-luxury"
            style={{
              left: `calc(${pos.x}% - 64px)`,
              top: `calc(${pos.y}% - 64px)`,
              backgroundImage: `url(${src})`,
              backgroundSize: "300% 300%",
              backgroundPosition: `${pos.x}% ${pos.y}%`,
              backgroundColor: "white",
            }}
          />
        )}

        {/* Hint */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-charcoal text-xs px-3 py-1.5 rounded-full pointer-events-none flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Hover to zoom
        </div>
      </div>

      {/* Side zoom panel (desktop) */}
      {zoomVisible && (
        <div
          className="hidden lg:block absolute top-0 left-full ml-6 w-[500px] aspect-[4/5] rounded-3xl border border-rosegold/30 shadow-luxury pointer-events-none bg-white overflow-hidden z-30"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "220%",
            backgroundPosition: `${pos.x}% ${pos.y}%`,
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;
