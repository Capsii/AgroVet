'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: string;
  description: string;
  quantity: number;
}

export interface PlacedOrder {
  orderId: string;
  placedAt: string;          // ISO date string
  items: CartItem[];
  totalPrice: number;
  status: 'Confirmed' | 'Processing' | 'Delivered';
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: () => void;          // saves to history + clears cart
  cancelOrder: (orderId: string) => void;
  orders: PlacedOrder[];
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY   = 'agrovet_cart';
const ORDERS_KEY = 'agrovet_orders';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items,  setItems]  = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<PlacedOrder[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_KEY);
      if (storedCart) setItems(JSON.parse(storedCart));

      const storedOrders = localStorage.getItem(ORDERS_KEY);
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch {}
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  // Persist orders
  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const addItem = (med: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === med.id);
      if (existing) return prev.map(i => i.id === med.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...med, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const placeOrder = () => {
    if (items.length === 0) return;
    const newOrder: PlacedOrder = {
      orderId: `ORD-${Date.now()}`,
      placedAt: new Date().toISOString(),
      items: [...items],
      totalPrice: items.reduce((s, i) => s + i.price * i.quantity, 0),
      status: 'Confirmed',
    };
    setOrders(prev => [newOrder, ...prev]);
    setItems([]);
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.orderId !== orderId));
  };

  const totalCount = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, placeOrder, cancelOrder, orders, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
