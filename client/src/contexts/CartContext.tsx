import { createContext, useContext, useState, ReactNode } from "react";
import type { Project, Service } from "@shared/schema";

export interface CartItem {
  id: string;
  type: 'project' | 'service';
  item: Project | Service;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Project | Service, type: 'project' | 'service') => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Project | Service, type: 'project' | 'service') => {
    const id = `${type}-${item.id}`;
    
    setItems(currentItems => {
      const existingItem = currentItems.find(cartItem => cartItem.id === id);
      
      if (existingItem) {
        return currentItems.map(cartItem =>
          cartItem.id === id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...currentItems, { id, type, item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, cartItem) => {
      const price = parseFloat(cartItem.item.price || "0");
      return total + (price * cartItem.quantity);
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}