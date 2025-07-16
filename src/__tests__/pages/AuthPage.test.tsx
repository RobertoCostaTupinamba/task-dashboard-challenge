import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthPage } from "../../pages/AuthPage";

// Mock dos componentes filhos
vi.mock("../../components/LoginForm", () => ({
  LoginForm: ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => (
    <div data-testid="login-form">
      <button onClick={onSwitchToRegister} data-testid="switch-to-register">
        Criar conta
      </button>
      Login Form
    </div>
  ),
}));

vi.mock("../../components/RegisterForm", () => ({
  RegisterForm: ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => (
    <div data-testid="register-form">
      <button onClick={onSwitchToLogin} data-testid="switch-to-login">
        Fazer login
      </button>
      Register Form
    </div>
  ),
}));

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing", () => {
    render(<AuthPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("should display the main title and subtitle", () => {
    render(<AuthPage />);

    expect(
      screen.getByText("Sistema de Gerenciamento de Tarefas")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Organize suas tarefas de forma eficiente")
    ).toBeInTheDocument();
  });

  it("should display the footer text", () => {
    render(<AuthPage />);

    expect(
      screen.getByText("Desenvolvido como parte do desafio técnico")
    ).toBeInTheDocument();
  });

  it("should render LoginForm by default", () => {
    render(<AuthPage />);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.queryByTestId("register-form")).not.toBeInTheDocument();
  });

  it("should switch to register form when switch function is called", () => {
    render(<AuthPage />);

    // Inicialmente deve mostrar o login form
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.queryByTestId("register-form")).not.toBeInTheDocument();

    // Clica no botão para alternar para registro
    fireEvent.click(screen.getByTestId("switch-to-register"));

    // Agora deve mostrar o register form
    expect(screen.queryByTestId("login-form")).not.toBeInTheDocument();
    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });

  it("should switch back to login form when switch function is called", () => {
    render(<AuthPage />);

    // Alterna para register
    fireEvent.click(screen.getByTestId("switch-to-register"));
    expect(screen.getByTestId("register-form")).toBeInTheDocument();

    // Alterna de volta para login
    fireEvent.click(screen.getByTestId("switch-to-login"));
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.queryByTestId("register-form")).not.toBeInTheDocument();
  });

  it("should have correct CSS classes for styling", () => {
    const { container } = render(<AuthPage />);

    // Busca pelo div principal que contém todas as classes CSS
    const mainDiv = container.querySelector(".min-h-screen");
    expect(mainDiv).toHaveClass(
      "min-h-screen",
      "bg-gradient-to-br",
      "from-blue-50",
      "to-indigo-100",
      "flex",
      "items-center",
      "justify-center",
      "p-4"
    );
  });

  it("should pass correct props to LoginForm", () => {
    render(<AuthPage />);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    // Verifica se o botão de switch está presente (indica que a prop foi passada)
    expect(screen.getByTestId("switch-to-register")).toBeInTheDocument();
  });

  it("should pass correct props to RegisterForm", () => {
    render(<AuthPage />);

    // Alterna para register form
    fireEvent.click(screen.getByTestId("switch-to-register"));

    expect(screen.getByTestId("register-form")).toBeInTheDocument();
    // Verifica se o botão de switch está presente (indica que a prop foi passada)
    expect(screen.getByTestId("switch-to-login")).toBeInTheDocument();
  });
});
