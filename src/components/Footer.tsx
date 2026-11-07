import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="2" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navegação: [
      { label: 'Início', href: '#home' },
      { label: 'Produtos', href: '#produtos' },
      { label: 'Coleções', href: '#colecoes' },
      { label: 'Encomendas', href: '#encomendas' },
      { label: 'Sobre Nós', href: '#sobre' },
      { label: 'Contato', href: '#contato' },
    ],
    suporte: [
      { label: 'Perguntas Frequentes', href: '#faq' },
      { label: 'Política de Entrega', href: '#entrega' },
      { label: 'Trocas e Devoluções', href: '#trocas' },
      { label: 'Privacidade', href: '#privacidade' },
      { label: 'Termos de Uso', href: '#termos' },
    ],
    contato: [
      { icon: MapPin, label: 'Rua Antônio de Albuquerque, 840 - Savassi, BH', href: 'https://maps.google.com' },
      { icon: Phone, label: '(31) 99999-9999', href: 'tel:+5531999999999' },
      { icon: Mail, label: 'contato@aguabocasavassi.com.br', href: 'mailto:contato@aguabocasavassi.com.br' },
      { icon: Clock, label: 'Seg-Sex: 8h-20h | Sáb: 8h-18h | Dom: 9h-14h', href: null },
    ],
  };

  return (
    <footer className="bg-[var(--color-chocolate-800)] border-t border-[var(--color-chocolate-700)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-3 mb-6" aria-label="Água na Boca Savassi - Início">
              <div className="w-12 h-12 rounded-full bg-[var(--color-gold-500)] flex items-center justify-center">
                <span className="text-[var(--color-chocolate-900)] font-display text-2xl font-bold">A</span>
              </div>
              <div>
                <span className="font-display text-2xl font-medium text-[var(--color-white)] block">Água na Boca</span>
                <span className="font-script text-sm text-[var(--color-gold-500)]">Savassi</span>
              </div>
            </a>
            <p className="text-[var(--color-gray-neutral)] text-sm mb-6 max-w-xs">
              Confeitaria fina e doces artesanais feitos com ingredientes nobres e muito carinho. Cada mordida é uma experiência única.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[var(--color-chocolate-900)] flex items-center justify-center text-[var(--color-gold-soft)] hover:text-[var(--color-gold-500)] hover:bg-[var(--color-chocolate-700)] transition-all duration-300" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[var(--color-chocolate-900)] flex items-center justify-center text-[var(--color-gold-soft)] hover:text-[var(--color-gold-500)] hover:bg-[var(--color-chocolate-700)] transition-all duration-300" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://wa.me/5531999999999" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[var(--color-chocolate-900)] flex items-center justify-center text-[var(--color-gold-soft)] hover:text-[var(--color-gold-500)] hover:bg-[var(--color-chocolate-700)] transition-all duration-300" aria-label="WhatsApp">
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium text-[var(--color-white)] mb-6">Navegação</h3>
            <nav aria-label="Links de navegação">
              <ul className="space-y-3">
                {footerLinks.navegação.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[var(--color-gray-neutral)] hover:text-[var(--color-gold-500)] transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium text-[var(--color-white)] mb-6">Suporte</h3>
            <nav aria-label="Links de suporte">
              <ul className="space-y-3">
                {footerLinks.suporte.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[var(--color-gray-neutral)] hover:text-[var(--color-gold-500)] transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium text-[var(--color-white)] mb-6">Contato</h3>
            <address className="not-italic space-y-4">
              {footerLinks.contato.map((item, index) => (
                <a key={index} href={item.href || '#'} className="flex items-start gap-3 text-[var(--color-gray-neutral)] hover:text-[var(--color-gold-500)] transition-colors text-sm" target={item.href?.startsWith('http') ? '_blank' : undefined} rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  <item.icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-gold-500)]" aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              ))}
            </address>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-chocolate-700)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[var(--color-gray-neutral)] text-sm">
              © {currentYear} Água na Boca Savassi. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-[var(--color-gray-neutral)]">
              <span>Desenvolvido com carinho</span>
              <span className="text-[var(--color-gold-500)]">♥</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}