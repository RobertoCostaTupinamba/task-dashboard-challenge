import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi, describe, it, beforeEach, expect } from "vitest";
import App from "../App";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/authService";

// Mock do authService
vi.mock("../services/authService", () => ({
  authService: {
    getUserFromStorage: vi.fn(),
    saveUserToStorage: vi.fn(),
    removeUserFromStorage: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
  },
}));

// Mock das páginas
vi.mock("../pages/AuthPage", () => ({
  AuthPage: () => <div data-testid="auth-page">Auth Page</div>,
}));

vi.mock("../pages/DashboardPage", () => ({
  DashboardPage: () => (
    <div data-testid="dashboard-page">
      Dashboard Page
      <button
        onClick={() => useAuthStore.getState().logout()}
        data-testid="logout-btn"
      >
        Logout
      </button>
    </div>
  ),
}));

describe("App", () => {
  beforeEach(() => {
    // Resetar o store antes de cada teste
    useAuthStore.getState().logout();
    useAuthStore.setState({ isLoading: false, error: null });
    vi.clearAllMocks();
  });

  describe("App initialization", () => {
    it("should initialize authentication state on load", async () => {
      const mockUser = { id: 1, name: "João", email: "joao@teste.com" };
      vi.mocked(authService.getUserFromStorage).mockReturnValue(mockUser);

      render(<App />);

      await waitFor(() => {
        expect(authService.getUserFromStorage).toHaveBeenCalled();
      });
    });

    it("should initialize without user when there is no data in localStorage", () => {
      vi.mocked(authService.getUserFromStorage).mockReturnValue(null);

      render(<App />);

      expect(screen.getByTestId("auth-page")).toBeInTheDocument();
      expect(screen.queryByTestId("dashboard-page")).not.toBeInTheDocument();
    });
  });

  describe("Rendering based on authentication state", () => {
    it("should render AuthPage when not authenticated", () => {
      vi.mocked(authService.getUserFromStorage).mockReturnValue(null);

      render(<App />);

      expect(screen.getByTestId("auth-page")).toBeInTheDocument();
      expect(screen.queryByTestId("dashboard-page")).not.toBeInTheDocument();
    });

    it("should render DashboardPage when authenticated", async () => {
      const mockUser = { id: 1, name: "João", email: "joao@teste.com" };
      vi.mocked(authService.getUserFromStorage).mockReturnValue(mockUser);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
      });
      expect(screen.queryByTestId("auth-page")).not.toBeInTheDocument();
    });

    it("should switch to AuthPage after logout", async () => {
      const user = userEvent.setup();
      const mockUser = { id: 1, name: "João", email: "joao@teste.com" };
      vi.mocked(authService.getUserFromStorage).mockReturnValue(mockUser);

      render(<App />);

      // Check that dashboard is rendered
      await waitFor(() => {
        expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
      });

      // Perform logout
      const logoutBtn = screen.getByTestId("logout-btn");
      await user.click(logoutBtn);

      // Check that it switched to auth page
      await waitFor(() => {
        expect(screen.getByTestId("auth-page")).toBeInTheDocument();
      });
      expect(screen.queryByTestId("dashboard-page")).not.toBeInTheDocument();
    });
  });

  describe("Loading and error states", () => {
    it("should keep the current page during loading", () => {
      vi.mocked(authService.getUserFromStorage).mockReturnValue(null);

      render(<App />);

      // Simulate loading state
      useAuthStore.setState({ isLoading: true });

      expect(screen.getByTestId("auth-page")).toBeInTheDocument();
    });

    it("should keep the current page when there is an error", () => {
      vi.mocked(authService.getUserFromStorage).mockReturnValue(null);

      render(<App />);

      // Simulate error state
      useAuthStore.setState({ error: "Erro de autenticação" });

      expect(screen.getByTestId("auth-page")).toBeInTheDocument();
    });
  });

  describe("Integration with authStore", () => {
    it("should react to authentication state changes", async () => {
      vi.mocked(authService.getUserFromStorage).mockReturnValue(null);

      render(<App />);

      // Initially not authenticated
      expect(screen.getByTestId("auth-page")).toBeInTheDocument();

      // Simulate successful login
      const mockUser = { id: 1, name: "João", email: "joao@teste.com" };
      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Check that it switched to dashboard
      await waitFor(() => {
        expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
      });
      expect(screen.queryByTestId("auth-page")).not.toBeInTheDocument();
    });

    it("should call initializeAuth only once", () => {
      const initializeAuthSpy = vi.spyOn(
        useAuthStore.getState(),
        "initializeAuth"
      );
      vi.mocked(authService.getUserFromStorage).mockReturnValue(null);

      render(<App />);

      expect(initializeAuthSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("App structure", () => {
    it("should render the main div with class App", () => {
      vi.mocked(authService.getUserFromStorage).mockReturnValue(null);

      render(<App />);

      const appDiv = document.querySelector(".App");

      expect(appDiv).toBeInTheDocument();
    });

    it("should render only one page at a time", async () => {
      vi.mocked(authService.getUserFromStorage).mockReturnValue(null);

      render(<App />);

      // Check that only AuthPage is rendered
      expect(screen.getByTestId("auth-page")).toBeInTheDocument();
      expect(screen.queryByTestId("dashboard-page")).not.toBeInTheDocument();

      // Simulate authentication
      const mockUser = { id: 1, name: "João", email: "joao@teste.com" };
      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
      });

      // Check that only DashboardPage is rendered
      await waitFor(() => {
        expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
      });
      expect(screen.queryByTestId("auth-page")).not.toBeInTheDocument();
    });
  });
});
