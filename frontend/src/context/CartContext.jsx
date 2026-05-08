import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "zentomart_cart";

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, options = {}) => {
    const { color, size, quantity = 1 } = options;
    const colorName = color?.name || product.colors?.[0]?.name || "Default";
    const sizeName = size || product.sizes?.[0] || "One Size";
    const variantImage = color?.image || product.mainImage;
    const key = `${product.id}-${colorName}-${sizeName}`;

    setItems((prev) => {
      const existing = prev.find((it) => it.key === key);
      if (existing) {
        return prev.map((it) =>
          it.key === key ? { ...it, quantity: it.quantity + quantity } : it
        );
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          color: colorName,
          colorCode: color?.code || product.colors?.[0]?.code || "#000",
          size: sizeName,
          image: variantImage,
          quantity,
          stock: product.stock,
        },
      ];
    });
  };

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) return removeFromCart(key);
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, quantity } : it)));
  };

  const removeFromCart = (key) => {
    setItems((prev) => prev.filter((it) => it.key !== key));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
    // Pakistan shipping: free over Rs. 5,000; otherwise Rs. 250 standard
    const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
    const tax = 0; // No GST display for now — adjust in Admin Settings if needed
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total, itemCount };
  }, [items]);

  const value = {
    items,
    ...totals,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
