import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { authService } from "../../services/authService";

// Mock do axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

// Importar axios depois do mock
import axios from "axios";

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpar localStorage
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      vi.mocked(axios.get).mockResolvedValue({
        data: [mockUser],
      });

      const result = await authService.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        id: 1,
        name: "Test User",
        email: "test@example.com",
      });
      expect(axios.get).toHaveBeenCalledWith("http://localhost:3001/users", {
        params: { email: "test@example.com" },
      });
    });

    it("should throw error when email is not found", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: [],
      });

      await expect(
        authService.login({
          email: "notfound@example.com",
          password: "password123",
        })
      ).rejects.toThrow("Email não encontrado");
    });

    it("should throw error when password is incorrect", async () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      vi.mocked(axios.get).mockResolvedValue({
        data: [mockUser],
      });

      await expect(
        authService.login({
          email: "test@example.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Senha incorreta");
    });
  });

  describe("register", () => {
    it("should register successfully with valid data", async () => {
      // Mock para verificar se email já existe
      vi.mocked(axios.get).mockResolvedValue({
        data: [],
      });

      // Mock para criar usuário
      vi.mocked(axios.post).mockResolvedValue({
        data: {
          id: 1,
          name: "New User",
          email: "newuser@example.com",
          password: "password123",
        },
      });

      const result = await authService.register({
        name: "New User",
        email: "newuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      });

      expect(result).toEqual({
        id: 1,
        name: "New User",
        email: "newuser@example.com",
      });
      expect(axios.post).toHaveBeenCalledWith("http://localhost:3001/users", {
        name: "New User",
        email: "newuser@example.com",
        password: "password123",
      });
    });

    it("should throw error when email already exists", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: [{ id: 1, email: "existing@example.com" }],
      });

      await expect(
        authService.register({
          name: "New User",
          email: "existing@example.com",
          password: "password123",
          confirmPassword: "password123",
        })
      ).rejects.toThrow("Email já está em uso");
    });
  });

  describe("localStorage methods", () => {
    it("should save user to localStorage", () => {
      const user = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      };

      authService.saveUserToStorage(user);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(user)
      );
    });

    it("should get user from localStorage", () => {
      const user = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      };

      // Simular que o localStorage tem dados
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(user));

      const result = authService.getUserFromStorage();

      expect(result).toEqual(user);
      expect(localStorage.getItem).toHaveBeenCalledWith("user");
    });

    it("should return null when no user in localStorage", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      const result = authService.getUserFromStorage();

      expect(result).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith("user");
    });

    it("should remove user from localStorage", () => {
      authService.removeUserFromStorage();

      expect(localStorage.removeItem).toHaveBeenCalledWith("user");
    });
  });
});
