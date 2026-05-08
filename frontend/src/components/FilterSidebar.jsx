import { useState } from "react";
import { filterOptions } from "../data/products";
import { CloseIcon } from "./Icons";

const FilterSidebar = ({ filters, setFilters, onClose, isMobile = false }) => {
  const [openSections, setOpenSections] = useState({
    price: true,
    color: true,
    style: true,
    material: true,
  });

  const toggleSection = (key) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  const togglePill = (group, value) => {
    setFilters((prev) => {
      const set = new Set(prev[group] || []);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [group]: Array.from(set) };
    });
  };

  const reset = () =>
    setFilters({ priceMax: 50000, colors: [], styles: [], materials: [] });

  const Section = ({ title, k, children }) => (
    <div className="border-b border-rosegold/15 py-5">
      <button
        onClick={() => toggleSection(k)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="font-serif text-base text-navy">{title}</h3>
        <span className="text-rosegold text-xs">
          {openSections[k] ? "−" : "+"}
        </span>
      </button>
      {openSections[k] && <div className="mt-4">{children}</div>}
    </div>
  );

  return (
    <aside
      className={`${
        isMobile
          ? "w-80 max-w-[85vw] h-full overflow-y-auto bg-[#4c5c2f] p-6"
          : "w-full lg:w-64 lg:shrink-0"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-serif text-xl text-navy">Refine</h2>
        <div className="flex gap-3 items-center">
          <button
            onClick={reset}
            className="text-xs text-rosegold hover:underline"
          >
            Reset
          </button>
          {isMobile && (
            <button onClick={onClose} aria-label="Close filters">
              <CloseIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <Section title="Price" k="price">
        <div>
          <input
            type="range"
            min="1000"
            max="50000"
            step="500"
            value={filters.priceMax}
            onChange={(e) =>
              setFilters({ ...filters, priceMax: Number(e.target.value) })
            }
            className="w-full accent-rosegold"
          />
          <div className="flex justify-between mt-2 text-xs text-charcoal/70">
            <span>Rs. 1k</span>
            <span className="font-medium text-charcoal">
              Up to Rs. {filters.priceMax.toLocaleString("en-PK")}
            </span>
            <span>Rs. 50k</span>
          </div>
        </div>
      </Section>

      <Section title="Color" k="color">
        <div className="grid grid-cols-5 gap-3">
          {filterOptions.colors.map((c) => {
            const active = filters.colors.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => togglePill("colors", c.name)}
                title={c.name}
                className={`w-9 h-9 rounded-full border-2 transition-all relative ${
                  active
                    ? "border-rosegold scale-110 ring-2 ring-rosegold/30 ring-offset-2 ring-offset-cream"
                    : "border-charcoal/15 hover:border-rosegold/50"
                }`}
                style={{ backgroundColor: c.code }}
                aria-label={c.name}
              />
            );
          })}
        </div>
      </Section>

      <Section title="Style" k="style">
        <div className="space-y-2.5">
          {filterOptions.styles.map((s) => {
            const active = filters.styles.includes(s);
            return (
              <label
                key={s}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <span
                  className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                    active
                      ? "bg-rosegold border-rosegold"
                      : "border-charcoal/30 group-hover:border-rosegold"
                  }`}
                >
                  {active && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => togglePill("styles", s)}
                  className="hidden"
                />
                <span className="text-sm text-charcoal/80 group-hover:text-charcoal">
                  {s}
                </span>
              </label>
            );
          })}
        </div>
      </Section>

      <Section title="Material" k="material">
        <div className="flex flex-wrap gap-2">
          {filterOptions.materials.map((m) => {
            const active = filters.materials.includes(m);
            return (
              <button
                key={m}
                onClick={() => togglePill("materials", m)}
                className={`px-3 py-1.5 rounded-full text-xs border transition ${
                  active
                    ? "bg-navy text-cream border-navy"
                    : "bg-white text-charcoal/70 border-charcoal/15 hover:border-rosegold hover:text-rosegold"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </Section>
    </aside>
  );
};

export default FilterSidebar;
