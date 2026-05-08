import { useRef, useState } from "react";
import { API_BASE, tokenStore } from "../../lib/api";
import {
  CloseAdminIcon,
  ImageIcon,
  PlusAdminIcon,
} from "./AdminIcons";

const IMAGEKIT_URL_ENDPOINT =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_IMAGEKIT_URL_ENDPOINT) || "";

// Resolve a URL like "/uploads/abc.jpg" against the API origin so the <img>
// works regardless of which port the frontend is on.
export const resolveImageUrl = (url) => {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  if (url.startsWith("/uploads")) {
    const apiOrigin = API_BASE.startsWith("http")
      ? new URL(API_BASE).origin
      : window.location.origin;
    return apiOrigin + url;
  }
  if (IMAGEKIT_URL_ENDPOINT && url.startsWith("/")) {
    return `${IMAGEKIT_URL_ENDPOINT.replace(/\/$/, "")}${url}`;
  }
  return url;
};

/**
 * Image picker for admin forms.
 * - Click to open file picker (jpg/png/webp/gif/avif, ≤8 MB)
 * - File is uploaded to /api/uploads, server returns a public URL
 * - That URL is passed back via onChange(url)
 *
 * Props:
 *   value     — current image URL (uploaded or pasted)
 *   onChange  — (url: string) => void
 *   onRemove  — () => void  (optional — shows × if provided)
 *   aspect    — Tailwind aspect class, defaults to "aspect-[4/5]"
 *   showUrlInput — boolean, also exposes a URL paste input (default true)
 *   compact   — smaller layout for color-variant rows (default false)
 */
const ImageUpload = ({
  value,
  onChange,
  onRemove,
  aspect = "aspect-[4/5]",
  showUrlInput = true,
  compact = false,
}) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const token = tokenStore.get();
      const res = await fetch(`${API_BASE}/uploads`, {
        method: "POST",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const previewUrl = resolveImageUrl(value);

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className={`relative group/up flex items-center gap-2.5 px-3 py-2 rounded-lg border-2 transition flex-1 disabled:opacity-50 ${
            previewUrl
              ? "border-outline-variant bg-white hover:border-rosegold"
              : "border-dashed border-rosegold/40 bg-blush/30 hover:bg-blush/60 hover:border-rosegold"
          }`}
        >
          <span className="w-12 h-14 rounded-md overflow-hidden bg-surface-container border border-outline-variant shrink-0 flex items-center justify-center">
            {uploading ? (
              <span className="w-4 h-4 rounded-full border-2 border-rosegold/30 border-t-rosegold animate-spin" />
            ) : previewUrl ? (
              <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-5 h-5 text-rosegold/60" />
            )}
          </span>
          <span className="flex flex-col items-start min-w-0">
            <span className="text-xs font-medium text-charcoal">
              {uploading ? "Uploading…" : previewUrl ? "Replace image" : "Click to upload image"}
            </span>
            <span className="text-[10px] text-charcoal/50">
              {previewUrl ? "JPG · PNG · WebP" : "Required for this variant"}
            </span>
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={handleFile}
          className="hidden"
        />
        {error && (
          <span className="text-xs text-red-600 max-w-[140px] leading-tight">
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className={`${aspect} rounded-xl overflow-hidden bg-surface-container border border-outline-variant`}>
        {uploading ? (
          <div className="w-full h-full flex items-center justify-center text-charcoal/50 gap-3">
            <span className="w-5 h-5 rounded-full border-2 border-rosegold/20 border-t-rosegold animate-spin" />
            <span className="text-xs">Uploading…</span>
          </div>
        ) : previewUrl ? (
          <img src={previewUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-charcoal/50 hover:text-rosegold hover:bg-blush/30 transition"
          >
            <PlusAdminIcon className="w-7 h-7" />
            <span className="text-xs uppercase tracking-widest">Upload Image</span>
            <span className="text-[10px] text-charcoal/40 normal-case tracking-normal">
              JPG · PNG · WebP up to 8MB
            </span>
          </button>
        )}
      </div>

      {previewUrl && !uploading && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-xs font-medium hover:text-rosegold shadow-soft"
          >
            Replace
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-xs font-medium text-red-600 hover:bg-red-600 hover:text-white shadow-soft"
            >
              Remove
            </button>
          )}
        </div>
      )}

      {onRemove && previewUrl && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center opacity-0 group-hover:opacity-100"
          aria-label="Remove image"
        >
          <CloseAdminIcon className="w-3.5 h-3.5" />
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleFile}
        className="hidden"
      />

      {showUrlInput && (
        <div className="mt-2">
          <input
            type="url"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-full px-3 py-2 rounded-md border border-outline-variant text-xs focus:outline-none focus:ring-2 focus:ring-rosegold/30"
          />
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
