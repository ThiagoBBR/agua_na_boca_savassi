import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const ADMIN_CREDENTIALS = {
  email: 'admin@aguabocasavassi.com.br',
  password: 'admin123',
  name: 'Administrador',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: async (email: string, password: string) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({
            isAuthenticated: true,
            user: { name: ADMIN_CREDENTIALS.name, email },
          });
        } else {
          throw new Error('E-mail ou senha incorretos');
        }
      },

      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'agua-na-boca-auth',
    }
  )
);