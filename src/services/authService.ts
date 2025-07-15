import axios from "axios";
import type { LoginData, RegisterData, User } from "../types/auth";

const API_BASE_URL = "http://localhost:3001";

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(data: LoginData): Promise<User> {
    try {
      // Buscar usuário por email
      const response = await axios.get(`${API_BASE_URL}/users`, {
        params: { email: data.email },
      });

      const users = response.data;

      if (users.length === 0) {
        throw new Error("Email não encontrado");
      }

      const user = users[0];

      // Verificar senha
      if (user.password !== data.password) {
        throw new Error("Senha incorreta");
      }

      // Remover senha do objeto retornado
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Erro de conexão com o servidor");
      }
      throw error;
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      // Verificar se email já existe
      const existingUsers = await axios.get(`${API_BASE_URL}/users`, {
        params: { email: data.email },
      });

      if (existingUsers.data.length > 0) {
        throw new Error("Email já está em uso");
      }

      // Criar novo usuário
      const newUser = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const response = await axios.post(`${API_BASE_URL}/users`, newUser);

      // Remover senha do objeto retornado
      return {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Erro de conexão com o servidor");
      }
      throw error;
    }
  }

  // Métodos para localStorage
  saveUserToStorage(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  getUserFromStorage(): User | null {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }

  removeUserFromStorage(): void {
    localStorage.removeItem("user");
  }
}

export const authService = AuthService.getInstance();
