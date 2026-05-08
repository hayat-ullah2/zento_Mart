import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext";
import { useToast } from "../../context/ToastContext";
import { filterOptions } from "../../data/products";
import { formatPrice } from "../../hooks/usePriceFormat";
import ImageUpload, { resolveImageUrl } from "../../components/admin/ImageUpload";
import {
  CheckAdminIcon,
  EyeIcon,
  PlusAdminIcon,
  TrashAdminIcon,
} from "../../components/admin/AdminIcons";

const emptyForm = {
  name: "",
  price: "",
  originalPrice: "",
  description: "",
  style: "Tote",
  material: "Genuine Leather",
  stock: 10,
  sizes: ["S", "M", "L"],
  colors: [
    // Start with one empty color variant — admin uploads the image
    { name: "Black", code: "#1A1A1A", image: "" },
  ],
  mainImage: "",
  gallery: [],
  rating: 5.0,
  reviews: 0,
  isNew: true,
  isBestSeller: false,
  inStock: true,
  gender: "Women",
};

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, addProduct, updateProduct } = useProducts();
  const { showToast } = useToast();
  const isEditing = id && id !== "new";

  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (isEditing) {
      const existing = getById(id);
      if (existing) {
        setForm({
          ...existing,
          originalPrice: existing.originalPrice || "",
        });
      }
    }
    // eslint-disable-next-line
  }, [id]);

  const handleField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleSize = (size) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  };

  const updateColor = (idx, patch) => {
    setForm((f) => ({
      ...f,
      colors: f.colors.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    }));
  };

  const addColor = () => {
    const colorChoice = filterOptions.colors.find(
      (c) => !form.colors.some((existing) => existing.name === c.name)
    ) || filterOptions.colors[0];
    setForm((f) => ({
      ...f,
      colors: [
        ...f.colors,
        {
          name: colorChoice.name,
          code: colorChoice.code,
          image: "", // empty — admin will upload the variant image
        },
      ],
    }));
  };

  const removeColor = (idx) => {
    if (form.colors.length === 1) {
      showToast("At least one color is required", "error");
      return;
    }
    setForm((f) => ({ ...f, colors: f.colors.filter((_, i) => i !== idx) }));
  };

  const updateGalleryImage = (idx, value) => {
    setForm((f) => ({
      ...f,
      gallery: f.gallery.map((g, i) => (i === idx ? value : g)),
    }));
  };

  // Add an empty slot. The admin uploads the actual file from there — no auto placeholder.
  const addGalleryImage = () => {
    setForm((f) => ({ ...f, gallery: [...f.gallery, ""] }));
  };

  const removeGalleryImage = (idx) => {
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }));
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim()) {
      showToast("Product name is required", "error");
      setActiveTab("details");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      showToast("Price must be greater than 0", "error");
      setActiveTab("pricing");
      return;
    }
    if (form.colors.length === 0) {
      showToast("Add at least one color", "error");
      setActiveTab("variants");
      return;
    }

    // Find any image the admin has uploaded — variant, mainImage, or gallery
    const cleanedGallery = form.gallery.filter(Boolean);
    const firstVariantImage = form.colors.find((c) => c.image)?.image;
    const fallbackImage =
      firstVariantImage || form.mainImage || cleanedGallery[0] || "";

    if (!fallbackImage) {
      showToast(
        "Upload at least one image (color variant or gallery) before publishing",
        "error"
      );
      setActiveTab("variants");
      return;
    }

    // Auto-fill any color variant that doesn't have an image yet
    const filledColors = form.colors.map((c) => ({
      ...c,
      image: c.image || fallbackImage,
    }));

    const finalProduct = {
      ...form,
      colors: filledColors,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: Number(form.stock),
      rating: Number(form.rating) || 5.0,
      reviews: Number(form.reviews) || 0,
      inStock: Number(form.stock) > 0,
      mainImage: filledColors[0].image,
      gallery: cleanedGallery,
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateProduct(Number(id), finalProduct);
        showToast(`"${finalProduct.name}" updated`, "success");
      } else {
        const created = await addProduct(finalProduct);
        showToast(`"${created.name}" added — visible on storefront`, "success");
      }
      navigate("/admin/products");
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: "details", label: "Details" },
    { id: "images", label: "Images" },
    { id: "variants", label: "Variants" },
    { id: "pricing", label: "Pricing & Stock" },
    { id: "seo", label: "Display" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/admin/products" className="text-xs text-rosegold hover:underline mb-1 inline-block">
            ← Back to Products
          </Link>
          <h1 className="font-serif text-3xl text-navy">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-charcoal/60 text-sm mt-1">
            Pieces saved here appear immediately on the storefront.
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <Link
              to={`/products/${id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-charcoal/15 text-sm hover:border-rosegold transition"
            >
              <EyeIcon className="w-4 h-4" />
              Preview
            </Link>
          )}
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2.5 rounded-full border border-charcoal/15 text-sm hover:border-rosegold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rosegold text-white text-sm font-medium hover:bg-rosegold-dark transition shadow-soft disabled:opacity-60"
          >
            <CheckAdminIcon className="w-4 h-4" />
            {submitting
              ? "Saving…"
              : isEditing
              ? "Save Changes"
              : "Publish Product"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden">
            <div className="flex border-b border-charcoal/5 overflow-x-auto">
              {tabs.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                    activeTab === t.id
                      ? "text-rosegold border-rosegold"
                      : "text-charcoal/60 border-transparent hover:text-charcoal"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {/* DETAILS */}
              {activeTab === "details" && (
                <>
                  <Field label="Product Name *">
                    <input
                      required
                      value={form.name}
                      onChange={(e) => handleField("name", e.target.value)}
                      className="input"
                      placeholder="e.g. Heritage Bridle Satchel"
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      rows="5"
                      value={form.description}
                      onChange={(e) => handleField("description", e.target.value)}
                      className="input resize-none"
                      placeholder="Tell the story of this piece — the leather, the craft, the moment it's made for..."
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Style">
                      <select
                        value={form.style}
                        onChange={(e) => handleField("style", e.target.value)}
                        className="input"
                      >
                        {filterOptions.styles.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Material">
                      <select
                        value={form.material}
                        onChange={(e) => handleField("material", e.target.value)}
                        className="input"
                      >
                        {filterOptions.materials.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </>
              )}

              {/* IMAGES */}
              {activeTab === "images" && (
                <>
                  <p className="text-sm text-charcoal/70">
                    Each color variant has its own image (set in <strong>Variants</strong>). Add extra
                    gallery shots here for the product detail page. Click each tile to upload.
                  </p>
                  <Field label="Gallery Images">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {form.gallery.map((url, idx) => (
                        <ImageUpload
                          key={idx}
                          value={url}
                          onChange={(newUrl) => updateGalleryImage(idx, newUrl)}
                          onRemove={() => removeGalleryImage(idx)}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={addGalleryImage}
                        className="aspect-[4/5] rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 text-charcoal/50 hover:border-rosegold hover:text-rosegold hover:bg-blush/30 transition"
                      >
                        <PlusAdminIcon className="w-6 h-6" />
                        <span className="text-xs uppercase tracking-widest">Add Slot</span>
                      </button>
                    </div>
                  </Field>
                </>
              )}

              {/* VARIANTS */}
              {activeTab === "variants" && (
                <>
                  <Field label="Sizes Available">
                    <div className="flex flex-wrap gap-2">
                      {["XS", "S", "M", "L", "XL", "One Size"].map((size) => {
                        const active = form.sizes.includes(size);
                        return (
                          <button
                            type="button"
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`px-4 py-2 rounded-full text-sm border-2 transition ${
                              active
                                ? "bg-navy text-cream border-navy"
                                : "border-charcoal/15 text-charcoal/70 hover:border-rosegold"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </Field>

                  <Field label="Color Variants — each variant has its own image on the product page">
                    <div className="space-y-3">
                      {form.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="flex flex-wrap gap-3 items-center bg-cream/50 rounded-xl p-3 border border-outline-variant"
                        >
                          <div
                            className="w-10 h-10 rounded-full border-2 border-white shadow-soft shrink-0"
                            style={{ backgroundColor: color.code }}
                          />
                          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex-1 sm:max-w-xs">
                            <select
                              value={color.name}
                              onChange={(e) => {
                                const opt = filterOptions.colors.find((c) => c.name === e.target.value);
                                if (opt) updateColor(idx, { name: opt.name, code: opt.code });
                              }}
                              className="input text-xs"
                            >
                              {filterOptions.colors.map((c) => (
                                <option key={c.name} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                            <input
                              value={color.code}
                              onChange={(e) => updateColor(idx, { code: e.target.value })}
                              placeholder="#000000"
                              className="input text-xs"
                            />
                          </div>
                          <ImageUpload
                            compact
                            value={color.image}
                            onChange={(url) => updateColor(idx, { image: url })}
                          />
                          <button
                            type="button"
                            onClick={() => removeColor(idx)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition shrink-0 ml-auto"
                            aria-label="Remove variant"
                          >
                            <TrashAdminIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addColor}
                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-charcoal/20 text-sm text-charcoal/60 hover:border-rosegold hover:text-rosegold transition"
                      >
                        + Add Color Variant
                      </button>
                    </div>
                  </Field>
                </>
              )}

              {/* PRICING */}
              {activeTab === "pricing" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Sale Price (PKR) *">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50 text-sm">Rs.</span>
                        <input
                          required
                          type="number"
                          step="1"
                          min="0"
                          value={form.price}
                          onChange={(e) => handleField("price", e.target.value)}
                          className="input pl-12"
                          placeholder="2999"
                        />
                      </div>
                    </Field>
                    <Field label="Compare-at Price (optional)">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50 text-sm">Rs.</span>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={form.originalPrice}
                          onChange={(e) => handleField("originalPrice", e.target.value)}
                          className="input pl-12"
                          placeholder="4999"
                        />
                      </div>
                    </Field>
                  </div>
                  <Field label="Stock Quantity">
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => handleField("stock", e.target.value)}
                      className="input"
                    />
                    <p className="text-xs text-charcoal/50 mt-1.5">
                      Stock 0 = Sold out, 1–10 = Low stock, 11+ = In stock
                    </p>
                  </Field>
                </>
              )}

              {/* DISPLAY / SEO */}
              {activeTab === "seo" && (
                <>
                  <Field label="Badges">
                    <div className="flex gap-3 flex-wrap">
                      <ToggleChip
                        active={form.isNew}
                        onChange={(v) => handleField("isNew", v)}
                        label="New Arrival"
                      />
                      <ToggleChip
                        active={form.isBestSeller}
                        onChange={(v) => handleField("isBestSeller", v)}
                        label="Best Seller"
                      />
                    </div>
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Initial Rating (out of 5)">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={form.rating}
                        onChange={(e) => handleField("rating", e.target.value)}
                        className="input"
                      />
                    </Field>
                    <Field label="Initial Review Count">
                      <input
                        type="number"
                        min="0"
                        value={form.reviews}
                        onChange={(e) => handleField("reviews", e.target.value)}
                        className="input"
                      />
                    </Field>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Live preview sidebar */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="bg-white rounded-2xl shadow-soft border border-charcoal/5 overflow-hidden">
            <div className="p-4 border-b border-charcoal/5">
              <p className="text-xs uppercase tracking-widest text-rosegold">Live Preview</p>
              <p className="font-serif text-charcoal text-base mt-0.5">As shoppers will see it</p>
            </div>
            <div className="p-4">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-blush/30 mb-3 flex items-center justify-center">
                {form.colors[0]?.image || form.mainImage ? (
                  <img
                    src={resolveImageUrl(form.colors[0]?.image || form.mainImage)}
                    alt={form.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-charcoal/40 uppercase tracking-widest">
                    No image yet
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                {form.isNew && (
                  <span className="bg-navy text-cream text-[9px] tracking-widest font-medium px-2 py-0.5 rounded-full uppercase">
                    New
                  </span>
                )}
                {form.isBestSeller && (
                  <span className="bg-rosegold text-white text-[9px] tracking-widest font-medium px-2 py-0.5 rounded-full uppercase">
                    Best Seller
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-widest text-rosegold">
                  {form.style}
                </span>
              </div>
              <h4 className="font-serif text-charcoal text-base leading-tight line-clamp-2">
                {form.name || "Product name"}
              </h4>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-charcoal font-semibold">
                  {form.price ? formatPrice(form.price) : "Rs. 0"}
                </span>
                {form.originalPrice && (
                  <span className="text-xs text-charcoal/40 line-through">
                    {formatPrice(form.originalPrice)}
                  </span>
                )}
              </div>
              <div className="flex gap-1.5 mt-2.5">
                {form.colors.slice(0, 5).map((c, i) => (
                  <span
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-charcoal/15"
                    style={{ backgroundColor: c.code }}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">{label}</span>
    {children}
  </label>
);

const ToggleChip = ({ active, onChange, label }) => (
  <button
    type="button"
    onClick={() => onChange(!active)}
    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm transition ${
      active
        ? "bg-rosegold text-white border-rosegold"
        : "border-charcoal/15 text-charcoal/70 hover:border-rosegold"
    }`}
  >
    <span
      className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
        active ? "bg-white border-white" : "border-charcoal/40"
      }`}
    >
      {active && <CheckAdminIcon className="w-3 h-3 text-rosegold" />}
    </span>
    {label}
  </button>
);

export default AdminProductForm;
