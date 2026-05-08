import { useEffect, useState } from "react";

const STORAGE_KEY = "zentomart_recently_viewed";
const MAX_ITEMS = 6;

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useRecentlyViewed = () => {
  const [ids, setIds] = useState(read);

  // Keep state in sync if another tab/page updates storage
  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY) setIds(read());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addRecentlyViewed = (productId) => {
    setIds((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearRecentlyViewed = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    setIds([]);
  };

  return { ids, addRecentlyViewed, clearRecentlyViewed };
};
