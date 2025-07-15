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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders tasks list", () => {
      render(<TaskList tasks={mockTasks} onRefresh={mockOnRefresh} />);

      expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
      expect(screen.getByText("Tarefa 2")).toBeInTheDocument();
      expect(screen.getByText("Tarefa 3")).toBeInTheDocument();
    });

    it("renders message when there are no tasks", () => {
      render(<TaskList tasks={[]} onRefresh={mockOnRefresh} />);

      expect(screen.getByText("Nenhuma tarefa encontrada")).toBeInTheDocument();
      expect(
        screen.getByText("Crie sua primeira tarefa para começar!")
      ).toBeInTheDocument();
    });

    it("renders task information correctly", () => {
      render(<TaskList tasks={[mockTasks[0]]} onRefresh={mockOnRefresh} />);

      expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
      expect(screen.getByText("Descrição da tarefa 1")).toBeInTheDocument();
      expect(screen.getByText("trabalho")).toBeInTheDocument();
      expect(screen.getByText("Alta")).toBeInTheDocument();
      expect(screen.getByText("Pendente")).toBeInTheDocument();
    });

    it("renders correct colors for priority", () => {
      render(<TaskList tasks={mockTasks} onRefresh={mockOnRefresh} />);

      const altaPrioridade = screen.getByText("Alta");
      const mediaPrioridade = screen.getByText("Média");
      const baixaPrioridade = screen.getByText("Baixa");

      expect(altaPrioridade).toHaveClass("text-red-600", "bg-red-100");
      expect(mediaPrioridade).toHaveClass("text-yellow-600", "bg-yellow-100");
      expect(baixaPrioridade).toHaveClass("text-green-600", "bg-green-100");
    });

    it("renders correct colors for status", () => {
      render(<TaskList tasks={mockTasks} onRefresh={mockOnRefresh} />);

      const pendente = screen.getByText("Pendente");
      const emProgresso = screen.getByText("Em Progresso");
      const concluido = screen.getByText("Concluído");

      expect(pendente).toHaveClass("text-gray-600", "bg-gray-100");
      expect(emProgresso).toHaveClass("text-blue-600", "bg-blue-100");
      expect(concluido).toHaveClass("text-green-600", "bg-green-100");
    });

    it("renders action buttons for each task", () => {
      render(<TaskList tasks={[mockTasks[0]]} onRefresh={mockOnRefresh} />);

      const editButtons = screen.getAllByTitle("Editar tarefa");
      const deleteButtons = screen.getAllByTitle("Deletar tarefa");

      expect(editButtons).toHaveLength(1);
      expect(deleteButtons).toHaveLength(1);
    });
  });

  describe("Interactions", () => {
    it("opens edit modal when clicking edit button", () => {
      render(<TaskList tasks={[mockTasks[0]]} onRefresh={mockOnRefresh} />);

      const editButton = screen.getByTitle("Editar tarefa");
      fireEvent.click(editButton);

      expect(screen.getByText("Editar Tarefa")).toBeInTheDocument();
    });

    it("deletes task when confirming in modal", async () => {
      vi.mocked(window.confirm).mockReturnValue(true);

      render(<TaskList tasks={[mockTasks[0]]} onRefresh={mockOnRefresh} />);

      const deleteButton = screen.getByTitle("Deletar tarefa");
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteTask).toHaveBeenCalledWith("1");
        expect(mockOnRefresh).toHaveBeenCalled();
      });
    });

    it("does not delete task when cancelling in modal", () => {
      vi.mocked(window.confirm).mockReturnValue(false);

      render(<TaskList tasks={[mockTasks[0]]} onRefresh={mockOnRefresh} />);

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

      render(<TaskList tasks={[mockTasks[0]]} onRefresh={mockOnRefresh} />);

      const deleteButton = screen.getByTitle("Deletar tarefa");
      expect(deleteButton).toBeDisabled();
    });
  });

  describe("Form modal", () => {
    it("closes modal when clicking cancel", () => {
      render(<TaskList tasks={[mockTasks[0]]} onRefresh={mockOnRefresh} />);

      const editButton = screen.getByTitle("Editar tarefa");
      fireEvent.click(editButton);

      expect(screen.getByText("Editar Tarefa")).toBeInTheDocument();

      const cancelButton = screen.getByText("Cancelar");
      fireEvent.click(cancelButton);

      expect(screen.queryByText("Editar Tarefa")).not.toBeInTheDocument();
    });

    it("closes modal and updates list when saving successfully", async () => {
      const mockUpdateTask = vi.fn().mockResolvedValue({});
      mockUseTaskStore.mockReturnValue({
        deleteTask: mockDeleteTask,
        isLoading: false,
        createTask: vi.fn(),
        updateTask: mockUpdateTask,
        categories: ["trabalho", "pessoal"],
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

      render(<TaskList tasks={[mockTasks[0]]} onRefresh={mockOnRefresh} />);

      const editButton = screen.getByTitle("Editar tarefa");
      fireEvent.click(editButton);

      expect(screen.getByText("Editar Tarefa")).toBeInTheDocument();

      // Preencher campos obrigatórios
      const titleInput = screen.getByDisplayValue("Tarefa 1");
      fireEvent.change(titleInput, { target: { value: "Tarefa Atualizada" } });

      const descriptionInput = screen.getByDisplayValue(
        "Descrição da tarefa 1"
      );
      fireEvent.change(descriptionInput, {
        target: { value: "Descrição atualizada" },
      });

      const categorySelect = screen.getByLabelText(/categoria/i);
      fireEvent.change(categorySelect, { target: { value: "trabalho" } });

      const updateButton = screen.getByText("Atualizar");
      fireEvent.click(updateButton);

      await waitFor(
        () => {
          expect(mockOnRefresh).toHaveBeenCalled();
        },
        { timeout: 2000 }
      );

      await waitFor(
        () => {
          expect(screen.queryByText("Editar Tarefa")).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Error handling", () => {
    it("keeps modal open when there is an error in deletion", async () => {
      vi.mocked(window.confirm).mockReturnValue(true);
      mockDeleteTask.mockRejectedValue(new Error("Erro ao deletar"));

      render(<TaskList tasks={[mockTasks[0]]} onRefresh={mockOnRefresh} />);

      const deleteButton = screen.getByTitle("Deletar tarefa");
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteTask).toHaveBeenCalledWith("1");
        // O erro é tratado pelo store, então não chamamos onRefresh
        expect(mockOnRefresh).not.toHaveBeenCalled();
      });
    });
  });
});
