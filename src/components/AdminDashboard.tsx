import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore';
import { Plus, Trash2, Edit2, FileText, Users, LogOut, X, Clock, RefreshCw } from 'lucide-react';
import type { Product, Order } from '../types';

const CATEGORIES = ['tortas', 'doces', 'salgados', 'kits', 'bebidas'];

export function AdminDashboard() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const orders = useOrderStore((state) => state.orders);
  const isLoadingOrders = useOrderStore((state) => state.isLoading);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const deleteOrder = useOrderStore((state) => state.deleteOrder);
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const removeProduct = useProductStore((state) => state.deleteProduct);

  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    weight: string;
    category: string;
    image: string;
    rating: string;
    reviews: string;
  }>({
    name: '',
    description: '',
    price: '',
    weight: '',
    category: 'tortas',
    image: '',
    rating: '5.0',
    reviews: '0',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  const categoryLabel = (cat: string) => {
    switch (cat) {
      case 'tortas': return 'Tortas & Bolos';
      case 'doces': return 'Doces Finos';
      case 'salgados': return 'Salgados';
      case 'kits': return 'Kits Festa';
      case 'bebidas': return 'Bebidas';
      default: return cat;
    }
  };

  const statusLabel = (status: Order['status']) => {
    switch (status) {
      case 'novo': return 'Novo';
      case 'preparando': return 'Preparando';
      case 'entregue': return 'Entregue';
      case 'cancelado': return 'Cancelado';
    }
  };

  const statusColor = (status: Order['status']) => {
    switch (status) {
      case 'novo': return 'text-[var(--color-gold-500)]';
      case 'preparando': return 'text-blue-400';
      case 'entregue': return 'text-green-400';
      case 'cancelado': return 'text-red-400';
    }
  };

  const openModal = (product?: Product) => {
    setError('');
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        weight: product.weight || '',
        category: product.category,
        image: product.image,
        rating: product.rating?.toString() || '5.0',
        reviews: product.reviews?.toString() || '0',
      });
      setImagePreview(product.image || null);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        weight: '',
        category: 'tortas',
        image: '',
        rating: '5.0',
        reviews: '0',
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setFormData(prev => ({ ...prev, image: dataUrl }));
        setImagePreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    const priceNum = parseFloat(formData.price);
    const ratingNum = parseFloat(formData.rating) || 5;
    const reviewsNum = parseInt(formData.reviews, 10) || 0;

    const productData = {
      name: formData.name,
      description: formData.description,
      price: priceNum,
      weight: formData.weight,
      category: formData.category,
      image: formData.image,
      rating: ratingNum,
      reviews: reviewsNum,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, productData);
      } else {
        await addProduct(productData);
      }
      closeModal();
    } catch (err: any) {
      setError('Erro ao salvar produto: ' + err.message);
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await removeProduct(id);
      } catch (err: any) {
        setError('Erro ao excluir produto: ' + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-chocolate-900)] text-[var(--color-white)]">
      <header className="border-b border-[var(--color-chocolate-700)] bg-[var(--color-chocolate-800)]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-gold-500)] flex items-center justify-center">
              <span className="text-[var(--color-chocolate-900)] font-bold text-sm">A</span>
            </div>
            <h1 className="font-display text-xl font-medium">Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[var(--color-gold-soft)] text-sm hidden sm:block">
              <Users className="w-4 h-4" />
              <span>{user ? user.name : 'Admin'}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-chocolate-900)] border border-[var(--color-chocolate-700)] text-[var(--color-gold-soft)] hover:text-[var(--color-white)] hover:bg-[var(--color-chocolate-700)] transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-[var(--color-gold-500)] text-[var(--color-chocolate-900)]'
                  : 'bg-[var(--color-chocolate-900)] border border-[var(--color-chocolate-700)] text-[var(--color-gold-soft)] hover:text-[var(--color-white)]'
              }`}
            >
              Produtos
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[var(--color-gold-500)] text-[var(--color-chocolate-900)]'
                  : 'bg-[var(--color-chocolate-900)] border border-[var(--color-chocolate-700)] text-[var(--color-gold-soft)] hover:text-[var(--color-white)]'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" /> Pedidos
            </button>
          </div>
          {activeTab === 'products' && (
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 btn-primary px-6 py-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Novo Produto
            </button>
          )}
        </div>

        {activeTab === 'products' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <article key={product.id} className="bg-[var(--color-chocolate-800)] border border-[var(--color-chocolate-700)] rounded-xl overflow-hidden flex flex-col hover:border-[var(--color-gold-500)]/50 transition-colors">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); openModal(product); }}
                        className="p-1.5 bg-[var(--color-chocolate-900)]/90 text-[var(--color-gold-500)] rounded hover:bg-[var(--color-gold-500)] hover:text-[var(--color-chocolate-900)] transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                        className="p-1.5 bg-[var(--color-chocolate-900)]/90 text-red-400 rounded hover:bg-red-500/20 hover:text-red-300 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-[var(--color-gold-500)] text-xs font-medium uppercase tracking-wider mb-1">
                      {categoryLabel(product.category)}
                    </span>
                    <h3 className="font-medium text-[var(--color-white)] mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-[var(--color-gray-neutral)] text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-display text-xl font-medium text-[var(--color-gold-500)]">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[var(--color-gold-soft)] text-xs flex items-center gap-1">
                        ⭐ {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>
                </article>
              ))}
              {products.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="w-12 h-12 text-[var(--color-gray-neutral)]/50 mb-4" />
                  <p className="text-[var(--color-gray-neutral)]">Nenhum produto cadastrado</p>
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--color-chocolate-800)] p-6 rounded-xl border border-[var(--color-chocolate-700)]">
                <span className="text-[var(--color-gray-neutral)] text-xs block mb-1">Total de Produtos</span>
                <span className="text-2xl font-medium text-[var(--color-white)]">{products.length}</span>
              </div>
              <div className="bg-[var(--color-chocolate-800)] p-6 rounded-xl border border-[var(--color-chocolate-700)]">
                <span className="text-[var(--color-gray-neutral)] text-xs block mb-1">Itens no Carrinho</span>
                <span className="text-2xl font-medium text-[var(--color-gold-500)]">{totalItems}</span>
              </div>
              <div className="bg-[var(--color-chocolate-800)] p-6 rounded-xl border border-[var(--color-chocolate-700)]">
                <span className="text-[var(--color-gray-neutral)] text-xs block mb-1">Valor no Carrinho</span>
                <span className="text-2xl font-medium text-[var(--color-gold-500)]">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-light text-[var(--color-white)]">Pedidos</h2>
                <p className="text-[var(--color-gold-soft)] text-sm">Gerencie os pedidos dos clientes</p>
              </div>
              {isLoadingOrders && (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[var(--color-gold-500)]" />
                  <span className="text-xs text-[var(--color-gold-soft)]">Carregando...</span>
                </div>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="w-16 h-16 text-[var(--color-gray-neutral)]/50 mb-4" />
                <p className="text-[var(--color-gray-neutral)]">Nenhum pedido ainda</p>
                <p className="text-xs text-[var(--color-gray-neutral)]/70 mt-2">Os pedidos aparecerão aqui quando clientes finalizarem via WhatsApp</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-chocolate-700)]">
                      <th className="text-left pb-3 text-[var(--color-gray-neutral)] text-sm font-medium">ID</th>
                      <th className="text-left pb-3 text-[var(--color-gray-neutral)] text-sm font-medium">Cliente</th>
                      <th className="text-left pb-3 text-[var(--color-gray-neutral)] text-sm font-medium">Telefone</th>
                      <th className="text-right pb-3 text-[var(--color-gray-neutral)] text-sm font-medium">Total</th>
                      <th className="text-left pb-3 text-[var(--color-gray-neutral)] text-sm font-medium">Status</th>
                      <th className="text-left pb-3 text-[var(--color-gray-neutral)] text-sm font-medium">Data</th>
                      <th className="text-right pb-3 text-[var(--color-gray-neutral)] text-sm font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-[var(--color-chocolate-700)] hover:bg-[var(--color-chocolate-800)]/50 transition-colors">
                        <td className="py-3 text-xs font-mono text-[var(--color-gold-soft)]">#{order.id.slice(-6)}</td>
                        <td className="py-3 text-sm text-[var(--color-white)]">{order.customerName}</td>
                        <td className="py-3 text-sm text-[var(--color-gray-neutral)]">{order.customerPhone}</td>
                        <td className="py-3 text-right text-sm font-medium text-[var(--color-white)]">R$ {order.total.toFixed(2).replace('.', ',')}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor(order.status)}`}>
                            {statusLabel(order.status)}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-[var(--color-gray-neutral)]">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="bg-[var(--color-chocolate-900)] border border-[var(--color-chocolate-700)] text-[var(--color-white)] text-xs px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-500)]"
                          >
                            <option value="novo">Novo</option>
                            <option value="preparando">Preparando</option>
                            <option value="entregue">Entregue</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 transition-colors" title="Excluir pedido"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-[var(--color-chocolate-800)] border border-[var(--color-chocolate-700)] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--color-chocolate-700)] flex items-center justify-between">
              <h3 className="font-display text-xl font-medium text-[var(--color-white)]">{editingId ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={closeModal} className="p-1 text-[var(--color-gray-neutral)] hover:text-[var(--color-white)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">Nome do Produto</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-chocolate-900)] border-[var(--color-chocolate-700)] text-[var(--color-white)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-500)]"
                  placeholder="Ex: Torta Trufada de Chocolate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-chocolate-900)] border-[var(--color-chocolate-700)] text-[var(--color-white)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-500)]"
                  placeholder="Descreva os ingredientes..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--color-chocolate-900)] border-[var(--color-chocolate-700)] text-[var(--color-white)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-500)]"
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--color-chocolate-900)] border-[var(--color-chocolate-700)] text-[var(--color-white)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-500)]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{categoryLabel(cat)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">Peso</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--color-chocolate-900)] border-[var(--color-chocolate-700)] text-[var(--color-white)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-500)]"
                    placeholder="Ex: 1kg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">Avaliação</label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--color-chocolate-900)] border-[var(--color-chocolate-700)] text-[var(--color-white)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-500)]"
                    placeholder="5.0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">Foto do Produto</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-[var(--color-gold-soft)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-gold-500)] file:text-[var(--color-chocolate-900)] hover:file:bg-[var(--color-gold-400)]"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-cover border border-[var(--color-gold-500)]/30"
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">URL da Imagem (opcional)</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--color-chocolate-900)] border-[var(--color-chocolate-700)] text-[var(--color-white)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-500)]"
                  placeholder="https://..."
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-2 rounded-lg border border-[var(--color-chocolate-700)] text-[var(--color-gray-neutral)] hover:bg-[var(--color-chocolate-700)] transition-colors text-sm">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn-primary py-2 text-sm">
                  {editingId ? 'Salvar Alterações' : 'Criar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}