import React from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

const Cart = ({ onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button onClick={onClose} className="text-lg">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">No services in cart.</div>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-muted-foreground">₹{item.price}</div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.id)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-4 border-t flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={() => {
            const msg = encodeURIComponent(
              `Hi, I want to book these services: \n${cart.map((s) => `- ${s.name} (₹${s.price})`).join("\n")}`
            );
            window.open(`https://wa.me/?text=${msg}`, "_blank");
          }}
          disabled={cart.length === 0}
        >
          Book via WhatsApp
        </Button>
        <Button className="w-full" variant="outline" disabled={cart.length === 0}>
          Book via Website
        </Button>
        <Button className="w-full" variant="ghost" onClick={clearCart} disabled={cart.length === 0}>
          Clear Cart
        </Button>
      </div>
    </div>
  );
};

export default Cart;
