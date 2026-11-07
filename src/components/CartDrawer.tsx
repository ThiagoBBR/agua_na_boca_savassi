import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { X, Plus, Minus, Trash2, MapPin, Phone, User, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { CustomerData } from '../types';

const WHATSAPP_NUMBER = '553132231570';

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const setCustomerData = useCartStore((state) => state.setCustomerData);
  const customerData = useCartStore((state) => state.customerData);
  const addOrder = useOrderStore((state) => state.addOrder);

  const [step, setStep] = useState<'cart' | 'customer' | 'sending' | 'success'>('cart');
  const [formData, setFormData] = useState<CustomerData>({
    name: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<CustomerData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customerData) {
      setFormData(customerData);
    }
  }, [customerData]);

  useEffect(() => {
    if (isOpen) {
      setStep('cart');
      setFormData({ name: '', phone: '', address: '' });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Partial<CustomerData> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      if (digits.length <= 2) return `(${digits}`;
      if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const generateWhatsAppMessage = () => {
    const itemsList = items.map(item => 
      `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`
    ).join('\n');

    return `*🍰 Novo Pedido - Água na Boca Savassi*\n\n` +
           `*Cliente:*\n` +
           `👤 Nome: ${formData.name}\n` +
           `📱 Telefone: ${formData.phone}\n` +
           `📍 Endereço: ${formData.address}\n\n` +
           `*Itens do Pedido:*\n${itemsList}\n\n` +
           `*Total: R$ ${totalPrice.toFixed(2).replace('.', ',')}*\n\n` +
           `_Pedido realizado via cardápio digital_`;
  };

  const handleWhatsAppSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setStep('sending');

    setCustomerData(formData);

    try {
      const message = generateWhatsAppMessage();
      const orderItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      await addOrder({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        items: orderItems,
        total: totalPrice,
        status: 'novo',
      });

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setStep('success');
    } catch {
      setStep('customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCart = () => setStep('cart');

  const handleNewOrder = () => {
    clearCart();
    setFormData({ name: '', phone: '', address: '' });
    setErrors({});
    setStep('cart');
    closeCart();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={step === 'cart' ? closeCart : undefined}
        aria-hidden="true"
      />
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--color-chocolate-800)] border-l border-[var(--color-chocolate-700)] z-50 flex flex-col animate-slide-in-right"
        role="dialog"
        aria-label={step === 'cart' ? 'Carrinho de compras' : 'Dados do cliente'}
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-chocolate-700)]">
          <h2 className="font-display text-xl font-medium text-[var(--color-white)]">
            {step === 'cart' ? `Carrinho (${totalItems})` : step === 'customer' ? 'Dados para Entrega' : step === 'sending' ? 'Enviando...' : 'Pedido Enviado!'}
          </h2>
          {step === 'customer' && (
            <button
              onClick={handleBackToCart}
              className="p-2 text-[var(--color-gray-neutral)] hover:text-[var(--color-white)] transition-colors rounded-lg hover:bg-[var(--color-chocolate-700)]"
              aria-label="Voltar ao carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {step === 'cart' && (
            <button
              onClick={closeCart}
              className="p-2 text-[var(--color-gray-neutral)] hover:text-[var(--color-white)] transition-colors rounded-lg hover:bg-[var(--color-chocolate-700)]"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg className="w-16 h-16 text-[var(--color-gray-neutral)]/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-[var(--color-gray-neutral)] mb-2">Seu carrinho está vazio</p>
                  <p className="text-sm text-[var(--color-gray-neutral)]/70">Adicione produtos deliciosos ao seu pedido</p>
                </div>
              ) : (
                <ul className="space-y-4" role="list" aria-label="Itens do carrinho">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 p-3 bg-[var(--color-chocolate-900)]/50 rounded-xl border border-[var(--color-chocolate-700)]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[var(--color-white)] truncate">{item.name}</h3>
                        <p className="text-sm text-[var(--color-gold-500)] font-medium">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-[var(--color-chocolate-900)] text-[var(--color-gold-soft)] hover:text-[var(--color-gold-500)] flex items-center justify-center transition-colors"
                            aria-label={`Diminuir quantidade de ${item.name}`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-medium text-[var(--color-white)]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-[var(--color-chocolate-900)] text-[var(--color-gold-soft)] hover:text-[var(--color-gold-500)] flex items-center justify-center transition-colors"
                            aria-label={`Aumentar quantidade de ${item.name}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <span className="ml-auto font-display text-[var(--color-gold-500)]">
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-[var(--color-gray-neutral)] hover:text-red-400 transition-colors rounded-lg hover:bg-[var(--color-chocolate-900)] flex-shrink-0"
                        aria-label={`Remover ${item.name} do carrinho`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {step === 'customer' && (
            <form onSubmit={(e) => { e.preventDefault(); handleWhatsAppSubmit(); }} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">
                  <User className="w-4 h-4 inline mr-1" /> Nome Completo *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  onBlur={() => validateForm()}
                  className={`w-full px-4 py-3 rounded-lg bg-[var(--color-chocolate-900)] border transition-colors ${
                    errors.name ? 'border-red-500' : 'border-[var(--color-chocolate-700)] focus:border-[var(--color-gold-500)]'
                  } text-[var(--color-white)] placeholder:text-[var(--color-gray-neutral)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/20`}
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  autoFocus
                />
                {errors.name && <p className="mt-1 text-sm text-red-400 flex items-center gap-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">
                  <Phone className="w-4 h-4 inline mr-1" /> Telefone (WhatsApp) *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onBlur={() => validateForm()}
                  className={`w-full px-4 py-3 rounded-lg bg-[var(--color-chocolate-900)] border transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-[var(--color-chocolate-700)] focus:border-[var(--color-gold-500)]'
                  } text-[var(--color-white)] placeholder:text-[var(--color-gray-neutral)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/20`}
                  placeholder="(31) 99999-9999"
                  autoComplete="tel"
                  maxLength={15}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-400 flex items-center gap-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" /> Endereço de Entrega *
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  onBlur={() => validateForm()}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg bg-[var(--color-chocolate-900)] border transition-colors resize-none ${
                    errors.address ? 'border-red-500' : 'border-[var(--color-chocolate-700)] focus:border-[var(--color-gold-500)]'
                  } text-[var(--color-white)] placeholder:text-[var(--color-gray-neutral)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/20`}
                  placeholder="Rua, número, bairro, complemento, CEP"
                  autoComplete="street-address"
                />
                {errors.address && <p className="mt-1 text-sm text-red-400 flex items-center gap-1">{errors.address}</p>}
              </div>

              <div className="p-3 bg-[var(--color-chocolate-900)]/50 rounded-lg border border-[var(--color-chocolate-700)]">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--color-gray-neutral)]">Subtotal</span>
                  <span className="font-medium text-[var(--color-white)]">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--color-gray-neutral)]">Taxa de entrega</span>
                  <span className="font-medium text-[var(--color-gold-500)]">A combinar</span>
                </div>
                <div className="flex justify-between font-display text-lg border-t border-[var(--color-chocolate-700)] pt-2">
                  <span className="text-[var(--color-white)]">Total estimado</span>
                  <span className="text-[var(--color-gold-500)]">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </form>
          )}

          {step === 'sending' && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Loader2 className="w-12 h-12 text-[var(--color-gold-500)] animate-spin mb-4" />
              <p className="text-[var(--color-white)] text-lg">Enviando pedido para o WhatsApp...</p>
              <p className="text-sm text-[var(--color-gray-neutral)] mt-1">Aguarde um momento</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-display text-2xl text-[var(--color-white)] mb-2">Pedido Enviado!</h3>
              <p className="text-[var(--color-gray-neutral)] mb-6 max-w-xs">
                Seu pedido foi enviado para nosso WhatsApp. Em breve entraremos em contato para confirmar a entrega.
              </p>
              <button
                onClick={handleNewOrder}
                className="btn-primary w-full max-w-xs"
              >
                Fazer Novo Pedido
              </button>
            </div>
          )}
        </div>

        {(step === 'cart' && items.length > 0) && (
          <div className="p-4 border-t border-[var(--color-chocolate-700)] bg-[var(--color-chocolate-900)]/50">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--color-gray-neutral)]">Subtotal</span>
              <span className="font-medium text-[var(--color-white)]">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-[var(--color-gray-neutral)]">Entrega</span>
              <span className="font-medium text-[var(--color-gold-500)]">A calcular</span>
            </div>
            <div className="flex justify-between font-display text-lg mb-4">
              <span className="text-[var(--color-white)]">Total</span>
              <span className="text-[var(--color-gold-500)]">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
            <button
              onClick={() => setStep('customer')}
              className="w-full btn-primary py-3"
            >
              Finalizar Pedido
            </button>
            <button
              onClick={clearCart}
              className="w-full btn-secondary py-3 mt-2"
            >
              Limpar Carrinho
            </button>
          </div>
        )}

        {(step === 'customer') && (
          <div className="p-4 border-t border-[var(--color-chocolate-700)] bg-[var(--color-chocolate-900)]/50">
            <button
              onClick={handleWhatsAppSubmit}
              disabled={isSubmitting}
              className="w-full btn-primary py-3"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </span>
              ) : (
                'Confirmar e Enviar via WhatsApp'
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}