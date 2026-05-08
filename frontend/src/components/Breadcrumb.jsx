import { Link } from "react-router-dom";
import { ChevronRightIcon } from "./Icons";

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="text-xs sm:text-sm">
      <ol className="flex items-center flex-wrap gap-1.5 text-charcoal/60">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {!isLast && item.to ? (
                <Link
                  to={item.to}
                  className="hover:text-rosegold transition tracking-wide"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={`${isLast ? "text-charcoal font-medium" : ""} tracking-wide`}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRightIcon className="w-3.5 h-3.5 text-charcoal/40" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
