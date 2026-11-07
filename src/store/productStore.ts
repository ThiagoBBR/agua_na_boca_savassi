import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const products: Product[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        image: row.image,
        category: row.category,
        weight: row.weight,
        rating: row.rating,
        reviews: row.reviews,
      }));

      set({ products, isLoading: false });
    } catch (err: any) {
      console.error('Supabase products error, using localStorage fallback:', err.message);
      const saved = localStorage.getItem('agua-na-boca-products');
      if (saved) {
        try {
          set({ products: JSON.parse(saved), isLoading: false });
        } catch {
          set({ products: [], isLoading: false });
        }
      } else {
        set({ products: [], isLoading: false });
      }
    }
  },

  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const productId = 'prod-' + Date.now();
      const newProduct: Product = {
        id: productId,
        ...productData,
      };

      try {
        const { error } = await supabase.from('products').insert({
          id: productId,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image,
          category: productData.category,
          weight: productData.weight,
          rating: productData.rating,
          reviews: productData.reviews,
          created_at: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err: any) {
        console.error('Supabase product insert error:', err.message);
      }

      set((state) => ({
        products: [newProduct, ...state.products],
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  updateProduct: async (id, productData) => {
    try {
      try {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
        if (error) throw error;
      } catch (err: any) {
        console.error('Supabase product update error:', err.message);
      }

      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...productData } : p
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteProduct: async (id) => {
    try {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
      } catch (err: any) {
        console.error('Supabase product delete error:', err.message);
      }

      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));