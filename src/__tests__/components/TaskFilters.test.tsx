import React from "react";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskFilters } from "../../components/TaskFilters";
import type { TaskFilters as TaskFiltersType } from "../../types/task";

// Mock do store
vi.mock("../../stores/taskStore", () => ({
  useTaskStore: vi.fn(),
}));

// Importar os mocks após declarar
import { useTaskStore } from "../../stores/taskStore";

describe("TaskFilters", () => {
  const mockOnFiltersChange = vi.fn();
  const mockSetFilters = vi.fn();
  const mockClearFilters = vi.fn();
  const mockUseTaskStore = vi.mocked(useTaskStore);

  const mockCategories = ["trabalho", "pessoal", "estudo"];
  const defaultFilters: TaskFiltersType = {};

  beforeEach(() => {
    mockUseTaskStore.mockReturnValue({
      filters: defaultFilters,
      setFilters: mockSetFilters,
      clearFilters: mockClearFilters,
      tasks: [],
      categories: [],
      stats: null,
      isLoading: false,
      error: null,
      getTasks: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      getStats: vi.fn(),
      getCategories: vi.fn(),
      clearError: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render all filter elements", () => {
      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      // Campo de busca
      expect(screen.getByLabelText("Buscar tarefas")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Digite título ou descrição...")
      ).toBeInTheDocument();

      // Filtros
      expect(screen.getByLabelText("Status")).toBeInTheDocument();
      expect(screen.getByLabelText("Categoria")).toBeInTheDocument();
      expect(screen.getByLabelText("Prioridade")).toBeInTheDocument();
    });

    it("should render status options correctly", () => {
      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const statusSelect = screen.getByLabelText("Status");
      expect(statusSelect).toBeInTheDocument();

      // Opção padrão
      expect(screen.getByDisplayValue("Todos")).toBeInTheDocument();
    });

    it("should render provided categories", () => {
      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const categorySelect = screen.getByLabelText("Categoria");
      fireEvent.click(categorySelect);

      mockCategories.forEach((category) => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });

    it("should render priority options correctly", () => {
      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const prioritySelect = screen.getByLabelText("Prioridade");
      expect(prioritySelect).toBeInTheDocument();

      // Verificar se o select de prioridade tem valor vazio por padrão
      expect(prioritySelect).toHaveValue("");
    });

    it("should not render clear filters button when no active filters", () => {
      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      expect(screen.queryByText("Limpar")).not.toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("should update search field and call appropriate functions", async () => {
      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const searchInput = screen.getByLabelText("Buscar tarefas");

      fireEvent.change(searchInput, { target: { value: "test search" } });

      await waitFor(() => {
        expect(mockSetFilters).toHaveBeenCalledWith({
          search: "test search",
        });
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          search: "test search",
        });
      });
    });

    it("should clear search when value is empty", async () => {
      // Começar com um valor de busca inicial
      mockUseTaskStore.mockReturnValue({
        filters: { search: "texto inicial" },
        setFilters: mockSetFilters,
        clearFilters: mockClearFilters,
        tasks: [],
        categories: [],
        stats: null,
        isLoading: false,
        error: null,
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        getCategories: vi.fn(),
        clearError: vi.fn(),
      });

      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const searchInput = screen.getByLabelText("Buscar tarefas");

      fireEvent.change(searchInput, { target: { value: "" } });

      await waitFor(() => {
        expect(mockSetFilters).toHaveBeenCalledWith({
          search: undefined,
        });
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          search: undefined,
        });
      });
    });
  });

  describe("Filters", () => {
    it("should update status filter", async () => {
      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const statusSelect = screen.getByLabelText("Status");

      fireEvent.change(statusSelect, { target: { value: "Pendente" } });

      await waitFor(() => {
        expect(mockSetFilters).toHaveBeenCalledWith({
          status: "Pendente",
        });
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          status: "Pendente",
        });
      });
    });

    it("should update category filter", async () => {
      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const categorySelect = screen.getByLabelText("Categoria");

      fireEvent.change(categorySelect, { target: { value: "trabalho" } });

      await waitFor(() => {
        expect(mockSetFilters).toHaveBeenCalledWith({
          category: "trabalho",
        });
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          category: "trabalho",
        });
      });
    });

    it("should update priority filter", async () => {
      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const prioritySelect = screen.getByLabelText("Prioridade");

      fireEvent.change(prioritySelect, { target: { value: "Alta" } });

      await waitFor(() => {
        expect(mockSetFilters).toHaveBeenCalledWith({
          priority: "Alta",
        });
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          priority: "Alta",
        });
      });
    });

    it("should clear filter when empty value is selected", async () => {
      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const statusSelect = screen.getByLabelText("Status");

      fireEvent.change(statusSelect, { target: { value: "" } });

      await waitFor(() => {
        expect(mockSetFilters).toHaveBeenCalledWith({
          status: undefined,
        });
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          status: undefined,
        });
      });
    });
  });

  describe("Filter Clearing", () => {
    it("should render clear button when there are active filters", () => {
      mockUseTaskStore.mockReturnValue({
        filters: { search: "test", status: "Pendente" },
        setFilters: mockSetFilters,
        clearFilters: mockClearFilters,
        tasks: [],
        categories: [],
        stats: null,
        isLoading: false,
        error: null,
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        getCategories: vi.fn(),
        clearError: vi.fn(),
      });

      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      expect(screen.getByText("Limpar")).toBeInTheDocument();
    });

    it("should clear all filters when button is clicked", async () => {
      mockUseTaskStore.mockReturnValue({
        filters: { search: "test", status: "Pendente" },
        setFilters: mockSetFilters,
        clearFilters: mockClearFilters,
        tasks: [],
        categories: [],
        stats: null,
        isLoading: false,
        error: null,
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        getCategories: vi.fn(),
        clearError: vi.fn(),
      });

      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const clearButton = screen.getByText("Limpar");
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(mockClearFilters).toHaveBeenCalled();
        expect(mockOnFiltersChange).toHaveBeenCalledWith({});
      });
    });
  });

  describe("Active Filter Indicators", () => {
    it("should not render indicators when no filters are active", () => {
      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      expect(screen.queryByText(/Busca:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Status:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Categoria:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Prioridade:/)).not.toBeInTheDocument();
    });

    it("should render active search indicator", () => {
      mockUseTaskStore.mockReturnValue({
        filters: { search: "test search" },
        setFilters: mockSetFilters,
        clearFilters: mockClearFilters,
        tasks: [],
        categories: [],
        stats: null,
        isLoading: false,
        error: null,
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        getCategories: vi.fn(),
        clearError: vi.fn(),
      });

      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      expect(screen.getByText('Busca: "test search"')).toBeInTheDocument();
    });

    it("should render active status indicator", () => {
      mockUseTaskStore.mockReturnValue({
        filters: { status: "Pendente" },
        setFilters: mockSetFilters,
        clearFilters: mockClearFilters,
        tasks: [],
        categories: [],
        stats: null,
        isLoading: false,
        error: null,
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        getCategories: vi.fn(),
        clearError: vi.fn(),
      });

      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      expect(screen.getByText("Status: Pendente")).toBeInTheDocument();
    });

    it("should render active category indicator", () => {
      mockUseTaskStore.mockReturnValue({
        filters: { category: "trabalho" },
        setFilters: mockSetFilters,
        clearFilters: mockClearFilters,
        tasks: [],
        categories: [],
        stats: null,
        isLoading: false,
        error: null,
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        getCategories: vi.fn(),
        clearError: vi.fn(),
      });

      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      expect(screen.getByText("Categoria: trabalho")).toBeInTheDocument();
    });

    it("should render active priority indicator", () => {
      mockUseTaskStore.mockReturnValue({
        filters: { priority: "Alta" },
        setFilters: mockSetFilters,
        clearFilters: mockClearFilters,
        tasks: [],
        categories: [],
        stats: null,
        isLoading: false,
        error: null,
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        getCategories: vi.fn(),
        clearError: vi.fn(),
      });

      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      expect(screen.getByText("Prioridade: Alta")).toBeInTheDocument();
    });

    it("should render multiple indicators simultaneously", () => {
      mockUseTaskStore.mockReturnValue({
        filters: {
          search: "test",
          status: "Pendente",
          category: "trabalho",
          priority: "Alta",
        },
        setFilters: mockSetFilters,
        clearFilters: mockClearFilters,
        tasks: [],
        categories: [],
        stats: null,
        isLoading: false,
        error: null,
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        getCategories: vi.fn(),
        clearError: vi.fn(),
      });

      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      expect(screen.getByText('Busca: "test"')).toBeInTheDocument();
      expect(screen.getByText("Status: Pendente")).toBeInTheDocument();
      expect(screen.getByText("Categoria: trabalho")).toBeInTheDocument();
      expect(screen.getByText("Prioridade: Alta")).toBeInTheDocument();
    });
  });

  describe("Store Synchronization", () => {
    it("should synchronize search field with store filters", () => {
      mockUseTaskStore.mockReturnValue({
        filters: { search: "initial search" },
        setFilters: mockSetFilters,
        clearFilters: mockClearFilters,
        tasks: [],
        categories: [],
        stats: null,
        isLoading: false,
        error: null,
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        getCategories: vi.fn(),
        clearError: vi.fn(),
      });

      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const searchInput = screen.getByLabelText("Buscar tarefas");
      expect(searchInput).toHaveValue("initial search");
    });

    it("should synchronize selects with store filters", () => {
      mockUseTaskStore.mockReturnValue({
        filters: {
          status: "Em Progresso",
          category: "pessoal",
          priority: "Baixa",
        },
        setFilters: mockSetFilters,
        clearFilters: mockClearFilters,
        tasks: [],
        categories: [],
        stats: null,
        isLoading: false,
        error: null,
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        getCategories: vi.fn(),
        clearError: vi.fn(),
      });

      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      expect(screen.getByDisplayValue("Em Progresso")).toBeInTheDocument();
      expect(screen.getByDisplayValue("pessoal")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Baixa")).toBeInTheDocument();
    });
  });

  describe("Complex Interactions", () => {
    it("should maintain other filters when changing a specific one", async () => {
      mockUseTaskStore.mockReturnValue({
        filters: { search: "test", status: "Pendente" },
        setFilters: mockSetFilters,
        clearFilters: mockClearFilters,
        tasks: [],
        categories: [],
        stats: null,
        isLoading: false,
        error: null,
        getTasks: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
        getStats: vi.fn(),
        getCategories: vi.fn(),
        clearError: vi.fn(),
      });

      render(
        <TaskFilters
          categories={mockCategories}
          onFiltersChange={mockOnFiltersChange}
        />
      );

      const categorySelect = screen.getByLabelText("Categoria");
      fireEvent.change(categorySelect, { target: { value: "trabalho" } });

      await waitFor(() => {
        expect(mockSetFilters).toHaveBeenCalledWith({
          search: "test",
          status: "Pendente",
          category: "trabalho",
        });
      });
    });
  });
});
