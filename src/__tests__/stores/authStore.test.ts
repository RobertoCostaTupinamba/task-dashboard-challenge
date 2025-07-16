import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useAuthStore, initializeAuthStore } from "../../stores/authStore";
import { authService } from "../../services/authService";
import type { User, LoginData, RegisterData } from "../../types/auth";

// Mock do authService
vi.mock("../../services/authService", () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    saveUserToStorage: vi.fn(),
    removeUserFromStorage: vi.fn(),
    getUserFromStorage: vi.fn(),
  },
}));

describe("authStore", () => {
  const mockUser: User = {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
  };

  const mockLoginData: LoginData = {
    email: "joao@example.com",
    password: "123456",
  };

  const mockRegisterData: RegisterData = {
    name: "João Silva",
    email: "joao@example.com",
    password: "123456",
    confirmPassword: "123456",
  };

  beforeEach(() => {
    // Reset do store para estado inicial
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    // Limpar todos os mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.login.mockResolvedValue(mockUser);

      const { login } = useAuthStore.getState();

      // Verificar estado durante loading
      const loginPromise = login(mockLoginData);
      expect(useAuthStore.getState().isLoading).toBe(true);
      expect(useAuthStore.getState().error).toBeNull();

      await loginPromise;

      // Verificar estado final
      const finalState = useAuthStore.getState();
      expect(finalState.user).toEqual(mockUser);
      expect(finalState.isAuthenticated).toBe(true);
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBeNull();

      // Verificar se serviços foram chamados
      expect(mockedAuthService.login).toHaveBeenCalledWith(mockLoginData);
      expect(mockedAuthService.saveUserToStorage).toHaveBeenCalledWith(
        mockUser
      );
    });

    it("should handle login error", async () => {
      const errorMessage = "Credenciais inválidas";
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.login.mockRejectedValue(new Error(errorMessage));

      const { login } = useAuthStore.getState();

      await login(mockLoginData);

      const finalState = useAuthStore.getState();
      expect(finalState.user).toBeNull();
      expect(finalState.isAuthenticated).toBe(false);
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBe(errorMessage);

      // Verificar se saveUserToStorage não foi chamado
      expect(mockedAuthService.saveUserToStorage).not.toHaveBeenCalled();
    });

    it("should handle unknown error", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.login.mockRejectedValue("String error");

      const { login } = useAuthStore.getState();

      await login(mockLoginData);

      const finalState = useAuthStore.getState();
      expect(finalState.error).toBe("Erro desconhecido");
    });
  });

  describe("register", () => {
    it("should register successfully", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.register.mockResolvedValue(mockUser);

      const { register } = useAuthStore.getState();

      // Verificar estado durante loading
      const registerPromise = register(mockRegisterData);
      expect(useAuthStore.getState().isLoading).toBe(true);
      expect(useAuthStore.getState().error).toBeNull();

      await registerPromise;

      // Verificar estado final
      const finalState = useAuthStore.getState();
      expect(finalState.user).toEqual(mockUser);
      expect(finalState.isAuthenticated).toBe(true);
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBeNull();

      // Verificar se serviços foram chamados
      expect(mockedAuthService.register).toHaveBeenCalledWith(mockRegisterData);
      expect(mockedAuthService.saveUserToStorage).toHaveBeenCalledWith(
        mockUser
      );
    });

    it("should handle register service error", async () => {
      const errorMessage = "Email já cadastrado";
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.register.mockRejectedValue(new Error(errorMessage));

      const { register } = useAuthStore.getState();

      await register(mockRegisterData);

      const finalState = useAuthStore.getState();
      expect(finalState.user).toBeNull();
      expect(finalState.isAuthenticated).toBe(false);
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBe(errorMessage);

      expect(mockedAuthService.saveUserToStorage).not.toHaveBeenCalled();
    });

    it("should handle unknown register error", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.register.mockRejectedValue("String error");

      const { register } = useAuthStore.getState();

      await register(mockRegisterData);

      const finalState = useAuthStore.getState();
      expect(finalState.error).toBe("Erro desconhecido");
    });
  });

  describe("logout", () => {
    it("should logout successfully", () => {
      // Configurar estado inicial com usuário logado
      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
        error: "Algum erro anterior",
      });

      const { logout } = useAuthStore.getState();
      logout();

      const finalState = useAuthStore.getState();
      expect(finalState.user).toBeNull();
      expect(finalState.isAuthenticated).toBe(false);
      expect(finalState.error).toBeNull();

      expect(authService.removeUserFromStorage).toHaveBeenCalled();
    });
  });

  describe("clearError", () => {
    it("should clear error", () => {
      // Configurar estado com erro
      useAuthStore.setState({
        error: "Algum erro",
      });

      const { clearError } = useAuthStore.getState();
      clearError();

      const finalState = useAuthStore.getState();
      expect(finalState.error).toBeNull();
    });

    it("should not affect other state properties", () => {
      // Configurar estado completo
      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: true,
        error: "Algum erro",
      });

      const { clearError } = useAuthStore.getState();
      clearError();

      const finalState = useAuthStore.getState();
      expect(finalState.user).toEqual(mockUser);
      expect(finalState.isAuthenticated).toBe(true);
      expect(finalState.isLoading).toBe(true);
      expect(finalState.error).toBeNull();
    });
  });

  describe("initializeAuth", () => {
    it("should initialize with user from storage", () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.getUserFromStorage.mockReturnValue(mockUser);

      const { initializeAuth } = useAuthStore.getState();
      initializeAuth();

      const finalState = useAuthStore.getState();
      expect(finalState.user).toEqual(mockUser);
      expect(finalState.isAuthenticated).toBe(true);

      expect(mockedAuthService.getUserFromStorage).toHaveBeenCalled();
    });

    it("should not change state when no user in storage", () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.getUserFromStorage.mockReturnValue(null);

      const initialState = useAuthStore.getState();
      const { initializeAuth } = useAuthStore.getState();
      initializeAuth();

      const finalState = useAuthStore.getState();
      expect(finalState).toEqual(initialState);

      expect(mockedAuthService.getUserFromStorage).toHaveBeenCalled();
    });
  });

  describe("initializeAuthStore", () => {
    it("should call initializeAuth", () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.getUserFromStorage.mockReturnValue(mockUser);

      initializeAuthStore();

      const finalState = useAuthStore.getState();
      expect(finalState.user).toEqual(mockUser);
      expect(finalState.isAuthenticated).toBe(true);

      expect(mockedAuthService.getUserFromStorage).toHaveBeenCalled();
    });
  });

  describe("Store Methods", () => {
    it("should have all required methods", () => {
      const state = useAuthStore.getState();

      expect(typeof state.login).toBe("function");
      expect(typeof state.register).toBe("function");
      expect(typeof state.logout).toBe("function");
      expect(typeof state.clearError).toBe("function");
      expect(typeof state.initializeAuth).toBe("function");
    });
  });

  describe("State Transitions", () => {
    it("should handle multiple operations correctly", async () => {
      const mockedAuthService = vi.mocked(authService);

      // 1. Login com sucesso
      mockedAuthService.login.mockResolvedValue(mockUser);
      const { login, logout, clearError } = useAuthStore.getState();

      await login(mockLoginData);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // 2. Logout
      logout();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);

      // 3. Login com erro
      mockedAuthService.login.mockRejectedValue(new Error("Erro de login"));
      await login(mockLoginData);
      expect(useAuthStore.getState().error).toBe("Erro de login");

      // 4. Limpar erro
      clearError();
      expect(useAuthStore.getState().error).toBeNull();
    });
  });
});
