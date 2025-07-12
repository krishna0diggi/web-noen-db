import React from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, MessageCircle, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CartModalContent = ({ onWhatsApp, onWebsite, onClose, removeFromCart, addToCart }) => {
  const { cart } = useCart();
  const getTotalAmount = () => cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const getTotalDuration = () => cart.reduce((sum, item) => sum + (item.durationInMinutes || 0) * (item.quantity || 1), 0);

  return (
    <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          Your Selected Services
        </h2>
        <Button size="icon" variant="ghost" onClick={onClose}>
          ✕
        </Button>
      </div>
      <div className="space-y-6">
        <div className="space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">No services in cart.</div>
          ) : cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-gray-500 ml-2">({item.categoryName || item.category?.name})</span>
                <div className="text-sm text-gray-500">Qty: {item.quantity || 1}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">₹{item.price * (item.quantity || 1)}</span>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addToCart(item)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {cart.length > 0 && (
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg font-semibold text-lg">
              <span>Total ({getTotalDuration()} mins)</span>
              <span>₹{getTotalAmount()}</span>
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Choose Your Booking Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={onWhatsApp}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Book via WhatsApp
              </Button>
              <Button
                onClick={onWebsite}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Login & Book Online
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              WhatsApp booking: Instant booking via chat | Online booking: Track your appointments & history
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModalContent;
