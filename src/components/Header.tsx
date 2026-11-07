import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart as Cart } from 'lucide-react';
import logoImg from '../assets/logo.png';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = useCartStore((state) => state.getTotalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--color-chocolate-900)]/95 backdrop-blur-sm border-b border-[var(--color-chocolate-700)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navegação principal">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <a href="#home" className="flex items-center gap-3" aria-label="Água na Boca Savassi - Início">
              <img src={logoImg} alt="Água na Boca Savassi" className="w-10 h-10 h-auto" />
              <span className="font-display text-2xl font-medium text-[var(--color-white)] hidden sm:block">
                Água na Boca
              </span>
              <span className="font-script text-sm text-[var(--color-gold-500)] hidden md:block">
                Savassi
              </span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-[var(--color-gold-soft)] hover:text-[var(--color-gold-500)] transition-colors"
              aria-label={`Carrinho de compras, ${cartCount} itens`}
            >
              <Cart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-gold-500)] text-[var(--color-chocolate-900)] text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}