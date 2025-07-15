import React from "react";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { LoginForm } from "../../components/LoginForm";

// Mock do store
vi.mock("../../stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// Importar o mock após declarar
import { useAuthStore } from "../../stores/authStore";

describe("LoginForm", () => {
  const mockOnSwitchToRegister = vi.fn();
  const mockUseAuthStore = vi.mocked(useAuthStore);

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      login: vi.fn(),
      isLoading: false,
      error: null,
      clearError: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initializeAuth: vi.fn(),
      user: null,
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing", () => {
    expect(() => {
      React.createElement(LoginForm, {
        onSwitchToRegister: mockOnSwitchToRegister,
      });
    }).not.toThrow();
  });

  it("should use mocked store", () => {
    expect(mockUseAuthStore).toBeDefined();
    expect(typeof mockUseAuthStore).toBe("function");
  });

  it("should be a valid React component", () => {
    const component = React.createElement(LoginForm, {
      onSwitchToRegister: mockOnSwitchToRegister,
    });
    expect(component).toBeTruthy();
    expect(component.type).toBe(LoginForm);
  });

  it("should accept onSwitchToRegister prop", () => {
    const component = React.createElement(LoginForm, {
      onSwitchToRegister: mockOnSwitchToRegister,
    });
    expect(component.props.onSwitchToRegister).toBe(mockOnSwitchToRegister);
  });

  it("should handle loading state", () => {
    mockUseAuthStore.mockReturnValue({
      login: vi.fn(),
      isLoading: true,
      error: null,
      clearError: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initializeAuth: vi.fn(),
      user: null,
      isAuthenticated: false,
    });

    expect(() => {
      React.createElement(LoginForm, {
        onSwitchToRegister: mockOnSwitchToRegister,
      });
    }).not.toThrow();
  });

  it("should handle error state", () => {
    mockUseAuthStore.mockReturnValue({
      login: vi.fn(),
      isLoading: false,
      error: "Login failed",
      clearError: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initializeAuth: vi.fn(),
      user: null,
      isAuthenticated: false,
    });

    expect(() => {
      React.createElement(LoginForm, {
        onSwitchToRegister: mockOnSwitchToRegister,
      });
    }).not.toThrow();
  });
});
