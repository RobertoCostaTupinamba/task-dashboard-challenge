import React from "react";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskList } from "../../components/TaskList";
import type { Task } from "../../types/task";

// Mock do store
vi.mock("../../stores/taskStore", () => ({
  useTaskStore: vi.fn(),
}));

vi.mock("../../stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// Mock do window.confirm
Object.defineProperty(window, "confirm", {
  value: vi.fn(),
  writable: true,
});

// Importar o mock após declarar
import { useTaskStore } from "../../stores/taskStore";
import { useAuthStore } from "../../stores/authStore";

describe("TaskList", () => {
  const mockOnRefresh = vi.fn();
  const mockOnEditTask = vi.fn();
  const mockDeleteTask = vi.fn();
  const mockUseTaskStore = vi.mocked(useTaskStore);
  const mockUseAuthStore = vi.mocked(useAuthStore);

  const mockTasks: Task[] = [
    {
      id: "1",
      userId: "1",
      title: "Tarefa 1",
      description: "Descrição da tarefa 1",
      category: "trabalho",
      priority: "Alta",
      status: "Pendente",
    },
    {
      id: "2",
      userId: "1",
      title: "Tarefa 2",
      description: "Descrição da tarefa 2",
      category: "pessoal",
      priority: "Média",
      status: "Em Progresso",
    },
    {
      id: "3",
      userId: "1",
      title: "Tarefa 3",
      description: "Descrição da tarefa 3",
      category: "trabalho",
      priority: "Baixa",
      status: "Concluído",
    },
  ];

  beforeEach(() => {
    mockUseTaskStore.mockReturnValue({
      deleteTask: mockDeleteTask,
      isLoading: false,
      createTask: vi.fn(),
      updateTask: vi.fn(),
      categories: [],
      getCategories: vi.fn(),
      error: null,
      clearError: vi.fn(),
      tasks: [],
      stats: null,
      filters: {},
      getTasks: vi.fn(),
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

    mockOnRefresh.mockClear();
    mockOnEditTask.mockClear();
    mockDeleteTask.mockClear();
    vi.mocked(window.confirm).mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders tasks list", () => {
      render(
        <TaskList
          tasks={mockTasks}
          onRefresh={mockOnRefresh}
          onEditTask={mockOnEditTask}
        />
      );

      expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
      expect(screen.getByText("Tarefa 2")).toBeInTheDocument();
      expect(screen.getByText("Tarefa 3")).toBeInTheDocument();
    });

    it("renders message when there are no tasks", () => {
      render(
        <TaskList
          tasks={[]}
          onRefresh={mockOnRefresh}
          onEditTask={mockOnEditTask}
        />
      );

      expect(screen.getByText("Nenhuma tarefa encontrada")).toBeInTheDocument();
      expect(
        screen.getByText("Crie sua primeira tarefa para começar!")
      ).toBeInTheDocument();
    });

    it("renders task information correctly", () => {
      render(
        <TaskList
          tasks={[mockTasks[0]]}
          onRefresh={mockOnRefresh}
          onEditTask={mockOnEditTask}
        />
      );

      expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
      expect(screen.getByText("Descrição da tarefa 1")).toBeInTheDocument();
      expect(screen.getByText("trabalho")).toBeInTheDocument();
      expect(screen.getByText("Alta")).toBeInTheDocument();
      expect(screen.getByText("Pendente")).toBeInTheDocument();
    });

    it("renders correct colors for priority", () => {
      render(
        <TaskList
          tasks={mockTasks}
          onRefresh={mockOnRefresh}
          onEditTask={mockOnEditTask}
        />
      );

      const alta = screen.getByText("Alta");
      const media = screen.getByText("Média");
      const baixa = screen.getByText("Baixa");

      expect(alta).toHaveClass("text-red-600", "bg-red-100");
      expect(media).toHaveClass("text-yellow-600", "bg-yellow-100");
      expect(baixa).toHaveClass("text-green-600", "bg-green-100");
    });

    it("renders correct colors for status", () => {
      render(
        <TaskList
          tasks={mockTasks}
          onRefresh={mockOnRefresh}
          onEditTask={mockOnEditTask}
        />
      );

      const pendente = screen.getByText("Pendente");
      const emProgresso = screen.getByText("Em Progresso");
      const concluido = screen.getByText("Concluído");

      expect(pendente).toHaveClass("text-gray-600", "bg-gray-100");
      expect(emProgresso).toHaveClass("text-blue-600", "bg-blue-100");
      expect(concluido).toHaveClass("text-green-600", "bg-green-100");
    });

    it("renders action buttons for each task", () => {
      render(
        <TaskList
          tasks={[mockTasks[0]]}
          onRefresh={mockOnRefresh}
          onEditTask={mockOnEditTask}
        />
      );

      const editButtons = screen.getAllByTitle("Editar tarefa");
      const deleteButtons = screen.getAllByTitle("Deletar tarefa");

      expect(editButtons).toHaveLength(1);
      expect(deleteButtons).toHaveLength(1);
    });
  });

  describe("Interactions", () => {
    it("calls onEditTask when clicking edit button", () => {
      render(
        <TaskList
          tasks={[mockTasks[0]]}
          onRefresh={mockOnRefresh}
          onEditTask={mockOnEditTask}
        />
      );

      const editButton = screen.getByTitle("Editar tarefa");
      fireEvent.click(editButton);

      expect(mockOnEditTask).toHaveBeenCalledWith(mockTasks[0]);
    });

    it("deletes task when confirming in modal", async () => {
      vi.mocked(window.confirm).mockReturnValue(true);

      render(
        <TaskList
          tasks={[mockTasks[0]]}
          onRefresh={mockOnRefresh}
          onEditTask={mockOnEditTask}
        />
      );

      const deleteButton = screen.getByTitle("Deletar tarefa");
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteTask).toHaveBeenCalledWith("1");
        expect(mockOnRefresh).toHaveBeenCalled();
      });
    });

    it("does not delete task when cancelling in modal", () => {
      vi.mocked(window.confirm).mockReturnValue(false);

      render(
        <TaskList
          tasks={[mockTasks[0]]}
          onRefresh={mockOnRefresh}
          onEditTask={mockOnEditTask}
        />
      );

      const deleteButton = screen.getByTitle("Deletar tarefa");
      fireEvent.click(deleteButton);

      expect(mockDeleteTask).not.toHaveBeenCalled();
      expect(mockOnRefresh).not.toHaveBeenCalled();
    });

    it("disables delete button when isLoading is true", () => {
      mockUseTaskStore.mockReturnValue({
        deleteTask: mockDeleteTask,
        isLoading: true,
        createTask: vi.fn(),
        updateTask: vi.fn(),
        categories: [],
        getCategories: vi.fn(),
        error: null,
        clearError: vi.fn(),
        tasks: [],
        stats: null,
        filters: {},
        getTasks: vi.fn(),
        getStats: vi.fn(),
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
      });

      render(
        <TaskList
          tasks={[mockTasks[0]]}
          onRefresh={mockOnRefresh}
          onEditTask={mockOnEditTask}
        />
      );

      const deleteButton = screen.getByTitle("Deletar tarefa");
      expect(deleteButton).toBeDisabled();
    });
  });

  describe("Error handling", () => {
    it("keeps modal open when there is an error in deletion", async () => {
      vi.mocked(window.confirm).mockReturnValue(true);
      mockDeleteTask.mockRejectedValue(new Error("Erro ao deletar"));

      render(
        <TaskList
          tasks={[mockTasks[0]]}
          onRefresh={mockOnRefresh}
          onEditTask={mockOnEditTask}
        />
      );

      const deleteButton = screen.getByTitle("Deletar tarefa");
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteTask).toHaveBeenCalledWith("1");
      });

      // onRefresh não deve ser chamado em caso de erro
      expect(mockOnRefresh).not.toHaveBeenCalled();
    });
  });
});
