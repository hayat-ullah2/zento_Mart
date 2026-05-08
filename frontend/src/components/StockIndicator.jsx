const StockIndicator = ({ stock, detailed = false }) => {
  let label, color, dot;
  if (stock === 0) {
    label = "Out of Stock";
    color = "text-red-600 bg-red-50 border-red-200";
    dot = "bg-red-500";
  } else if (stock <= 10) {
    label = detailed ? `Low Stock — Only ${stock} left in stock` : "Low Stock";
    color = "text-amber-700 bg-amber-50 border-amber-200";
    dot = "bg-amber-500";
  } else {
    label = "In Stock";
    color = "text-emerald-700 bg-emerald-50 border-emerald-200";
    dot = "bg-emerald-500";
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[11px] font-medium ${color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${stock > 0 ? "animate-pulse" : ""}`} />
      {label}
    </span>
  );
};

export default StockIndicator;
