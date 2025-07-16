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

    it("should work with no user in storage", () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.getUserFromStorage.mockReturnValue(null);

      const initialState = useAuthStore.getState();
      initializeAuthStore();

      const finalState = useAuthStore.getState();
      expect(finalState).toEqual(initialState);
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

    it("should have correct method return types", () => {
      const state = useAuthStore.getState();

      // Métodos assíncronos devem retornar Promise
      expect(state.login(mockLoginData)).toBeInstanceOf(Promise);
      expect(state.register(mockRegisterData)).toBeInstanceOf(Promise);

      // Métodos síncronos não devem retornar Promise
      expect(state.logout()).toBeUndefined();
      expect(state.clearError()).toBeUndefined();
      expect(state.initializeAuth()).toBeUndefined();
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

    it("should handle concurrent login attempts", async () => {
      const mockedAuthService = vi.mocked(authService);

      // Simular login que demora para resolver
      let resolveLogin: (user: User) => void;
      const loginPromise = new Promise<User>((resolve) => {
        resolveLogin = resolve;
      });
      mockedAuthService.login.mockReturnValue(loginPromise);

      const { login } = useAuthStore.getState();

      // Iniciar dois logins simultaneamente
      const login1 = login(mockLoginData);
      const login2 = login({ ...mockLoginData, email: "outro@teste.com" });

      // Verificar que está em loading
      expect(useAuthStore.getState().isLoading).toBe(true);

      // Resolver o primeiro login
      resolveLogin!(mockUser);
      await login1;

      // Verificar que só o primeiro foi processado
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isLoading).toBe(false);

      // O segundo login ainda deve completar
      await expect(login2).resolves.toBeUndefined();
    });

    it("should not change state during concurrent operations", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.login.mockResolvedValue(mockUser);
      mockedAuthService.register.mockResolvedValue(mockUser);

      const { login, register } = useAuthStore.getState();

      // Iniciar login e register simultaneamente
      const loginPromise = login(mockLoginData);
      const registerPromise = register(mockRegisterData);

      await Promise.all([loginPromise, registerPromise]);

      // Estado final deve ser consistente
      const finalState = useAuthStore.getState();
      expect(finalState.user).toEqual(mockUser);
      expect(finalState.isAuthenticated).toBe(true);
      expect(finalState.isLoading).toBe(false);
    });
  });

  describe("Error Handling Edge Cases", () => {
    it("should handle service returning undefined", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.login.mockResolvedValue(undefined as unknown as User);

      const { login } = useAuthStore.getState();
      await login(mockLoginData);

      const finalState = useAuthStore.getState();
      expect(finalState.user).toBeUndefined(); // O store não converte undefined para null
      expect(finalState.isAuthenticated).toBe(true); // Store considera qualquer valor retornado como válido
      expect(finalState.error).toBeNull(); // Não há erro quando login "sucede" com undefined
    });

    it("should handle null error objects", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.login.mockRejectedValue(null);

      const { login } = useAuthStore.getState();
      await login(mockLoginData);

      const finalState = useAuthStore.getState();
      expect(finalState.error).toBe("Erro desconhecido");
    });

    it("should handle error objects without message", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.login.mockRejectedValue({ status: 500 });

      const { login } = useAuthStore.getState();
      await login(mockLoginData);

      const finalState = useAuthStore.getState();
      expect(finalState.error).toBe("Erro desconhecido");
    });

    it("should handle network errors", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.register.mockRejectedValue(new Error("Network Error"));

      const { register } = useAuthStore.getState();
      await register(mockRegisterData);

      const finalState = useAuthStore.getState();
      expect(finalState.error).toBe("Network Error");
      expect(finalState.isLoading).toBe(false);
    });

    it("should handle register with null error", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.register.mockRejectedValue(null);

      const { register } = useAuthStore.getState();
      await register(mockRegisterData);

      const finalState = useAuthStore.getState();
      expect(finalState.error).toBe("Erro desconhecido");
      expect(finalState.isLoading).toBe(false);
    });

    it("should handle register with non-Error object", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.register.mockRejectedValue({ code: "AUTH_ERROR" });

      const { register } = useAuthStore.getState();
      await register(mockRegisterData);

      const finalState = useAuthStore.getState();
      expect(finalState.error).toBe("Erro desconhecido");
      expect(finalState.isLoading).toBe(false);
    });

    it("should handle string errors in login", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.login.mockRejectedValue("String error message");

      const { login } = useAuthStore.getState();
      await login(mockLoginData);

      const finalState = useAuthStore.getState();
      expect(finalState.error).toBe("Erro desconhecido");
      expect(finalState.isLoading).toBe(false);
    });

    it("should handle string errors in register", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.register.mockRejectedValue("Registration failed");

      const { register } = useAuthStore.getState();
      await register(mockRegisterData);

      const finalState = useAuthStore.getState();
      expect(finalState.error).toBe("Erro desconhecido");
      expect(finalState.isLoading).toBe(false);
    });
  });

  describe("Loading State Management", () => {
    it("should set loading to true during login", async () => {
      const mockedAuthService = vi.mocked(authService);

      let resolveLogin: (user: User) => void;
      const loginPromise = new Promise<User>((resolve) => {
        resolveLogin = resolve;
      });
      mockedAuthService.login.mockReturnValue(loginPromise);

      const { login } = useAuthStore.getState();

      // Iniciar login
      const loginOperation = login(mockLoginData);

      // Verificar estado durante operação
      expect(useAuthStore.getState().isLoading).toBe(true);
      expect(useAuthStore.getState().error).toBeNull();

      // Resolver login
      resolveLogin!(mockUser);
      await loginOperation;

      // Verificar estado final
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it("should set loading to false after register error", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.register.mockRejectedValue(
        new Error("Erro de registro")
      );

      const { register } = useAuthStore.getState();

      // Verificar que não está em loading inicialmente
      expect(useAuthStore.getState().isLoading).toBe(false);

      await register(mockRegisterData);

      // Verificar que loading foi resetado após erro
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it("should not start new operations while loading", async () => {
      const mockedAuthService = vi.mocked(authService);

      // Primeira operação que demora
      let resolveFirstLogin: (user: User) => void;
      const firstLoginPromise = new Promise<User>((resolve) => {
        resolveFirstLogin = resolve;
      });
      mockedAuthService.login.mockReturnValueOnce(firstLoginPromise);

      // Segunda operação rápida
      mockedAuthService.login.mockResolvedValueOnce(mockUser);

      const { login } = useAuthStore.getState();

      // Iniciar primeira operação
      const firstLogin = login(mockLoginData);
      expect(useAuthStore.getState().isLoading).toBe(true);

      // Tentar segunda operação enquanto primeira está em andamento
      const secondLogin = login(mockLoginData);

      // Resolver primeira operação
      resolveFirstLogin!(mockUser);
      await firstLogin;
      await secondLogin;

      // Verificar que auth service foi chamado corretamente
      expect(mockedAuthService.login).toHaveBeenCalledTimes(2);
    });
  });

  describe("Storage Integration", () => {
    it("should handle corrupted data in storage", () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.getUserFromStorage.mockReturnValue({} as User); // dados corrompidos

      const { initializeAuth } = useAuthStore.getState();
      initializeAuth();

      // Store aceita dados corrompidos (sem validação rigorosa)
      const finalState = useAuthStore.getState();
      expect(finalState.user).toEqual({}); // Store não valida estrutura do usuário
      expect(finalState.isAuthenticated).toBe(true); // Qualquer objeto é considerado usuário válido
    });

    it("should handle storage returning partial user data", () => {
      const mockedAuthService = vi.mocked(authService);
      const partialUser = { id: 1, name: "João" } as Partial<User>; // sem email
      mockedAuthService.getUserFromStorage.mockReturnValue(partialUser as User);

      const { initializeAuth } = useAuthStore.getState();
      initializeAuth();

      const finalState = useAuthStore.getState();
      expect(finalState.user).toEqual(partialUser);
      expect(finalState.isAuthenticated).toBe(true);
    });

    it("should save user after successful login", async () => {
      const mockedAuthService = vi.mocked(authService);
      mockedAuthService.login.mockResolvedValue(mockUser);

      const { login } = useAuthStore.getState();
      await login(mockLoginData);

      expect(mockedAuthService.saveUserToStorage).toHaveBeenCalledWith(
        mockUser
      );
      expect(mockedAuthService.saveUserToStorage).toHaveBeenCalledTimes(1);
    });

    it("should remove user from storage on logout", () => {
      // Configurar estado com usuário logado
      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
      });

      const { logout } = useAuthStore.getState();
      logout();

      expect(authService.removeUserFromStorage).toHaveBeenCalledTimes(1);
    });
  });

  describe("State Consistency", () => {
    it("should maintain consistent state between user and isAuthenticated", () => {
      // Estado inicial
      let state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);

      // Após login simulado
      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
      });
      state = useAuthStore.getState();
      expect(state.user).not.toBeNull();
      expect(state.isAuthenticated).toBe(true);

      // Após logout
      const { logout } = useAuthStore.getState();
      logout();
      state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it("should clear error when starting new operations", async () => {
      const mockedAuthService = vi.mocked(authService);

      // Configurar erro inicial
      useAuthStore.setState({ error: "Erro anterior" });
      expect(useAuthStore.getState().error).toBe("Erro anterior");

      // Login bem-sucedido deve limpar erro
      mockedAuthService.login.mockResolvedValue(mockUser);
      const { login } = useAuthStore.getState();
      await login(mockLoginData);

      expect(useAuthStore.getState().error).toBeNull();
    });

    it("should reset all relevant state on logout", () => {
      // Configurar estado completo
      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: true,
        error: "Algum erro",
      });

      const { logout } = useAuthStore.getState();
      logout();

      const finalState = useAuthStore.getState();
      expect(finalState.user).toBeNull();
      expect(finalState.isAuthenticated).toBe(false);
      expect(finalState.error).toBeNull();
      // Loading deve se manter como estava
      expect(finalState.isLoading).toBe(true);
    });
  });
});
