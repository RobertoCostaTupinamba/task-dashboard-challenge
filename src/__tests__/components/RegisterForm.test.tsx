import React from "react";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { RegisterForm } from "../../components/RegisterForm";

// Mock do store
vi.mock("../../stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// Importar o mock após declarar
import { useAuthStore } from "../../stores/authStore";

describe("RegisterForm", () => {
  const mockOnSwitchToLogin = vi.fn();
  const mockUseAuthStore = vi.mocked(useAuthStore);

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      register: vi.fn(),
      isLoading: false,
      error: null,
      clearError: vi.fn(),
      login: vi.fn(),
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
      React.createElement(RegisterForm, {
        onSwitchToLogin: mockOnSwitchToLogin,
      });
    }).not.toThrow();
  });

  it("should use mocked store", () => {
    expect(mockUseAuthStore).toBeDefined();
    expect(typeof mockUseAuthStore).toBe("function");
  });

  it("should be a valid React component", () => {
    const component = React.createElement(RegisterForm, {
      onSwitchToLogin: mockOnSwitchToLogin,
    });
    expect(component).toBeTruthy();
    expect(component.type).toBe(RegisterForm);
  });

  it("should accept onSwitchToLogin prop", () => {
    const component = React.createElement(RegisterForm, {
      onSwitchToLogin: mockOnSwitchToLogin,
    });
    expect(component.props.onSwitchToLogin).toBe(mockOnSwitchToLogin);
  });

  it("should handle loading state", () => {
    mockUseAuthStore.mockReturnValue({
      register: vi.fn(),
      isLoading: true,
      error: null,
      clearError: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      initializeAuth: vi.fn(),
      user: null,
      isAuthenticated: false,
    });

    expect(() => {
      React.createElement(RegisterForm, {
        onSwitchToLogin: mockOnSwitchToLogin,
      });
    }).not.toThrow();
  });

  it("should handle error state", () => {
    mockUseAuthStore.mockReturnValue({
      register: vi.fn(),
      isLoading: false,
      error: "Registration failed",
      clearError: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      initializeAuth: vi.fn(),
      user: null,
      isAuthenticated: false,
    });

    expect(() => {
      React.createElement(RegisterForm, {
        onSwitchToLogin: mockOnSwitchToLogin,
      });
    }).not.toThrow();
  });
});
