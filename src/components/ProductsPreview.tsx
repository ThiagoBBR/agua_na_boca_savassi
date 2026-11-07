import { useState } from 'react';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { Check } from 'lucide-react';

interface ProductsPreviewProps {
  products: Product[];
  category: string;
}

export function ProductsPreview({ products, category }: ProductsPreviewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const isAdded = (productId: string) => addedProductId === productId;

  return (
    <section
      id={`${category}-panel`}
      role="tabpanel"
      aria-labelledby={`${category}-tab`}
      className="py-16 bg-[var(--color-chocolate-900)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-3xl font-light text-[var(--color-white)]">
            {category === 'tortas' && 'Tortas & Bolos Artesanais'}
            {category === 'doces' && 'Doces Finos & Cupcakes'}
            {category === 'salgados' && 'Salgados Finos'}
            {category === 'kits' && 'Kits Festa & Presentes'}
            {category === 'bebidas' && 'Bebidas Artesanais'}
          </h2>
          <a
            href="#produtos"
            className="text-[var(--color-gold-500)] hover:text-[var(--color-gold-400)] font-medium text-sm flex items-center gap-1 transition-colors"
          >
            Ver todos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <article key={product.id} className="card-product group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {product.rating && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-[var(--color-chocolate-900)]/90 backdrop-blur-sm rounded-full">
                    <svg className="w-4 h-4 text-[var(--color-gold-500)]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-[var(--color-white)]">{product.rating}</span>
                    <span className="text-xs text-[var(--color-gray-neutral)]">({product.reviews})</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                {product.weight && (
                  <span className="text-xs text-[var(--color-gold-500)] font-medium uppercase tracking-wider">
                    {product.weight}
                  </span>
                )}
                <h3 className="font-display text-lg font-medium text-[var(--color-white)] mt-2 mb-2 group-hover:text-[var(--color-gold-500)] transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-[var(--color-gray-neutral)] line-clamp-2 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl font-medium text-[var(--color-gold-500)]">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isAdded(product.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isAdded(product.id)
                        ? 'bg-green-500 text-white cursor-default'
                        : 'bg-[var(--color-gold-500)] text-[var(--color-chocolate-900)] font-bold text-lg hover:bg-[var(--color-gold-400)] hover:scale-105'
                    }`}
                    aria-label={isAdded(product.id) ? `${product.name} adicionado ao carrinho` : `Adicionar ${product.name} ao carrinho`}
                  >
                    {isAdded(product.id) ? <Check className="w-5 h-5" /> : '+'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}