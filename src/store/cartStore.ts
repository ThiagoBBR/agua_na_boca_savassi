import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, CustomerData } from '../types';

interface CartState {
  items: CartItem[];
  customerData: CustomerData | null;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  setCustomerData: (data: CustomerData) => void;
  clearCustomerData: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerData: null,
      isCartOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== productId) };
          }
          return {
            items: state.items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      setCustomerData: (data) => set({ customerData: data }),

      clearCustomerData: () => set({ customerData: null }),
    }),
    {
      name: 'agua-na-boca-cart',
      partialize: (state) => ({ items: state.items, customerData: state.customerData }),
    }
  )
);