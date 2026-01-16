"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface CartItem {
  productSlug: string;
  productName: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isHydrated: boolean;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (productSlug: string, size: string) => void;
  updateQuantity: (productSlug: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "black-cat-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [items, isHydrated]);

  const addToCart = useCallback((newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const quantity = newItem.quantity || 1;

    setItems((currentItems) => {
      // Check if item with same product and size already exists
      const existingIndex = currentItems.findIndex(
        (item) => item.productSlug === newItem.productSlug && item.size === newItem.size
      );

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      // Add new item
      return [...currentItems, { ...newItem, quantity }];
    });

    // Open cart drawer when item is added
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productSlug: string, size: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => !(item.productSlug === productSlug && item.size === size)
      )
    );
  }, []);

  const updateQuantity = useCallback((productSlug: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productSlug, size);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productSlug === productSlug && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getCartCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isHydrated,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
