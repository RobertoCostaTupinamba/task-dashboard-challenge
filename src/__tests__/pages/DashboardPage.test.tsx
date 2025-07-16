import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock TasksPage antes de qualquer importação
vi.mock("../pages/TasksPage", () => ({
  TasksPage: ({ onNavigateBack }: { onNavigateBack: () => void }) => (
    <div data-testid="tasks-page">
      <div>Tasks Page</div>
      <button onClick={onNavigateBack} data-testid="back-to-dashboard">
        Back to Dashboard
      </button>
    </div>
  ),
}));

import { DashboardPage } from "../../pages/DashboardPage";

// Types for mock components
interface TaskStatsCardsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
  };
}

interface TaskStatusChartProps {
  data: Record<string, number>;
}

interface TaskCategoryChartProps {
  data: Record<string, number>;
}

// Mock dos stores
const mockAuthStore = {
  user: {
    id: "user1",
    email: "test@example.com",
    name: "Test User",
  } as { id: string; email: string; name: string } | null,
  logout: vi.fn(),
};

const mockTaskStore = {
  stats: null as {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
  } | null,
  getStats: vi.fn(),
  isLoading: false,
  error: null as string | null,
};

vi.mock("../../components/TaskStatsCards", () => ({
  TaskStatsCards: ({ stats }: TaskStatsCardsProps) => (
    <div data-testid="task-stats-cards">
      <div>Stats Cards - Total: {stats.total}</div>
      <div>Completed: {stats.completed}</div>
      <div>Pending: {stats.pending}</div>
      <div>In Progress: {stats.inProgress}</div>
    </div>
  ),
}));

vi.mock("../../components/TaskStatusChart", () => ({
  TaskStatusChart: ({ data }: TaskStatusChartProps) => (
    <div data-testid="task-status-chart">
      <div>Status Chart</div>
      <div>Data: {JSON.stringify(data)}</div>
    </div>
  ),
}));

vi.mock("../../components/TaskCategoryChart", () => ({
  TaskCategoryChart: ({ data }: TaskCategoryChartProps) => (
    <div data-testid="task-category-chart">
      <div>Category Chart</div>
      <div>Data: {JSON.stringify(data)}</div>
    </div>
  ),
}));

// Mock dos stores
vi.mock("../../stores/authStore", () => ({
  useAuthStore: () => mockAuthStore,
}));

vi.mock("../../stores/taskStore", () => ({
  useTaskStore: () => mockTaskStore,
}));

describe("DashboardPage", () => {
  const mockStats = {
    total: 10,
    completed: 3,
    pending: 4,
    inProgress: 3,
    byStatus: {
      Pendente: 4,
      "Em Progresso": 3,
      Concluído: 3,
    },
    byCategory: {
      Trabalho: 6,
      Pessoal: 4,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(mockAuthStore, {
      user: {
        id: "user1",
        email: "test@example.com",
        name: "Test User",
      },
      logout: vi.fn(),
    });
    Object.assign(mockTaskStore, {
      stats: null,
      getStats: vi.fn(),
      isLoading: false,
      error: null,
    });
  });

  describe("Initial Rendering", () => {
    it("should render dashboard header with user name", () => {
      render(<DashboardPage />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Olá,")).toBeInTheDocument();
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    it("should render logout button", () => {
      render(<DashboardPage />);

      const logoutButton = screen.getByRole("button", { name: /sair/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it("should render quick actions section", () => {
      render(<DashboardPage />);

      expect(screen.getByText("Acesso Rápido")).toBeInTheDocument();
      expect(
        screen.getByText("✅ Funcionalidades Implementadas:")
      ).toBeInTheDocument();
      expect(screen.getByText("🚀 Gerenciar Tarefas:")).toBeInTheDocument();
    });

    it("should render manage tasks button", () => {
      render(<DashboardPage />);

      const manageTasksButton = screen.getByRole("button", {
        name: /gerenciar tarefas/i,
      });
      expect(manageTasksButton).toBeInTheDocument();
    });
  });

  describe("useEffect and Data Loading", () => {
    it("should call getStats when user is present", async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        expect(mockTaskStore.getStats).toHaveBeenCalledWith("user1");
      });
    });

    it("should not call getStats when user is null", () => {
      Object.assign(mockAuthStore, { user: null });
      render(<DashboardPage />);

      expect(mockTaskStore.getStats).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should show loading spinner when isLoading is true", () => {
      Object.assign(mockTaskStore, { isLoading: true });
      const { container } = render(<DashboardPage />);

      expect(
        screen.getByText("Carregando estatísticas...")
      ).toBeInTheDocument();
      expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("should hide stats when loading", () => {
      Object.assign(mockTaskStore, {
        isLoading: true,
        stats: mockStats,
      });
      render(<DashboardPage />);

      expect(screen.queryByTestId("task-stats-cards")).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should display error message when error exists", () => {
      Object.assign(mockTaskStore, {
        error: "Erro ao carregar dados",
      });
      render(<DashboardPage />);

      expect(
        screen.getByText("Erro ao carregar estatísticas")
      ).toBeInTheDocument();
      expect(screen.getByText("Erro ao carregar dados")).toBeInTheDocument();
    });

    it("should not display error when error is null", () => {
      Object.assign(mockTaskStore, { error: null });
      render(<DashboardPage />);

      expect(
        screen.queryByText("Erro ao carregar estatísticas")
      ).not.toBeInTheDocument();
    });
  });

  describe("Stats and Charts Display", () => {
    beforeEach(() => {
      Object.assign(mockTaskStore, {
        stats: mockStats,
        isLoading: false,
      });
    });

    it("should render TaskStatsCards when stats are available", () => {
      render(<DashboardPage />);

      expect(screen.getByTestId("task-stats-cards")).toBeInTheDocument();
      expect(screen.getByText("Stats Cards - Total: 10")).toBeInTheDocument();
      expect(screen.getByText("Completed: 3")).toBeInTheDocument();
      expect(screen.getByText("Pending: 4")).toBeInTheDocument();
      expect(screen.getByText("In Progress: 3")).toBeInTheDocument();
    });

    it("should render TaskStatusChart with correct data", () => {
      render(<DashboardPage />);

      expect(screen.getByTestId("task-status-chart")).toBeInTheDocument();
      expect(screen.getByText("Status Chart")).toBeInTheDocument();
      expect(
        screen.getByText(`Data: ${JSON.stringify(mockStats.byStatus)}`)
      ).toBeInTheDocument();
    });

    it("should render TaskCategoryChart with correct data", () => {
      render(<DashboardPage />);

      expect(screen.getByTestId("task-category-chart")).toBeInTheDocument();
      expect(screen.getByText("Category Chart")).toBeInTheDocument();
      expect(
        screen.getByText(`Data: ${JSON.stringify(mockStats.byCategory)}`)
      ).toBeInTheDocument();
    });

    it("should render charts section with proper headers", () => {
      render(<DashboardPage />);

      expect(screen.getByText("Distribuição por Status")).toBeInTheDocument();
      expect(
        screen.getByText("Distribuição por Categoria")
      ).toBeInTheDocument();
    });

    it("should not render stats and charts when loading", () => {
      Object.assign(mockTaskStore, {
        stats: mockStats,
        isLoading: true,
      });
      render(<DashboardPage />);

      expect(screen.queryByTestId("task-stats-cards")).not.toBeInTheDocument();
      expect(screen.queryByTestId("task-status-chart")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("task-category-chart")
      ).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    beforeEach(() => {
      Object.assign(mockTaskStore, {
        stats: { ...mockStats, total: 0 },
        isLoading: false,
      });
    });

    it("should render empty state when total tasks is 0", () => {
      render(<DashboardPage />);

      expect(screen.getByText("Nenhuma tarefa encontrada")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Comece criando sua primeira tarefa para ver as estatísticas aqui."
        )
      ).toBeInTheDocument();
    });

    it("should render create first task button in empty state", () => {
      render(<DashboardPage />);

      const createButton = screen.getByRole("button", {
        name: /criar primeira tarefa/i,
      });
      expect(createButton).toBeInTheDocument();
    });

    it("should not render empty state when there are tasks", () => {
      Object.assign(mockTaskStore, {
        stats: mockStats, // total: 10
      });
      render(<DashboardPage />);

      expect(
        screen.queryByText("Nenhuma tarefa encontrada")
      ).not.toBeInTheDocument();
    });

    it("should not render empty state when loading", () => {
      Object.assign(mockTaskStore, {
        stats: { ...mockStats, total: 0 },
        isLoading: true,
      });
      render(<DashboardPage />);

      expect(
        screen.queryByText("Nenhuma tarefa encontrada")
      ).not.toBeInTheDocument();
    });
  });

  describe("Navigation Between Views", () => {
    it("should render dashboard view by default", () => {
      render(<DashboardPage />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.queryByTestId("tasks-page")).not.toBeInTheDocument();
    });

    it("should navigate to tasks view when manage tasks button is clicked", async () => {
      const user = userEvent.setup();
      render(<DashboardPage />);

      const manageTasksButton = screen.getByRole("button", {
        name: /gerenciar tarefas/i,
      });
      await user.click(manageTasksButton);

      expect(screen.getByTestId("tasks-page")).toBeInTheDocument();
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    });

    it("should navigate to tasks view when create first task button is clicked", async () => {
      const user = userEvent.setup();
      Object.assign(mockTaskStore, {
        stats: { ...mockStats, total: 0 },
        isLoading: false,
      });
      render(<DashboardPage />);

      const createButton = screen.getByRole("button", {
        name: /criar primeira tarefa/i,
      });
      await user.click(createButton);

      expect(screen.getByTestId("tasks-page")).toBeInTheDocument();
    });

    it("should navigate back to dashboard from tasks view", async () => {
      const user = userEvent.setup();
      render(<DashboardPage />);

      // Navigate to tasks
      const manageTasksButton = screen.getByRole("button", {
        name: /gerenciar tarefas/i,
      });
      await user.click(manageTasksButton);

      expect(screen.getByTestId("tasks-page")).toBeInTheDocument();

      // Navigate back to dashboard
      const backButton = screen.getByTestId("back-to-dashboard");
      await user.click(backButton);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.queryByTestId("tasks-page")).not.toBeInTheDocument();
    });
  });

  describe("User Actions", () => {
    it("should call logout when logout button is clicked", async () => {
      const user = userEvent.setup();
      render(<DashboardPage />);

      const logoutButton = screen.getByRole("button", { name: /sair/i });
      await user.click(logoutButton);

      expect(mockAuthStore.logout).toHaveBeenCalled();
    });
  });

  describe("Quick Actions Content", () => {
    it("should display implemented features list", () => {
      render(<DashboardPage />);

      expect(
        screen.getByText("• Sistema de autenticação completo")
      ).toBeInTheDocument();
      expect(
        screen.getByText("• Gerenciamento de tarefas (CRUD)")
      ).toBeInTheDocument();
      expect(
        screen.getByText("• Filtros por status, categoria e prioridade")
      ).toBeInTheDocument();
      expect(screen.getByText("• Busca por texto")).toBeInTheDocument();
      expect(
        screen.getByText("• Dashboard com gráficos analíticos")
      ).toBeInTheDocument();
      expect(screen.getByText("• Interface responsiva")).toBeInTheDocument();
    });

    it("should display manage tasks description", () => {
      render(<DashboardPage />);

      expect(
        screen.getByText(
          "Acesse a página de gerenciamento para criar, editar e organizar suas tarefas."
        )
      ).toBeInTheDocument();
    });
  });

  describe("Conditional Rendering Logic", () => {
    it("should render different content based on currentView state", async () => {
      const user = userEvent.setup();
      render(<DashboardPage />);

      // Initially dashboard view
      expect(screen.getByText("Dashboard")).toBeInTheDocument();

      // Switch to tasks view
      const manageTasksButton = screen.getByRole("button", {
        name: /gerenciar tarefas/i,
      });
      await user.click(manageTasksButton);

      // Should render TasksPage component
      expect(screen.getByTestId("tasks-page")).toBeInTheDocument();
      expect(screen.getByText("Tasks Page")).toBeInTheDocument();
    });

    it("should handle stats being null gracefully", () => {
      Object.assign(mockTaskStore, {
        stats: null,
        isLoading: false,
      });
      render(<DashboardPage />);

      expect(screen.queryByTestId("task-stats-cards")).not.toBeInTheDocument();
      expect(screen.queryByTestId("task-status-chart")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("task-category-chart")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Nenhuma tarefa encontrada")
      ).not.toBeInTheDocument();
    });
  });

  describe("Integration with Stores", () => {
    it("should work correctly when user changes", () => {
      const { rerender } = render(<DashboardPage />);

      expect(mockTaskStore.getStats).toHaveBeenCalledWith("user1");

      // Change user
      Object.assign(mockAuthStore, {
        user: { id: "user2", email: "user2@test.com", name: "User 2" },
      });

      rerender(<DashboardPage />);

      expect(mockTaskStore.getStats).toHaveBeenCalledWith("user2");
    });

    it("should handle multiple state updates correctly", async () => {
      const user = userEvent.setup();

      // Start with loading state
      Object.assign(mockTaskStore, { isLoading: true });
      const { rerender } = render(<DashboardPage />);

      expect(
        screen.getByText("Carregando estatísticas...")
      ).toBeInTheDocument();

      // Update to loaded state with stats
      Object.assign(mockTaskStore, {
        isLoading: false,
        stats: mockStats,
      });
      rerender(<DashboardPage />);

      expect(screen.getByTestId("task-stats-cards")).toBeInTheDocument();

      // Navigate to tasks and back
      const manageTasksButton = screen.getByRole("button", {
        name: /gerenciar tarefas/i,
      });
      await user.click(manageTasksButton);

      expect(screen.getByTestId("tasks-page")).toBeInTheDocument();

      const backButton = screen.getByTestId("back-to-dashboard");
      await user.click(backButton);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined user gracefully", () => {
      Object.assign(mockAuthStore, { user: undefined });
      render(<DashboardPage />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(mockTaskStore.getStats).not.toHaveBeenCalled();
    });

    it("should handle empty stats object", () => {
      Object.assign(mockTaskStore, {
        stats: {},
        isLoading: false,
      });
      render(<DashboardPage />);

      // Should not crash and should not show empty state
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(
        screen.queryByText("Nenhuma tarefa encontrada")
      ).not.toBeInTheDocument();
    });
  });
});
