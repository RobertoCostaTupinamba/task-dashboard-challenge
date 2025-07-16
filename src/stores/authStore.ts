import { create } from "zustand";
import type { AuthStore, LoginData, RegisterData } from "../types/auth";
import { authService } from "../services/authService";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (data: LoginData) => {
    set({ isLoading: true, error: null });

    try {
      const user = await authService.login(data);
      authService.saveUserToStorage(user);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    try {
      const user = await authService.register(data);
      authService.saveUserToStorage(user);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },

  logout: () => {
    authService.removeUserFromStorage();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  // Função para inicializar o estado com dados do localStorage
  initializeAuth: () => {
    const user = authService.getUserFromStorage();
    if (user) {
      set({
        user,
        isAuthenticated: true,
      });
    }
  },
}));

// Função para inicializar o estado na aplicação
export const initializeAuthStore = () => {
  useAuthStore.getState().initializeAuth();
};
