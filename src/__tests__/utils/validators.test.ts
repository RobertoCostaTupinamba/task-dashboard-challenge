import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
  validateLoginForm,
  validateRegisterForm,
} from "../../utils/validators";
import type { LoginData, RegisterData } from "../../types/auth";

describe("validators", () => {
  describe("validateEmail", () => {
    it("should return error for empty email", () => {
      expect(validateEmail("")).toBe("Email é obrigatório");
    });

    it("should return error for invalid email format", () => {
      expect(validateEmail("invalid-email")).toBe("Email inválido");
      expect(validateEmail("test@")).toBe("Email inválido");
      expect(validateEmail("@example.com")).toBe("Email inválido");
      expect(validateEmail("test@example")).toBe("Email inválido");
    });

    it("should return null for valid email", () => {
      expect(validateEmail("test@example.com")).toBeNull();
      expect(validateEmail("user.name@domain.co.uk")).toBeNull();
      expect(validateEmail("user+tag@example.org")).toBeNull();
    });
  });

  describe("validatePassword", () => {
    it("should return error for empty password", () => {
      expect(validatePassword("")).toBe("Senha é obrigatória");
    });

    it("should return error for short password", () => {
      expect(validatePassword("123")).toBe(
        "Senha deve ter pelo menos 6 caracteres"
      );
      expect(validatePassword("12345")).toBe(
        "Senha deve ter pelo menos 6 caracteres"
      );
    });

    it("should return null for valid password", () => {
      expect(validatePassword("123456")).toBeNull();
      expect(validatePassword("password123")).toBeNull();
      expect(validatePassword("very-long-password")).toBeNull();
    });
  });

  describe("validateName", () => {
    it("should return error for empty name", () => {
      expect(validateName("")).toBe("Nome é obrigatório");
    });

    it("should return error for short name", () => {
      expect(validateName("a")).toBe("Nome deve ter pelo menos 2 caracteres");
    });

    it("should return null for valid name", () => {
      expect(validateName("João")).toBeNull();
      expect(validateName("Ana Silva")).toBeNull();
      expect(validateName("José Carlos da Silva")).toBeNull();
    });
  });

  describe("validateConfirmPassword", () => {
    it("should return error for empty confirm password", () => {
      expect(validateConfirmPassword("password", "")).toBe(
        "Confirmação de senha é obrigatória"
      );
    });

    it("should return error for mismatched passwords", () => {
      expect(validateConfirmPassword("password123", "password321")).toBe(
        "As senhas não coincidem"
      );
      expect(validateConfirmPassword("abc123", "xyz789")).toBe(
        "As senhas não coincidem"
      );
    });

    it("should return null for matching passwords", () => {
      expect(validateConfirmPassword("password123", "password123")).toBeNull();
    });
  });

  describe("validateLoginForm", () => {
    const validLoginData: LoginData = {
      email: "test@example.com",
      password: "123456",
    };

    it("should return no errors for valid login data", () => {
      const errors = validateLoginForm(validLoginData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("should return email error for invalid email", () => {
      const invalidData = { ...validLoginData, email: "" };
      const errors = validateLoginForm(invalidData);
      expect(errors.email).toBe("Email é obrigatório");
    });

    it("should return password error for invalid password", () => {
      const invalidData = { ...validLoginData, password: "" };
      const errors = validateLoginForm(invalidData);
      expect(errors.password).toBe("Senha é obrigatória");
    });

    it("should return multiple errors for multiple invalid fields", () => {
      const invalidData: LoginData = { email: "", password: "123" };
      const errors = validateLoginForm(invalidData);
      expect(errors.email).toBe("Email é obrigatório");
      expect(errors.password).toBe("Senha deve ter pelo menos 6 caracteres");
    });
  });

  describe("validateRegisterForm", () => {
    const validRegisterData: RegisterData = {
      name: "João Silva",
      email: "joao@example.com",
      password: "123456",
      confirmPassword: "123456",
    };

    it("should return no errors for valid register data", () => {
      const errors = validateRegisterForm(validRegisterData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("should return name error for invalid name", () => {
      const invalidData = { ...validRegisterData, name: "" };
      const errors = validateRegisterForm(invalidData);
      expect(errors.name).toBe("Nome é obrigatório");
    });

    it("should return email error for invalid email", () => {
      const invalidData = { ...validRegisterData, email: "invalid" };
      const errors = validateRegisterForm(invalidData);
      expect(errors.email).toBe("Email inválido");
    });

    it("should return password error for invalid password", () => {
      const invalidData = { ...validRegisterData, password: "123" };
      const errors = validateRegisterForm(invalidData);
      expect(errors.password).toBe("Senha deve ter pelo menos 6 caracteres");
    });

    it("should return confirm password error for mismatched passwords", () => {
      const invalidData = {
        ...validRegisterData,
        confirmPassword: "different",
      };
      const errors = validateRegisterForm(invalidData);
      expect(errors.confirmPassword).toBe("As senhas não coincidem");
    });

    it("should return multiple errors for multiple invalid fields", () => {
      const invalidData: RegisterData = {
        name: "a",
        email: "invalid-email",
        password: "123",
        confirmPassword: "456",
      };
      const errors = validateRegisterForm(invalidData);
      expect(errors.name).toBe("Nome deve ter pelo menos 2 caracteres");
      expect(errors.email).toBe("Email inválido");
      expect(errors.password).toBe("Senha deve ter pelo menos 6 caracteres");
      expect(errors.confirmPassword).toBe("As senhas não coincidem");
    });
  });
});
