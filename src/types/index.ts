export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  weight?: string;
  rating?: number;
  reviews?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
}

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