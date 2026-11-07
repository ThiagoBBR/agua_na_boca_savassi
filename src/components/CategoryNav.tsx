import type { Category } from '../types';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  tortas: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253v-13z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13V13M17 21v-8" />
    </svg>
  ),
  doces: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 7l5 5m0 0l-5 5m5-5H9" />
    </svg>
  ),
  salgados: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  kits: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  bebidas: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12c0-1.083.373-2.075 1-2.872V7a1 1 0 011-1h16a1 1 0 011 1v2.128c.627.797 1 1.789 1 2.872 0 2.421-1.913 4.379-4.285 4.663V21a1 1 0 01-1 1H8.285a1 1 0 01-1-1v-2.337C4.913 16.379 3 14.421 3 12z" />
    </svg>
  ),
};

export function CategoryNav({ categories, activeCategory, onCategoryChange }: CategoryNavProps) {
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <section
      id="categorias"
      className="py-12 bg-[var(--color-chocolate-900)] border-y border-[var(--color-chocolate-700)]"
      aria-label="Categorias de produtos"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-light text-[var(--color-white)]">
            Nossas <span className="font-medium text-[var(--color-gold-500)]">Categorias</span>
          </h2>
          <p className="text-[var(--color-gray-neutral)] text-sm hidden sm:block">
            Explore nossas especialidades artesanais
          </p>
        </div>

        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          onWheel={handleWheel}
          role="tablist"
          aria-label="Selecione uma categoria"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              role="tab"
              aria-selected={activeCategory === category.id}
              aria-controls={`${category.id}-panel`}
              id={`${category.id}-tab`}
              onClick={() => onCategoryChange(category.id)}
              className={`category-pill flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${activeCategory === category.id ? 'active' : ''}`}
            >
              <span aria-hidden="true">{categoryIcons[category.id] || categoryIcons.tortas}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}