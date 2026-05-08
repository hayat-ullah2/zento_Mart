// Hand-rolled SVG charts so we don't need a chart library

export const LineChart = ({ data, valueKey = "revenue", height = 240, accent = "#6a5b5e" }) => {
  if (!data?.length) return null;
  const w = 800;
  const h = height;
  const padding = { top: 20, right: 20, bottom: 36, left: 50 };
  const innerW = w - padding.left - padding.right;
  const innerH = h - padding.top - padding.bottom;

  const max = Math.max(...data.map((d) => d[valueKey])) * 1.15;
  const min = 0;

  const x = (i) => padding.left + (i / (data.length - 1)) * innerW;
  const y = (v) => padding.top + innerH - ((v - min) / (max - min)) * innerH;

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d[valueKey])}`)
    .join(" ");

  const areaPath = `${linePath} L ${x(data.length - 1)} ${padding.top + innerH} L ${x(0)} ${padding.top + innerH} Z`;

  // Y-axis ticks
  const ticks = 4;
  const tickValues = Array.from({ length: ticks + 1 }, (_, i) =>
    Math.round((max / ticks) * i)
  );

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y grid + labels */}
        {tickValues.map((v, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              x2={w - padding.right}
              y1={y(v)}
              y2={y(v)}
              stroke="#1c1b1b"
              strokeOpacity="0.06"
              strokeDasharray="4 4"
            />
            <text
              x={padding.left - 10}
              y={y(v) + 4}
              fill="#1c1b1b"
              fillOpacity="0.45"
              fontSize="11"
              textAnchor="end"
            >
              ${v.toLocaleString()}
            </text>
          </g>
        ))}

        {/* X labels (every other) */}
        {data.map((d, i) =>
          i % Math.ceil(data.length / 7) === 0 ? (
            <text
              key={i}
              x={x(i)}
              y={h - 12}
              fill="#1c1b1b"
              fillOpacity="0.5"
              fontSize="11"
              textAnchor="middle"
            >
              {d.day}
            </text>
          ) : null
        )}

        {/* Area + line */}
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Points */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(d[valueKey])} r="4" fill="white" stroke={accent} strokeWidth="2" />
            <title>{`${d.day}: $${d[valueKey].toLocaleString()}`}</title>
          </g>
        ))}
      </svg>
    </div>
  );
};

export const DonutChart = ({ data, size = 200 }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const r = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;
  const stroke = 20;

  let cumulative = 0;
  const arcs = data.map((d) => {
    const startAngle = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
    cumulative += d.value;
    const endAngle = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return {
      ...d,
      path: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
    };
  });

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        {arcs.map((a, i) => (
          <path
            key={i}
            d={a.path}
            stroke={a.color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="butt"
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-navy font-serif" fontSize="22" fontWeight="600">
          {total}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#1c1b1b" fillOpacity="0.5" fontSize="10">
          traffic
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-charcoal/80 min-w-[80px]">{d.name}</span>
            <span className="text-charcoal font-medium">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const BarMini = ({ values, height = 40, accent = "#6a5b5e" }) => {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {values.map((v, i) => (
        <div
          key={i}
          className="rounded-sm transition-all hover:opacity-80"
          style={{
            height: `${(v / max) * 100}%`,
            width: 6,
            backgroundColor: accent,
            opacity: 0.4 + (v / max) * 0.6,
          }}
        />
      ))}
    </div>
  );
};
