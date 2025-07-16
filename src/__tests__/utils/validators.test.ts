import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
  validateLoginForm,
  validateRegisterForm,
  validateTaskForm,
} from "../../utils/validators";
import type { LoginData, RegisterData } from "../../types/auth";
import type { TaskFormData } from "../../types/task";

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
      expect(validateEmail("test@example.")).toBe("Email inválido");
      expect(validateEmail("test test@example.com")).toBe("Email inválido");
    });

    it("should return null for valid email", () => {
      expect(validateEmail("test@example.com")).toBeNull();
      expect(validateEmail("user.name@domain.co.uk")).toBeNull();
      expect(validateEmail("user+tag@example.org")).toBeNull();
      expect(validateEmail("a@b.co")).toBeNull();
      expect(validateEmail("123@test.com")).toBeNull();
      expect(validateEmail("user-name@example-domain.com")).toBeNull();
    });

    it("should handle edge cases", () => {
      expect(validateEmail(" ")).toBe("Email inválido"); // espaço único é inválido, não vazio
      expect(validateEmail("  test@example.com  ")).toBe("Email inválido"); // espaços nas pontas
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
      expect(validatePassword("a")).toBe(
        "Senha deve ter pelo menos 6 caracteres"
      );
    });

    it("should return null for valid password", () => {
      expect(validatePassword("123456")).toBeNull(); // exatamente 6 caracteres
      expect(validatePassword("password123")).toBeNull();
      expect(validatePassword("very-long-password")).toBeNull();
      expect(validatePassword("!@#$%^&*()")).toBeNull(); // caracteres especiais
      expect(validatePassword("   123456   ")).toBeNull(); // com espaços
    });

    it("should handle edge cases", () => {
      expect(validatePassword(" ")).toBe(
        "Senha deve ter pelo menos 6 caracteres"
      ); // espaço único < 6
      expect(validatePassword("     ")).toBe(
        "Senha deve ter pelo menos 6 caracteres"
      ); // só espaços < 6
      expect(validatePassword("      ")).toBeNull(); // 6 espaços exatos
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
      expect(validateName("AB")).toBeNull(); // exatamente 2 caracteres
      expect(validateName("A B")).toBeNull(); // 2 letras com espaço
      expect(validateName("José-Maria")).toBeNull(); // com hífen
      expect(validateName("João123")).toBeNull(); // com números
    });

    it("should handle edge cases", () => {
      expect(validateName(" ")).toBe("Nome deve ter pelo menos 2 caracteres"); // espaço único < 2
      expect(validateName("  ")).toBeNull(); // 2 espaços
      expect(validateName(" A ")).toBeNull(); // espaços nas pontas
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
      expect(validateConfirmPassword("", "test")).toBe(
        "As senhas não coincidem"
      );
      expect(validateConfirmPassword("test", " test")).toBe(
        "As senhas não coincidem"
      );
      expect(validateConfirmPassword("TEST", "test")).toBe(
        "As senhas não coincidem"
      );
    });

    it("should return null for matching passwords", () => {
      expect(validateConfirmPassword("password123", "password123")).toBeNull();
      expect(validateConfirmPassword("   ", "   ")).toBeNull(); // espaços iguais
      expect(validateConfirmPassword("!@#$%", "!@#$%")).toBeNull(); // caracteres especiais
    });

    it("should handle edge cases", () => {
      expect(validateConfirmPassword("test", " ")).toBe(
        "As senhas não coincidem" // espaço não é tratado como vazio
      );

      expect(validateConfirmPassword("", "")).toBe(
        "Confirmação de senha é obrigatória" // string vazia é verificada primeiro
      );
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

    it("should return email error for malformed email", () => {
      const invalidData = { ...validLoginData, email: "invalid-email" };
      const errors = validateLoginForm(invalidData);
      expect(errors.email).toBe("Email inválido");
    });

    it("should return password error for invalid password", () => {
      const invalidData = { ...validLoginData, password: "" };
      const errors = validateLoginForm(invalidData);
      expect(errors.password).toBe("Senha é obrigatória");
    });

    it("should return password error for short password", () => {
      const invalidData = { ...validLoginData, password: "12345" };
      const errors = validateLoginForm(invalidData);
      expect(errors.password).toBe("Senha deve ter pelo menos 6 caracteres");
    });

    it("should return multiple errors for multiple invalid fields", () => {
      const invalidData: LoginData = { email: "", password: "123" };
      const errors = validateLoginForm(invalidData);
      expect(errors.email).toBe("Email é obrigatório");
      expect(errors.password).toBe("Senha deve ter pelo menos 6 caracteres");
    });

    it("should handle edge cases", () => {
      // Teste com boundary values válidos
      const boundaryData: LoginData = {
        email: "a@b.co",
        password: "123456",
      };
      const errors = validateLoginForm(boundaryData);
      expect(Object.keys(errors)).toHaveLength(0);

      // Teste com todos os campos inválidos
      const allInvalidData: LoginData = {
        email: "not-an-email",
        password: "12345",
      };
      const allErrors = validateLoginForm(allInvalidData);
      expect(allErrors.email).toBe("Email inválido");
      expect(allErrors.password).toBe("Senha deve ter pelo menos 6 caracteres");
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

    it("should handle edge cases and boundary values", () => {
      // Teste com dados válidos no limite
      const validBoundaryData: RegisterData = {
        name: "AB", // exatamente 2 caracteres
        email: "a@b.co", // email mínimo válido
        password: "123456", // exatamente 6 caracteres
        confirmPassword: "123456",
      };
      const errors = validateRegisterForm(validBoundaryData);
      expect(Object.keys(errors)).toHaveLength(0);

      // Teste com espaços em branco
      const whitespaceData: RegisterData = {
        name: "   João Silva   ",
        email: "  test@example.com  ",
        password: "  123456  ",
        confirmPassword: "  123456  ",
      };
      const whitespaceErrors = validateRegisterForm(whitespaceData);
      expect(whitespaceErrors.email).toBe("Email inválido"); // email com espaços é inválido
    });
  });

  describe("validateTaskForm", () => {
    const validTaskData: TaskFormData = {
      title: "Tarefa de Teste",
      description: "Descrição da tarefa",
      category: "Trabalho",
      priority: "Alta",
      status: "Pendente",
    };

    it("should return no errors for valid task data", () => {
      const errors = validateTaskForm(validTaskData, false, "");
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("should return error for empty title", () => {
      const invalidData = { ...validTaskData, title: "" };
      const errors = validateTaskForm(invalidData, false, "");
      expect(errors.title).toBe("Título é obrigatório");
    });

    it("should return error for title with only spaces", () => {
      const invalidData = { ...validTaskData, title: "   " };
      const errors = validateTaskForm(invalidData, false, "");
      expect(errors.title).toBe("Título é obrigatório");
    });

    it("should return error for empty description", () => {
      const invalidData = { ...validTaskData, description: "" };
      const errors = validateTaskForm(invalidData, false, "");
      expect(errors.description).toBe("Descrição é obrigatória");
    });

    it("should return error for description with only spaces", () => {
      const invalidData = { ...validTaskData, description: "   " };
      const errors = validateTaskForm(invalidData, false, "");
      expect(errors.description).toBe("Descrição é obrigatória");
    });

    it("should return error for empty category when not custom", () => {
      const invalidData = { ...validTaskData, category: "" };
      const errors = validateTaskForm(invalidData, false, "");
      expect(errors.category).toBe("Categoria é obrigatória");
    });

    it("should return error for category with only spaces when not custom", () => {
      const invalidData = { ...validTaskData, category: "   " };
      const errors = validateTaskForm(invalidData, false, "");
      expect(errors.category).toBe("Categoria é obrigatória");
    });

    it("should use custom category when isCustom is true", () => {
      const invalidData = { ...validTaskData, category: "" };
      const errors = validateTaskForm(invalidData, true, "Nova Categoria");
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("should return error for empty custom category when isCustom is true", () => {
      const invalidData = { ...validTaskData, category: "Qualquer" };
      const errors = validateTaskForm(invalidData, true, "");
      expect(errors.category).toBe("Categoria é obrigatória");
    });

    it("should return error for custom category with only spaces", () => {
      const invalidData = { ...validTaskData, category: "Qualquer" };
      const errors = validateTaskForm(invalidData, true, "   ");
      expect(errors.category).toBe("Categoria é obrigatória");
    });

    it("should return multiple errors for multiple invalid fields", () => {
      const invalidData: TaskFormData = {
        title: "",
        description: "   ",
        category: "",
        priority: "Alta",
        status: "Pendente",
      };
      const errors = validateTaskForm(invalidData, false, "");
      expect(errors.title).toBe("Título é obrigatório");
      expect(errors.description).toBe("Descrição é obrigatória");
      expect(errors.category).toBe("Categoria é obrigatória");
    });

    it("should handle all invalid fields with custom category", () => {
      const invalidData: TaskFormData = {
        title: "  ",
        description: "",
        category: "Ignorado", // será ignorado por isCustom ser true
        priority: "Média",
        status: "Em Progresso",
      };
      const errors = validateTaskForm(invalidData, true, "  ");
      expect(errors.title).toBe("Título é obrigatório");
      expect(errors.description).toBe("Descrição é obrigatória");
      expect(errors.category).toBe("Categoria é obrigatória");
    });

    it("should accept valid task with minimal data", () => {
      const minimalData: TaskFormData = {
        title: "T",
        description: "D",
        category: "C",
        priority: "Baixa",
        status: "Concluído",
      };
      const errors = validateTaskForm(minimalData, false, "");
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("should accept valid custom category", () => {
      const taskData: TaskFormData = {
        title: "Teste",
        description: "Descrição teste",
        category: "", // será ignorado
        priority: "Alta",
        status: "Pendente",
      };
      const errors = validateTaskForm(
        taskData,
        true,
        "Categoria Personalizada"
      );
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });
});
