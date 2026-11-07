import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryNav } from './components/CategoryNav';
import { ProductsPreview } from './components/ProductsPreview';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { useAuthStore } from './store/authStore';
import { useProductStore } from './store/productStore';
import type { Category } from './types';

const categories: Category[] = [
  { id: 'tortas', name: 'Tortas & Bolos', icon: '🎂' },
  { id: 'doces', name: 'Doces Finos', icon: '🧁' },
  { id: 'salgados', name: 'Salgados', icon: '🥖' },
  { id: 'kits', name: 'Kits Festa', icon: '🎁' },
  { id: 'bebidas', name: 'Bebidas', icon: '☕' },
];

function PublicLayout() {
  const [activeCategory, setActiveCategory] = useState<string>('tortas');
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const currentProducts = products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroBanner />
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <ProductsPreview
          products={currentProducts}
          category={activeCategory}
        />
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;