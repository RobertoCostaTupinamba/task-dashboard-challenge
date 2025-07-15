import React from "react";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskForm } from "../../components/TaskForm";

// Mock do store
vi.mock("../../stores/taskStore", () => ({
  useTaskStore: vi.fn(),
}));

vi.mock("../../stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// Importar os mocks após declarar
import { useTaskStore } from "../../stores/taskStore";
import { useAuthStore } from "../../stores/authStore";

describe("TaskForm", () => {
  const mockOnCancel = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockCreateTask = vi.fn();
  const mockUpdateTask = vi.fn();
  const mockGetCategories = vi.fn();
  const mockClearError = vi.fn();

  const mockUseTaskStore = vi.mocked(useTaskStore);
  const mockUseAuthStore = vi.mocked(useAuthStore);

  beforeEach(() => {
    mockUseTaskStore.mockReturnValue({
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      categories: ["trabalho", "pessoal"],
      getCategories: mockGetCategories,
      isLoading: false,
      error: null,
      clearError: mockClearError,
      tasks: [],
      stats: null,
      filters: {},
      getTasks: vi.fn(),
      deleteTask: vi.fn(),
      getStats: vi.fn(),
      setFilters: vi.fn(),
      clearFilters: vi.fn(),
    });

    mockUseAuthStore.mockReturnValue({
      user: { id: "1", name: "Test User", email: "test@example.com" },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders new task form", () => {
      render(
        <TaskForm
          task={null}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      expect(screen.getByText("Nova Tarefa")).toBeInTheDocument();
      expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/prioridade/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    });

    it("renders edit task form", () => {
      const task = {
        id: "1",
        userId: "1",
        title: "Tarefa Teste",
        description: "Descrição teste",
        category: "trabalho",
        priority: "Alta" as const,
        status: "Pendente" as const,
      };

      render(
        <TaskForm
          task={task}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      expect(screen.getByText("Editar Tarefa")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Tarefa Teste")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Descrição teste")).toBeInTheDocument();
      expect(screen.getByDisplayValue("trabalho")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Alta")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Pendente")).toBeInTheDocument();
    });

    it("renders available categories list", () => {
      render(
        <TaskForm
          task={null}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      const categorySelect = screen.getByLabelText(/categoria/i);
      expect(categorySelect).toBeInTheDocument();

      fireEvent.click(categorySelect);
      expect(screen.getByText("trabalho")).toBeInTheDocument();
      expect(screen.getByText("pessoal")).toBeInTheDocument();
    });

    it("renders error message when there is an error", () => {
      mockUseTaskStore.mockReturnValue({
        createTask: mockCreateTask,
        updateTask: mockUpdateTask,
        categories: [],
        getCategories: mockGetCategories,
        isLoading: false,
        error: "Erro ao criar tarefa",
        clearError: mockClearError,
        tasks: [],
        stats: null,
        filters: {},
        getTasks: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
      });

      render(
        <TaskForm
          task={null}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      expect(screen.getByText("Erro ao criar tarefa")).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("displays validation errors for required fields", async () => {
      render(
        <TaskForm
          task={null}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      fireEvent.click(screen.getByText("Criar"));

      await waitFor(() => {
        expect(screen.getByText("Título é obrigatório")).toBeInTheDocument();
        expect(screen.getByText("Descrição é obrigatória")).toBeInTheDocument();
        expect(screen.getByText("Categoria é obrigatória")).toBeInTheDocument();
      });
    });

    it("clears error when user types in field", async () => {
      render(
        <TaskForm
          task={null}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      // Trigger validation
      fireEvent.click(screen.getByText("Criar"));

      await waitFor(() => {
        expect(screen.getByText("Título é obrigatório")).toBeInTheDocument();
      });

      // Digite no campo
      fireEvent.change(screen.getByLabelText(/título/i), {
        target: { value: "Novo título" },
      });

      await waitFor(() => {
        expect(
          screen.queryByText("Título é obrigatório")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Submission", () => {
    it("creates new task with valid data", async () => {
      render(
        <TaskForm
          task={null}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      fireEvent.change(screen.getByLabelText(/título/i), {
        target: { value: "Nova Tarefa" },
      });

      fireEvent.change(screen.getByLabelText(/descrição/i), {
        target: { value: "Descrição da tarefa" },
      });

      fireEvent.change(screen.getByLabelText(/categoria/i), {
        target: { value: "trabalho" },
      });

      fireEvent.click(screen.getByText("Criar"));

      await waitFor(() => {
        expect(mockCreateTask).toHaveBeenCalledWith("1", {
          title: "Nova Tarefa",
          description: "Descrição da tarefa",
          category: "trabalho",
          priority: "Média",
          status: "Pendente",
        });
      });
    });

    it("updates existing task with valid data", async () => {
      const task = {
        id: "1",
        userId: "1",
        title: "Tarefa Teste",
        description: "Descrição teste",
        category: "trabalho",
        priority: "Alta" as const,
        status: "Pendente" as const,
      };

      render(
        <TaskForm
          task={task}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      fireEvent.change(screen.getByLabelText(/título/i), {
        target: { value: "Tarefa Atualizada" },
      });

      fireEvent.click(screen.getByText("Atualizar"));

      await waitFor(() => {
        expect(mockUpdateTask).toHaveBeenCalledWith("1", {
          title: "Tarefa Atualizada",
          description: "Descrição teste",
          category: "trabalho",
          priority: "Alta",
          status: "Pendente",
        });
      });
    });

    it("calls onSuccess after successful creation", async () => {
      mockCreateTask.mockResolvedValue({});

      render(
        <TaskForm
          task={null}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      fireEvent.change(screen.getByLabelText(/título/i), {
        target: { value: "Nova Tarefa" },
      });

      fireEvent.change(screen.getByLabelText(/descrição/i), {
        target: { value: "Descrição da tarefa" },
      });

      fireEvent.change(screen.getByLabelText(/categoria/i), {
        target: { value: "trabalho" },
      });

      fireEvent.click(screen.getByText("Criar"));

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("Interactions", () => {
    it("calls onCancel when clicking cancel", () => {
      render(
        <TaskForm
          task={null}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      fireEvent.click(screen.getByText("Cancelar"));
      expect(mockOnCancel).toHaveBeenCalled();
    });

    it("calls onCancel when clicking X", () => {
      render(
        <TaskForm
          task={null}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      const closeButton = screen.getByRole("button", { name: "" });
      fireEvent.click(closeButton);
      expect(mockOnCancel).toHaveBeenCalled();
    });

    it("allows creating new category", async () => {
      render(
        <TaskForm
          task={null}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      fireEvent.change(screen.getByLabelText(/categoria/i), {
        target: { value: "custom" },
      });

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Digite a nova categoria")
        ).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText("Digite a nova categoria"), {
        target: { value: "nova-categoria" },
      });

      fireEvent.change(screen.getByLabelText(/título/i), {
        target: { value: "Tarefa com nova categoria" },
      });

      fireEvent.change(screen.getByLabelText(/descrição/i), {
        target: { value: "Descrição" },
      });

      fireEvent.click(screen.getByText("Criar"));

      await waitFor(() => {
        expect(mockCreateTask).toHaveBeenCalledWith(
          "1",
          expect.objectContaining({
            category: "nova-categoria",
          })
        );
      });
    });

    it("displays loading button when isLoading is true", () => {
      mockUseTaskStore.mockReturnValue({
        createTask: mockCreateTask,
        updateTask: mockUpdateTask,
        categories: [],
        getCategories: mockGetCategories,
        isLoading: true,
        error: null,
        clearError: mockClearError,
        tasks: [],
        stats: null,
        filters: {},
        getTasks: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
      });

      render(
        <TaskForm
          task={null}
          onCancel={mockOnCancel}
          onSuccess={mockOnSuccess}
        />
      );

      expect(screen.getByText("Salvando...")).toBeInTheDocument();
      expect(screen.getByText("Salvando...")).toBeDisabled();
    });
  });
});
