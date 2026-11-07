import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: 'novo' | 'preparando' | 'entregue' | 'cancelado';
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  setOrders: (orders: Order[]) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  setOrders: (orders) => set({ orders }),

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const orders: Order[] = (data || []).map((row: any) => ({
        id: row.id,
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        customerAddress: row.customer_address,
        items: row.items,
        total: row.total,
        status: row.status,
        createdAt: row.created_at,
      }));

      set({ orders, isLoading: false });
    } catch (err: any) {
      console.error('Supabase error, using localStorage fallback:', err.message);
      set({ isLoading: false, error: err.message });
    }
  },

  addOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const orderId = 'order-' + Date.now();
      const newOrder: Order = {
        id: orderId,
        ...orderData,
        status: 'novo',
        createdAt: new Date().toISOString(),
      };

      try {
        const { error } = await supabase.from('orders').insert({
          id: orderId,
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone,
          customer_address: orderData.customerAddress,
          items: orderData.items,
          total: orderData.total,
          status: 'novo',
          created_at: newOrder.createdAt,
        });
        if (error) throw error;
      } catch (err: any) {
        console.error('Supabase insert error:', err.message);
      }

      set((state) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId);
        if (error) throw error;
      } catch (err: any) {
        console.error('Supabase update error:', err.message);
      }

      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteOrder: async (orderId) => {
    try {
      try {
        const { error } = await supabase.from('orders').delete().eq('id', orderId);
        if (error) throw error;
      } catch (err: any) {
        console.error('Supabase delete error:', err.message);
      }

      set((state) => ({
        orders: state.orders.filter((o) => o.id !== orderId),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));