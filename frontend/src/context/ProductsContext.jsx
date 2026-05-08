import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, resolveAssetUrl } from "../lib/api";

const ProductsContext = createContext(null);
const SYNC_KEY = "zentomart_products_changed_at";

// Broadcast a "products changed" signal to other tabs of the same origin
const notifyOtherTabs = () => {
  try {
    localStorage.setItem(SYNC_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
};

// Convert any /uploads/* URL the backend returns into a full http URL the
// browser can load. This means every consumer of useProducts() can just
// drop the URL into <img src=…> without thinking.
const normalizeProduct = (p) => {
  if (!p) return p;
  return {
    ...p,
    mainImage: resolveAssetUrl(p.mainImage),
    gallery: (p.gallery || []).map(resolveAssetUrl),
    colors: (p.colors || []).map((c) => ({ ...c, image: resolveAssetUrl(c.image) })),
  };
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/products");
      setProducts((data.products || []).map(normalizeProduct));
    } catch (err) {
      setError(err.message);
      console.error("[ProductsContext] refetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Listen for cross-tab product changes
  useEffect(() => {
    const handler = (e) => {
      if (e.key === SYNC_KEY) refetch();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [refetch]);

  // Refetch when window regains focus — catches changes made while tab was hidden
  useEffect(() => {
    const handler = () => refetch();
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, [refetch]);

  const addProduct = async (product) => {
    const data = await api.post("/products", product);
    const created = normalizeProduct(data.product);
    setProducts((prev) => [created, ...prev]);
    notifyOtherTabs();
    return created;
  };

  const updateProduct = async (id, updates) => {
    const data = await api.put(`/products/${id}`, updates);
    const updated = normalizeProduct(data.product);
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    notifyOtherTabs();
    return updated;
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    notifyOtherTabs();
  };

  const getById = (id) => products.find((p) => p.id === Number(id));

  const getRelated = (product, limit = 6) => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.style === product.style || p.material === product.material)
      )
      .slice(0, limit);
  };

  // Re-seeds the catalog from defaults — kept for compatibility with the admin "Restore Defaults" button.
  // No-op now; could be wired to a backend reseed endpoint in the future.
  const restoreDefaults = async () => {
    await refetch();
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        refetch,
        addProduct,
        updateProduct,
        deleteProduct,
        restoreDefaults,
        getById,
        getRelated,
        customCount: products.length,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
};
