export function HeroBanner() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'linear-gradient(rgba(26,20,18,0.85), rgba(26,20,18,0.95)), url("https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80")'
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-chocolate-900)]/60 via-[var(--color-chocolate-900)]/40 to-[var(--color-chocolate-900)]/80" aria-hidden="true" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[var(--color-chocolate-900)]/50 border border-[var(--color-gold-500)]/30 backdrop-blur-sm mb-8 animate-fade-in-up">
            <span className="font-script text-[var(--color-gold-500)] text-lg">✨ Confeitaria Artesanal desde 2019</span>
          </div>

          <h1
            id="hero-title"
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-[var(--color-white)] mb-6 leading-tight animate-fade-in-up hero-title-mobile"
            style={{ animationDelay: '100ms' }}
          >
            Life is Sweeter
            <br />
            <span className="font-medium text-[var(--color-gold-500)]">with Cake</span>
          </h1>

          <p className="font-script text-3xl sm:text-4xl text-[var(--color-gold-soft)] mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Handmade with Love
          </p>

          <p className="text-lg sm:text-xl text-[var(--color-gray-neutral)] max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            Tortas, bolos artesanais, salgados finos e doces feitos com ingredientes nobres e muito carinho.
            Cada mordida é uma experiência única.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <a
              href="#produtos"
              className="btn-primary w-full sm:w-auto text-center"
            >
              Encomendar Agora
            </a>
            <a
              href="#produtos"
              className="btn-secondary w-full sm:w-auto text-center"
            >
              Explorar Menu
            </a>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-[var(--color-gray-neutral)] text-sm animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-gold-500)]" />
              Entrega Rápida & Segura
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-gold-500)]" />
              Ingredientes 100% Naturais
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-gold-500)]" />
              Feito à Mão Diariamente
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow" aria-hidden="true">
          <svg className="w-6 h-6 text-[var(--color-gold-500)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}