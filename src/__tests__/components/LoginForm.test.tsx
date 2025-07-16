import React from "react";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../../components/LoginForm";

// Mock do store
const mockLogin = vi.fn();
const mockClearError = vi.fn();

vi.mock("../../stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

import { useAuthStore } from "../../stores/authStore";

describe("LoginForm", () => {
  const mockOnSwitchToRegister = vi.fn();
  const mockUseAuthStore = vi.mocked(useAuthStore);

  const defaultStoreState = {
    login: mockLogin,
    isLoading: false,
    error: null,
    clearError: mockClearError,
    register: vi.fn(),
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

  it("should render login form with all elements", () => {
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    expect(screen.getByText("Entrar na sua conta")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByText("Não tem uma conta?")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Registre-se" })
    ).toBeInTheDocument();
  });

  it("should handle input changes correctly", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("should validate required fields on submit", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    const submitButton = screen.getByRole("button", { name: "Entrar" });
    await user.click(submitButton);

    expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should validate password length", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "123"); // Senha muito curta
    await user.click(submitButton);

    expect(
      screen.getByText("Senha deve ter pelo menos 6 caracteres")
    ).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should clear field errors when user starts typing", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    // Trigger validation error
    await user.click(submitButton);
    expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();

    // Start typing to clear error
    await user.type(emailInput, "t");
    expect(screen.queryByText("Email é obrigatório")).not.toBeInTheDocument();
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(mockClearError).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("should display error message from store", () => {
    mockUseAuthStore.mockReturnValue({
      ...defaultStoreState,
      error: "Credenciais inválidas",
    });

    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument();
    expect(screen.getByText("Credenciais inválidas")).toHaveClass(
      "text-red-700"
    );
  });

  it("should show loading state when submitting", () => {
    mockUseAuthStore.mockReturnValue({
      ...defaultStoreState,
      isLoading: true,
    });

    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    const submitButton = screen.getByRole("button", { name: "Entrando..." });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass("bg-gray-400", "cursor-not-allowed");
  });

  it("should call onSwitchToRegister when register button is clicked", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    const registerButton = screen.getByRole("button", { name: "Registre-se" });
    await user.click(registerButton);

    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1);
  });

  it("should have correct input placeholders", () => {
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    expect(screen.getByPlaceholderText("Digite seu email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite sua senha")).toBeInTheDocument();
  });

  it("should apply error styles to invalid fields", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    const submitButton = screen.getByRole("button", { name: "Entrar" });
    await user.click(submitButton);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");

    expect(emailInput).toHaveClass("border-red-500");
    expect(passwordInput).toHaveClass("border-red-500");
  });

  it("should clear store error when form is submitted", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(mockClearError).toHaveBeenCalledTimes(1);
  });

  it("should handle form submission with keyboard (Enter key)", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.keyboard("{Enter}");

    expect(mockClearError).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("should maintain focus and accessibility", () => {
    render(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");

    expect(emailInput).toHaveAttribute("id", "email");
    expect(passwordInput).toHaveAttribute("id", "password");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
