import React from "react";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "../../components/RegisterForm";

// Mock do store
const mockRegister = vi.fn();
const mockClearError = vi.fn();

vi.mock("../../stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

import { useAuthStore } from "../../stores/authStore";

describe("RegisterForm", () => {
  const mockOnSwitchToLogin = vi.fn();
  const mockUseAuthStore = vi.mocked(useAuthStore);

  const defaultStoreState = {
    register: mockRegister,
    isLoading: false,
    error: null,
    clearError: mockClearError,
    login: vi.fn(),
    logout: vi.fn(),
    initializeAuth: vi.fn(),
    user: null,
    isAuthenticated: false,
  };

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue(defaultStoreState);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render register form with all elements", () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    expect(screen.getByText("Criar nova conta")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome Completo")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar Senha")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Criar conta" })
    ).toBeInTheDocument();
    expect(screen.getByText("Já tem uma conta?")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Faça login" })
    ).toBeInTheDocument();
  });

  it("should handle input changes correctly", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText("Nome Completo");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");

    await user.type(nameInput, "João Silva");
    await user.type(emailInput, "joao@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");

    expect(nameInput).toHaveValue("João Silva");
    expect(emailInput).toHaveValue("joao@example.com");
    expect(passwordInput).toHaveValue("password123");
    expect(confirmPasswordInput).toHaveValue("password123");
  });

  it("should validate required fields on submit", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const submitButton = screen.getByRole("button", { name: "Criar conta" });
    await user.click(submitButton);

    expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
    expect(
      screen.getByText("Confirmação de senha é obrigatória")
    ).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should validate name minimum length", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText("Nome Completo");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
    const submitButton = screen.getByRole("button", { name: "Criar conta" });

    await user.type(nameInput, "A"); // Nome muito curto
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");
    await user.click(submitButton);

    expect(
      screen.getByText("Nome deve ter pelo menos 2 caracteres")
    ).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should validate password length", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText("Nome Completo");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
    const submitButton = screen.getByRole("button", { name: "Criar conta" });

    await user.type(nameInput, "João Silva");
    await user.type(emailInput, "joao@example.com");
    await user.type(passwordInput, "123"); // Senha muito curta
    await user.type(confirmPasswordInput, "123");
    await user.click(submitButton);

    expect(
      screen.getByText("Senha deve ter pelo menos 6 caracteres")
    ).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should validate password confirmation match", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText("Nome Completo");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
    const submitButton = screen.getByRole("button", { name: "Criar conta" });

    await user.type(nameInput, "João Silva");
    await user.type(emailInput, "joao@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "different123"); // Senhas diferentes
    await user.click(submitButton);

    expect(screen.getByText("As senhas não coincidem")).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should clear field errors when user starts typing", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText("Nome Completo");
    const submitButton = screen.getByRole("button", { name: "Criar conta" });

    // Trigger validation error
    await user.click(submitButton);
    expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();

    // Start typing to clear error
    await user.type(nameInput, "J");
    expect(screen.queryByText("Nome é obrigatório")).not.toBeInTheDocument();
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText("Nome Completo");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
    const submitButton = screen.getByRole("button", { name: "Criar conta" });

    await user.type(nameInput, "João Silva");
    await user.type(emailInput, "joao@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");
    await user.click(submitButton);

    expect(mockClearError).toHaveBeenCalled();
    expect(mockRegister).toHaveBeenCalledWith({
      name: "João Silva",
      email: "joao@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
  });

  it("should display error message from store", () => {
    mockUseAuthStore.mockReturnValue({
      ...defaultStoreState,
      error: "Email já está em uso",
    });

    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    expect(screen.getByText("Email já está em uso")).toBeInTheDocument();
    expect(screen.getByText("Email já está em uso")).toHaveClass(
      "text-red-700"
    );
  });

  it("should show loading state when submitting", () => {
    mockUseAuthStore.mockReturnValue({
      ...defaultStoreState,
      isLoading: true,
    });

    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const submitButton = screen.getByRole("button", {
      name: "Criando conta...",
    });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass("bg-gray-400", "cursor-not-allowed");
  });

  it("should call onSwitchToLogin when login button is clicked", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const loginButton = screen.getByRole("button", { name: "Faça login" });
    await user.click(loginButton);

    expect(mockOnSwitchToLogin).toHaveBeenCalledTimes(1);
  });

  it("should have correct input placeholders", () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    expect(
      screen.getByPlaceholderText("Digite seu nome completo")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite seu email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite sua senha")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirme sua senha")
    ).toBeInTheDocument();
  });

  it("should apply error styles to invalid fields", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const submitButton = screen.getByRole("button", { name: "Criar conta" });
    await user.click(submitButton);

    const nameInput = screen.getByLabelText("Nome Completo");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");

    expect(nameInput).toHaveClass("border-red-500");
    expect(emailInput).toHaveClass("border-red-500");
    expect(passwordInput).toHaveClass("border-red-500");
    expect(confirmPasswordInput).toHaveClass("border-red-500");
  });

  it("should clear store error when form is submitted", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText("Nome Completo");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
    const submitButton = screen.getByRole("button", { name: "Criar conta" });

    await user.type(nameInput, "João Silva");
    await user.type(emailInput, "joao@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");
    await user.click(submitButton);

    expect(mockClearError).toHaveBeenCalledTimes(1);
  });

  it("should handle form submission with keyboard (Enter key)", async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText("Nome Completo");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");

    await user.type(nameInput, "João Silva");
    await user.type(emailInput, "joao@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");
    await user.keyboard("{Enter}");

    expect(mockClearError).toHaveBeenCalled();
    expect(mockRegister).toHaveBeenCalledWith({
      name: "João Silva",
      email: "joao@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
  });

  it("should maintain focus and accessibility", () => {
    render(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText("Nome Completo");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");

    expect(nameInput).toHaveAttribute("id", "name");
    expect(emailInput).toHaveAttribute("id", "email");
    expect(passwordInput).toHaveAttribute("id", "password");
    expect(confirmPasswordInput).toHaveAttribute("id", "confirmPassword");
    expect(nameInput).toHaveAttribute("type", "text");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });

  it("should have correct button styling for different states", () => {
    // Normal state
    const { rerender } = render(
      <RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />
    );
    const normalButton = screen.getByRole("button", { name: "Criar conta" });
    expect(normalButton).toHaveClass("bg-green-600", "hover:bg-green-700");

    // Loading state
    mockUseAuthStore.mockReturnValue({
      ...defaultStoreState,
      isLoading: true,
    });
    rerender(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);
    const loadingButton = screen.getByRole("button", {
      name: "Criando conta...",
    });
    expect(loadingButton).toHaveClass("bg-gray-400", "cursor-not-allowed");
  });
});
