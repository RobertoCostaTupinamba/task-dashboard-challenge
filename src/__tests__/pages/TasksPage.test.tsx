import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { TasksPage } from "../../pages/TasksPage";
import type { Task } from "../../types/task";

// Types for mock components
interface TaskListProps {
  tasks: Task[];
  onRefresh: () => void;
  onEditTask: (task: Task) => void;
}

interface TaskFiltersProps {
  categories: string[];
  onFiltersChange: () => void;
}

interface TaskFormProps {
  task?: Task | null;
  onCancel: () => void;
  onSuccess: () => void;
}

// Mock dos stores
const mockTaskStore = {
  tasks: [] as Task[],
  categories: [] as string[],
  isLoading: false,
  error: null as string | null,
  getTasks: vi.fn(),
  getCategories: vi.fn(),
  clearError: vi.fn(),
};

const mockAuthStore = {
  user: {
    id: "user1",
    email: "test@example.com",
    name: "Test User",
  } as { id: string; email: string; name: string } | null,
};

// Mock dos componentes
vi.mock("../../components/TaskList", () => ({
  TaskList: ({ tasks, onRefresh, onEditTask }: TaskListProps) => (
    <div data-testid="task-list">
      <div>Task List - {tasks.length} tasks</div>
      <button onClick={onRefresh} data-testid="refresh-button">
        Refresh
      </button>
      {tasks.map((task: Task) => (
        <div key={task.id} data-testid={`task-${task.id}`}>
          <span>{task.title}</span>
          <button
            onClick={() => onEditTask(task)}
            data-testid={`edit-task-${task.id}`}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../components/TaskFilters", () => ({
  TaskFilters: ({ categories, onFiltersChange }: TaskFiltersProps) => (
    <div data-testid="task-filters">
      <div>Filters - {categories.length} categories</div>
      <button onClick={onFiltersChange} data-testid="filters-change">
        Apply Filters
      </button>
    </div>
  ),
}));

vi.mock("../../components/TaskForm", () => ({
  TaskForm: ({ task, onCancel, onSuccess }: TaskFormProps) => (
    <div data-testid="task-form">
      <div>Task Form - {task ? `Editing ${task.title}` : "New Task"}</div>
      <button onClick={onCancel} data-testid="form-cancel">
        Cancel
      </button>
      <button onClick={onSuccess} data-testid="form-success">
        Save
      </button>
    </div>
  ),
}));

// Mock dos stores
vi.mock("../../stores/taskStore", () => ({
  useTaskStore: () => mockTaskStore,
}));

vi.mock("../../stores/authStore", () => ({
  useAuthStore: () => mockAuthStore,
}));

describe("TasksPage", () => {
  const mockTasks: Task[] = [
    {
      id: "1",
      userId: "user1",
      title: "Tarefa 1",
      description: "Descrição da tarefa 1",
      category: "Trabalho",
      priority: "Alta",
      status: "Pendente",
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-01T10:00:00Z",
    },
    {
      id: "2",
      userId: "user1",
      title: "Tarefa 2",
      description: "Descrição da tarefa 2",
      category: "Pessoal",
      priority: "Média",
      status: "Em Progresso",
      createdAt: "2024-01-02T10:00:00Z",
      updatedAt: "2024-01-02T10:00:00Z",
    },
    {
      id: "3",
      userId: "user1",
      title: "Tarefa 3",
      description: "Descrição da tarefa 3",
      category: "Trabalho",
      priority: "Baixa",
      status: "Concluído",
      createdAt: "2024-01-03T10:00:00Z",
      updatedAt: "2024-01-03T10:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(mockTaskStore, {
      tasks: [],
      categories: [],
      isLoading: false,
      error: null,
      getTasks: vi.fn(),
      getCategories: vi.fn(),
      clearError: vi.fn(),
    });
  });

  describe("Initial Rendering", () => {
    it("should render page title and description", () => {
      render(<TasksPage />);

      expect(screen.getByText("Gerenciamento de Tarefas")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Organize suas tarefas de forma eficiente e mantenha-se produtivo"
        )
      ).toBeInTheDocument();
    });

    it("should render new task button", () => {
      render(<TasksPage />);

      const newTaskButton = screen.getByRole("button", {
        name: /nova tarefa/i,
      });
      expect(newTaskButton).toBeInTheDocument();
    });

    it("should render back button when onNavigateBack is provided", () => {
      const mockNavigateBack = vi.fn();
      render(<TasksPage onNavigateBack={mockNavigateBack} />);

      const backButton = screen.getByRole("button", { name: /voltar/i });
      expect(backButton).toBeInTheDocument();
    });

    it("should not render back button when onNavigateBack is not provided", () => {
      render(<TasksPage />);

      expect(
        screen.queryByRole("button", { name: /voltar/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("User Authentication", () => {
    it("should render authentication error when user is not logged in", () => {
      Object.assign(mockAuthStore, { user: null });
      render(<TasksPage />);

      expect(screen.getByText("Usuário não autenticado")).toBeInTheDocument();
    });

    it("should call getTasks and getCategories when user is logged in", async () => {
      Object.assign(mockAuthStore, {
        user: {
          id: "user1",
          email: "test@example.com",
          name: "Test User",
        },
      });

      render(<TasksPage />);

      await waitFor(() => {
        expect(mockTaskStore.getTasks).toHaveBeenCalledWith("user1");
        expect(mockTaskStore.getCategories).toHaveBeenCalledWith("user1");
      });
    });
  });

  describe("Statistics Cards", () => {
    beforeEach(() => {
      Object.assign(mockTaskStore, {
        tasks: mockTasks,
      });
    });

    it("should display correct total tasks count", () => {
      render(<TasksPage />);

      expect(screen.getByText("3")).toBeInTheDocument(); // Total tasks
    });

    it("should display correct completed tasks count", () => {
      render(<TasksPage />);

      const completedCards = screen.getAllByText("1"); // 1 completed task
      expect(completedCards.length).toBeGreaterThan(0);
    });

    it("should display correct in-progress tasks count", () => {
      render(<TasksPage />);

      const inProgressCards = screen.getAllByText("1"); // 1 in-progress task
      expect(inProgressCards.length).toBeGreaterThan(0);
    });

    it("should display correct pending tasks count", () => {
      render(<TasksPage />);

      const pendingCards = screen.getAllByText("1"); // 1 pending task
      expect(pendingCards.length).toBeGreaterThan(0);
    });
  });

  describe("Loading State", () => {
    it("should show loading spinner when isLoading is true", () => {
      Object.assign(mockTaskStore, {
        isLoading: true,
      });

      render(<TasksPage />);

      expect(screen.getByText("Carregando tarefas...")).toBeInTheDocument();
      expect(screen.queryByTestId("task-list")).not.toBeInTheDocument();
    });

    it("should show task list when isLoading is false", () => {
      Object.assign(mockTaskStore, {
        isLoading: false,
        tasks: mockTasks,
      });

      render(<TasksPage />);

      expect(
        screen.queryByText("Carregando tarefas...")
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("task-list")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should display error message when error exists", () => {
      Object.assign(mockTaskStore, {
        error: "Erro ao carregar tarefas",
      });

      render(<TasksPage />);

      expect(screen.getByText("Erro")).toBeInTheDocument();
      expect(screen.getByText("Erro ao carregar tarefas")).toBeInTheDocument();
    });

    it("should clear error when close button is clicked", async () => {
      const user = userEvent.setup();
      Object.assign(mockTaskStore, {
        error: "Erro ao carregar tarefas",
      });

      render(<TasksPage />);

      const closeButton = screen.getByRole("button", { name: "" });
      await user.click(closeButton);

      expect(mockTaskStore.clearError).toHaveBeenCalled();
    });

    it("should not display error message when error is null", () => {
      Object.assign(mockTaskStore, {
        error: null,
      });

      render(<TasksPage />);

      expect(screen.queryByText("Erro")).not.toBeInTheDocument();
    });
  });

  describe("Task Management", () => {
    beforeEach(() => {
      Object.assign(mockTaskStore, {
        tasks: mockTasks,
        categories: ["Trabalho", "Pessoal"],
      });
    });

    it("should open new task form when new task button is clicked", async () => {
      const user = userEvent.setup();
      render(<TasksPage />);

      const newTaskButton = screen.getByRole("button", {
        name: /nova tarefa/i,
      });
      await user.click(newTaskButton);

      expect(screen.getByTestId("task-form")).toBeInTheDocument();
      expect(screen.getByText("Task Form - New Task")).toBeInTheDocument();
    });

    it("should open edit task form when edit button is clicked", async () => {
      const user = userEvent.setup();
      render(<TasksPage />);

      const editButton = screen.getByTestId("edit-task-1");
      await user.click(editButton);

      expect(screen.getByTestId("task-form")).toBeInTheDocument();
      expect(
        screen.getByText("Task Form - Editing Tarefa 1")
      ).toBeInTheDocument();
    });

    it("should close form when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<TasksPage />);

      // Open form first
      const newTaskButton = screen.getByRole("button", {
        name: /nova tarefa/i,
      });
      await user.click(newTaskButton);

      expect(screen.getByTestId("task-form")).toBeInTheDocument();

      // Close form
      const cancelButton = screen.getByTestId("form-cancel");
      await user.click(cancelButton);

      expect(screen.queryByTestId("task-form")).not.toBeInTheDocument();
    });

    it("should close form and reload tasks when success button is clicked", async () => {
      const user = userEvent.setup();
      render(<TasksPage />);

      // Open form first
      const newTaskButton = screen.getByRole("button", {
        name: /nova tarefa/i,
      });
      await user.click(newTaskButton);

      // Save form
      const successButton = screen.getByTestId("form-success");
      await user.click(successButton);

      expect(screen.queryByTestId("task-form")).not.toBeInTheDocument();
      expect(mockTaskStore.getTasks).toHaveBeenCalledWith("user1");
    });

    it("should refresh tasks when refresh button is clicked", async () => {
      const user = userEvent.setup();
      render(<TasksPage />);

      const refreshButton = screen.getByTestId("refresh-button");
      await user.click(refreshButton);

      expect(mockTaskStore.getTasks).toHaveBeenCalledWith("user1");
    });
  });

  describe("Filters Integration", () => {
    beforeEach(() => {
      Object.assign(mockTaskStore, {
        tasks: mockTasks,
        categories: ["Trabalho", "Pessoal"],
      });
    });

    it("should render TaskFilters with correct categories", () => {
      render(<TasksPage />);

      expect(screen.getByTestId("task-filters")).toBeInTheDocument();
      expect(screen.getByText("Filters - 2 categories")).toBeInTheDocument();
    });

    it("should call getTasks when filters change", async () => {
      const user = userEvent.setup();
      render(<TasksPage />);

      const filtersChangeButton = screen.getByTestId("filters-change");
      await user.click(filtersChangeButton);

      expect(mockTaskStore.getTasks).toHaveBeenCalledWith("user1");
    });
  });

  describe("Navigation", () => {
    it("should call onNavigateBack when back button is clicked", async () => {
      const user = userEvent.setup();
      const mockNavigateBack = vi.fn();

      render(<TasksPage onNavigateBack={mockNavigateBack} />);

      const backButton = screen.getByRole("button", { name: /voltar/i });
      await user.click(backButton);

      expect(mockNavigateBack).toHaveBeenCalled();
    });
  });

  describe("Task List Integration", () => {
    beforeEach(() => {
      Object.assign(mockTaskStore, {
        tasks: mockTasks,
      });
    });

    it("should render TaskList with correct task count", () => {
      render(<TasksPage />);

      expect(screen.getByTestId("task-list")).toBeInTheDocument();
      expect(screen.getByText("Task List - 3 tasks")).toBeInTheDocument();
    });

    it("should render individual tasks", () => {
      render(<TasksPage />);

      expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
      expect(screen.getByText("Tarefa 2")).toBeInTheDocument();
      expect(screen.getByText("Tarefa 3")).toBeInTheDocument();
    });

    it("should render empty task list when no tasks", () => {
      Object.assign(mockTaskStore, {
        tasks: [],
      });

      render(<TasksPage />);

      expect(screen.getByText("Task List - 0 tasks")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle tasks filter correctly when tasks change", () => {
      const { rerender } = render(<TasksPage />);

      // Initially no tasks
      expect(screen.getByText("Task List - 0 tasks")).toBeInTheDocument();

      // Update tasks
      Object.assign(mockTaskStore, {
        tasks: mockTasks,
      });

      rerender(<TasksPage />);

      expect(screen.getByText("Task List - 3 tasks")).toBeInTheDocument();
    });

    it("should handle multiple form operations correctly", async () => {
      const user = userEvent.setup();

      // Add tasks to mock store
      Object.assign(mockTaskStore, {
        tasks: mockTasks,
      });

      render(<TasksPage />);

      // Open new task form
      const newTaskButton = screen.getByRole("button", {
        name: /nova tarefa/i,
      });
      await user.click(newTaskButton);
      expect(screen.getByText("Task Form - New Task")).toBeInTheDocument();

      // Cancel form
      await user.click(screen.getByTestId("form-cancel"));
      expect(screen.queryByTestId("task-form")).not.toBeInTheDocument();

      // Open edit task form
      await user.click(screen.getByTestId("edit-task-1"));
      expect(
        screen.getByText("Task Form - Editing Tarefa 1")
      ).toBeInTheDocument();

      // Success form
      await user.click(screen.getByTestId("form-success"));
      expect(screen.queryByTestId("task-form")).not.toBeInTheDocument();
    });
  });

  describe("Component State Management", () => {
    it("should maintain form state correctly", async () => {
      const user = userEvent.setup();
      render(<TasksPage />);

      // Initially no form
      expect(screen.queryByTestId("task-form")).not.toBeInTheDocument();

      // Open new task form
      await user.click(screen.getByRole("button", { name: /nova tarefa/i }));
      expect(screen.getByTestId("task-form")).toBeInTheDocument();

      // Form should show new task
      expect(screen.getByText("Task Form - New Task")).toBeInTheDocument();
    });

    it("should reset selected task when opening new task form", async () => {
      const user = userEvent.setup();

      // Add tasks to mock store
      Object.assign(mockTaskStore, {
        tasks: mockTasks,
      });

      render(<TasksPage />);

      // Open edit form first
      await user.click(screen.getByTestId("edit-task-1"));
      expect(
        screen.getByText("Task Form - Editing Tarefa 1")
      ).toBeInTheDocument();

      // Close and open new task form
      await user.click(screen.getByTestId("form-cancel"));
      await user.click(screen.getByRole("button", { name: /nova tarefa/i }));

      expect(screen.getByText("Task Form - New Task")).toBeInTheDocument();
    });
  });
});
