import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Service {
  id: number;
  name: string;
  price: number;
  [key: string]: any;
}

interface CartContextType {
  cart: Service[];
  addToCart: (service: Service) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalDuration: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Service[]>([]);

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.id === service.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing && existing.quantity && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => setCart([]);

  const getTotalAmount = () => cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const getTotalDuration = () => cart.reduce((sum, item) => sum + (item.durationInMinutes || 0) * (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotalAmount, getTotalDuration }}>
      {children}
    </CartContext.Provider>
  );
};
