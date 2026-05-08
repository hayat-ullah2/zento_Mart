import { StarIcon } from "./Icons";

const Rating = ({ rating, reviews, size = "sm" }) => {
  const starSize = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} className={starSize} filled={n <= Math.round(rating)} />
        ))}
      </div>
      <span className={`text-charcoal/60 ${size === "lg" ? "text-sm" : "text-xs"}`}>
        {rating.toFixed(1)}
        {typeof reviews === "number" && (
          <span className="hidden sm:inline"> ({reviews})</span>
        )}
      </span>
    </div>
  );
};

export default Rating;
