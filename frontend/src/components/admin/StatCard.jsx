import { TrendDownIcon, TrendUpIcon } from "./AdminIcons";

const StatCard = ({ icon: Icon, label, value, change, trend = "up", accent = "rosegold" }) => {
  const accents = {
    rosegold: "from-rosegold/15 to-rosegold/5 text-rosegold",
    navy: "from-navy/15 to-navy/5 text-navy",
    emerald: "from-emerald-100 to-emerald-50 text-emerald-700",
    amber: "from-amber-100 to-amber-50 text-amber-700",
  };
  const TrendIcon = trend === "up" ? TrendUpIcon : TrendDownIcon;
  const trendColor = trend === "up" ? "text-emerald-600" : "text-red-500";

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-soft border border-charcoal/5 hover:shadow-luxury transition">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center ${accents[accent]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change != null && (
          <span className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {change}%
          </span>
        )}
      </div>
      <p className="text-charcoal/50 text-xs uppercase tracking-widest mb-1.5">{label}</p>
      <p className="font-serif text-3xl text-navy font-semibold leading-tight">{value}</p>
    </div>
  );
};

export default StatCard;
