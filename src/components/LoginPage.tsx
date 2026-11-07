import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('E-mail ou senha incorretos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-chocolate-900)] p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-[var(--color-gold-500)] flex items-center justify-center mx-auto mb-4">
            <span className="text-[var(--color-chocolate-900)] font-display text-2xl font-bold">A</span>
          </div>
          <h1 className="font-display text-3xl font-light text-[var(--color-white)] mb-2">
            Área Administrativa
          </h1>
          <p className="text-[var(--color-gold-soft)] text-sm">
            Faça login para gerenciar a confeitaria
          </p>
        </div>

        <div className="bg-[var(--color-chocolate-800)] border border-[var(--color-chocolate-700)] rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">
                <Mail className="w-4 h-4 inline mr-1.5" /> E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aguabocasavassi.com.br"
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-chocolate-900)] border-[var(--color-chocolate-700)] text-[var(--color-white)] placeholder:text-[var(--color-gray-neutral)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/20 focus:border-[var(--color-gold-500)] transition-colors"
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-gold-soft)] mb-2">
                <Lock className="w-4 h-4 inline mr-1.5" /> Senha
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 px-4 py-3 rounded-lg bg-[var(--color-chocolate-900)] border-[var(--color-chocolate-700)] text-[var(--color-white)] placeholder:text-[var(--color-gray-neutral)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/20 focus:border-[var(--color-gold-500)] transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -mt-2.5 p-1 text-[var(--color-gray-neutral)] hover:text-[var(--color-gold-500)] transition-colors"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="w-4 h-4 text-red-400">⚠</span>
                <span className="text-sm text-red-300">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Acessar Painel
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-[var(--color-chocolate-700)]">
            <p className="text-xs text-[var(--color-gray-neutral)]">
              Credenciais de demonstração:<br />
              <span className="text-[var(--color-gold-soft)]">admin@aguabocasavassi.com.br</span> / <span className="text-[var(--color-gold-soft)]">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}