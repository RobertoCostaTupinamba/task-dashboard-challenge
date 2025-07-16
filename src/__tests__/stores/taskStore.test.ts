import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useTaskStore } from "../../stores/taskStore";
import { taskService } from "../../services/taskService";
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
  TaskStats,
} from "../../types/task";

// Mock do taskService
vi.mock("../../services/taskService", () => ({
  taskService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    getTaskStats: vi.fn(),
    getCategories: vi.fn(),
  },
}));

describe("taskStore", () => {
  const mockTask1: Task = {
    id: "1",
    userId: "user1",
    title: "Tarefa de Teste 1",
    description: "Descrição da tarefa 1",
    category: "Trabalho",
    priority: "Alta",
    status: "Pendente",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  };

  const mockTask2: Task = {
    id: "2",
    userId: "user1",
    title: "Tarefa de Teste 2",
    description: "Descrição da tarefa 2",
    category: "Pessoal",
    priority: "Média",
    status: "Em Progresso",
    createdAt: "2024-01-02T10:00:00Z",
    updatedAt: "2024-01-02T10:00:00Z",
  };

  const mockTasks: Task[] = [mockTask1, mockTask2];

  const mockCreateTaskRequest: CreateTaskRequest = {
    title: "Nova Tarefa",
    description: "Descrição da nova tarefa",
    category: "Estudos",
    priority: "Baixa",
    status: "Pendente",
  };

  const mockUpdateTaskRequest: UpdateTaskRequest = {
    title: "Tarefa Atualizada",
    status: "Concluído",
  };

  const mockTaskStats: TaskStats = {
    total: 5,
    completed: 2,
    pending: 2,
    inProgress: 1,
    byStatus: {
      Pendente: 2,
      "Em Progresso": 1,
      Concluído: 2,
    },
    byCategory: {
      Trabalho: 3,
      Pessoal: 1,
      Estudos: 1,
    },
  };

  const mockCategories = ["Trabalho", "Pessoal", "Estudos", "Outros"];

  const mockFilters: TaskFilters = {
    status: "Pendente",
    category: "Trabalho",
    priority: "Alta",
    search: "teste",
  };

  beforeEach(() => {
    // Reset do store para estado inicial
    useTaskStore.setState({
      tasks: [],
      categories: [],
      stats: null,
      filters: {},
      isLoading: false,
      error: null,
    });

    // Limpar todos os mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useTaskStore.getState();

      expect(state.tasks).toEqual([]);
      expect(state.categories).toEqual([]);
      expect(state.stats).toBeNull();
      expect(state.filters).toEqual({});
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("getTasks", () => {
    it("should get tasks successfully", async () => {
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.getTasks.mockResolvedValue(mockTasks);

      const { getTasks } = useTaskStore.getState();

      // Verificar estado durante loading
      const getTasksPromise = getTasks("user1");
      expect(useTaskStore.getState().isLoading).toBe(true);
      expect(useTaskStore.getState().error).toBeNull();

      await getTasksPromise;

      // Verificar estado final
      const finalState = useTaskStore.getState();
      expect(finalState.tasks).toEqual(mockTasks);
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBeNull();

      // Verificar se serviço foi chamado
      expect(mockedTaskService.getTasks).toHaveBeenCalledWith("user1", {});
    });

    it("should get tasks with filters", async () => {
      useTaskStore.setState({ filters: mockFilters });

      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.getTasks.mockResolvedValue([mockTask1]);

      const { getTasks } = useTaskStore.getState();
      await getTasks("user1");

      expect(mockedTaskService.getTasks).toHaveBeenCalledWith(
        "user1",
        mockFilters
      );
    });

    it("should handle getTasks error", async () => {
      const errorMessage = "Erro ao buscar tarefas";
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.getTasks.mockRejectedValue(new Error(errorMessage));

      const { getTasks } = useTaskStore.getState();
      await getTasks("user1");

      const finalState = useTaskStore.getState();
      expect(finalState.tasks).toEqual([]);
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBe(errorMessage);
    });

    it("should handle unknown getTasks error", async () => {
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.getTasks.mockRejectedValue("String error");

      const { getTasks } = useTaskStore.getState();
      await getTasks("user1");

      const finalState = useTaskStore.getState();
      expect(finalState.error).toBe("Erro desconhecido");
    });
  });

  describe("createTask", () => {
    it("should create task successfully", async () => {
      const newTask: Task = { ...mockTask1, id: "3" };
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.createTask.mockResolvedValue(newTask);

      // Configurar estado inicial com tarefas existentes
      useTaskStore.setState({ tasks: mockTasks });

      const { createTask } = useTaskStore.getState();

      // Verificar estado durante loading
      const createTaskPromise = createTask("user1", mockCreateTaskRequest);
      expect(useTaskStore.getState().isLoading).toBe(true);
      expect(useTaskStore.getState().error).toBeNull();

      await createTaskPromise;

      // Verificar estado final
      const finalState = useTaskStore.getState();
      expect(finalState.tasks).toEqual([...mockTasks, newTask]);
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBeNull();

      // Verificar se serviço foi chamado
      expect(mockedTaskService.createTask).toHaveBeenCalledWith(
        "user1",
        mockCreateTaskRequest
      );
    });

    it("should handle createTask error", async () => {
      const errorMessage = "Erro ao criar tarefa";
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.createTask.mockRejectedValue(new Error(errorMessage));

      const { createTask } = useTaskStore.getState();
      await createTask("user1", mockCreateTaskRequest);

      const finalState = useTaskStore.getState();
      expect(finalState.tasks).toEqual([]);
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBe(errorMessage);
    });
  });

  describe("updateTask", () => {
    it("should update task successfully", async () => {
      const updatedTask: Task = { ...mockTask1, ...mockUpdateTaskRequest };
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.updateTask.mockResolvedValue(updatedTask);

      // Configurar estado inicial com tarefas
      useTaskStore.setState({ tasks: mockTasks });

      const { updateTask } = useTaskStore.getState();

      // Verificar estado durante loading
      const updateTaskPromise = updateTask("1", mockUpdateTaskRequest);
      expect(useTaskStore.getState().isLoading).toBe(true);
      expect(useTaskStore.getState().error).toBeNull();

      await updateTaskPromise;

      // Verificar estado final
      const finalState = useTaskStore.getState();
      expect(finalState.tasks[0]).toEqual(updatedTask);
      expect(finalState.tasks[1]).toEqual(mockTask2); // Não alterada
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBeNull();

      // Verificar se serviço foi chamado
      expect(mockedTaskService.updateTask).toHaveBeenCalledWith(
        "1",
        mockUpdateTaskRequest
      );
    });

    it("should handle updateTask error", async () => {
      const errorMessage = "Erro ao atualizar tarefa";
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.updateTask.mockRejectedValue(new Error(errorMessage));

      useTaskStore.setState({ tasks: mockTasks });

      const { updateTask } = useTaskStore.getState();
      await updateTask("1", mockUpdateTaskRequest);

      const finalState = useTaskStore.getState();
      expect(finalState.tasks).toEqual(mockTasks); // Sem alteração
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBe(errorMessage);
    });
  });

  describe("deleteTask", () => {
    it("should delete task successfully", async () => {
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.deleteTask.mockResolvedValue(undefined);

      // Configurar estado inicial com tarefas
      useTaskStore.setState({ tasks: mockTasks });

      const { deleteTask } = useTaskStore.getState();

      // Verificar estado durante loading
      const deleteTaskPromise = deleteTask("1");
      expect(useTaskStore.getState().isLoading).toBe(true);
      expect(useTaskStore.getState().error).toBeNull();

      await deleteTaskPromise;

      // Verificar estado final
      const finalState = useTaskStore.getState();
      expect(finalState.tasks).toEqual([mockTask2]); // Apenas tarefa 2
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBeNull();

      // Verificar se serviço foi chamado
      expect(mockedTaskService.deleteTask).toHaveBeenCalledWith("1");
    });

    it("should handle deleteTask error", async () => {
      const errorMessage = "Erro ao deletar tarefa";
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.deleteTask.mockRejectedValue(new Error(errorMessage));

      useTaskStore.setState({ tasks: mockTasks });

      const { deleteTask } = useTaskStore.getState();
      await deleteTask("1");

      const finalState = useTaskStore.getState();
      expect(finalState.tasks).toEqual(mockTasks); // Sem alteração
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBe(errorMessage);
    });
  });

  describe("getStats", () => {
    it("should get stats successfully", async () => {
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.getTaskStats.mockResolvedValue(mockTaskStats);

      const { getStats } = useTaskStore.getState();

      // Verificar estado durante loading
      const getStatsPromise = getStats("user1");
      expect(useTaskStore.getState().isLoading).toBe(true);
      expect(useTaskStore.getState().error).toBeNull();

      await getStatsPromise;

      // Verificar estado final
      const finalState = useTaskStore.getState();
      expect(finalState.stats).toEqual(mockTaskStats);
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBeNull();

      // Verificar se serviço foi chamado
      expect(mockedTaskService.getTaskStats).toHaveBeenCalledWith("user1");
    });

    it("should handle getStats error", async () => {
      const errorMessage = "Erro ao buscar estatísticas";
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.getTaskStats.mockRejectedValue(new Error(errorMessage));

      const { getStats } = useTaskStore.getState();
      await getStats("user1");

      const finalState = useTaskStore.getState();
      expect(finalState.stats).toBeNull();
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBe(errorMessage);
    });
  });

  describe("getCategories", () => {
    it("should get categories successfully", async () => {
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.getCategories.mockResolvedValue(mockCategories);

      const { getCategories } = useTaskStore.getState();

      // Verificar estado durante loading
      const getCategoriesPromise = getCategories("user1");
      expect(useTaskStore.getState().isLoading).toBe(true);
      expect(useTaskStore.getState().error).toBeNull();

      await getCategoriesPromise;

      // Verificar estado final
      const finalState = useTaskStore.getState();
      expect(finalState.categories).toEqual(mockCategories);
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBeNull();

      // Verificar se serviço foi chamado
      expect(mockedTaskService.getCategories).toHaveBeenCalledWith("user1");
    });

    it("should handle getCategories error", async () => {
      const errorMessage = "Erro ao buscar categorias";
      const mockedTaskService = vi.mocked(taskService);
      mockedTaskService.getCategories.mockRejectedValue(
        new Error(errorMessage)
      );

      const { getCategories } = useTaskStore.getState();
      await getCategories("user1");

      const finalState = useTaskStore.getState();
      expect(finalState.categories).toEqual([]);
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBe(errorMessage);
    });
  });

  describe("setFilters", () => {
    it("should set filters correctly", () => {
      const { setFilters } = useTaskStore.getState();
      setFilters(mockFilters);

      const finalState = useTaskStore.getState();
      expect(finalState.filters).toEqual(mockFilters);
    });

    it("should update existing filters", () => {
      useTaskStore.setState({ filters: { status: "Pendente" } });

      const newFilters: TaskFilters = {
        category: "Trabalho",
        priority: "Alta",
      };
      const { setFilters } = useTaskStore.getState();
      setFilters(newFilters);

      const finalState = useTaskStore.getState();
      expect(finalState.filters).toEqual(newFilters);
    });
  });

  describe("clearFilters", () => {
    it("should clear filters", () => {
      useTaskStore.setState({ filters: mockFilters });

      const { clearFilters } = useTaskStore.getState();
      clearFilters();

      const finalState = useTaskStore.getState();
      expect(finalState.filters).toEqual({});
    });
  });

  describe("clearError", () => {
    it("should clear error", () => {
      useTaskStore.setState({ error: "Algum erro" });

      const { clearError } = useTaskStore.getState();
      clearError();

      const finalState = useTaskStore.getState();
      expect(finalState.error).toBeNull();
    });

    it("should not affect other state properties", () => {
      useTaskStore.setState({
        tasks: mockTasks,
        categories: mockCategories,
        stats: mockTaskStats,
        filters: mockFilters,
        isLoading: true,
        error: "Algum erro",
      });

      const { clearError } = useTaskStore.getState();
      clearError();

      const finalState = useTaskStore.getState();
      expect(finalState.tasks).toEqual(mockTasks);
      expect(finalState.categories).toEqual(mockCategories);
      expect(finalState.stats).toEqual(mockTaskStats);
      expect(finalState.filters).toEqual(mockFilters);
      expect(finalState.isLoading).toBe(true);
      expect(finalState.error).toBeNull();
    });
  });

  describe("Store Methods", () => {
    it("should have all required methods", () => {
      const state = useTaskStore.getState();

      expect(typeof state.getTasks).toBe("function");
      expect(typeof state.createTask).toBe("function");
      expect(typeof state.updateTask).toBe("function");
      expect(typeof state.deleteTask).toBe("function");
      expect(typeof state.getStats).toBe("function");
      expect(typeof state.getCategories).toBe("function");
      expect(typeof state.setFilters).toBe("function");
      expect(typeof state.clearFilters).toBe("function");
      expect(typeof state.clearError).toBe("function");
    });
  });

  describe("Complex State Transitions", () => {
    it("should handle multiple operations correctly", async () => {
      const mockedTaskService = vi.mocked(taskService);

      // 1. Get tasks inicial
      mockedTaskService.getTasks.mockResolvedValue(mockTasks);
      const {
        getTasks,
        createTask,
        updateTask,
        deleteTask,
        setFilters,
        clearError,
      } = useTaskStore.getState();

      await getTasks("user1");
      expect(useTaskStore.getState().tasks).toEqual(mockTasks);

      // 2. Aplicar filtros
      setFilters(mockFilters);
      expect(useTaskStore.getState().filters).toEqual(mockFilters);

      // 3. Criar nova tarefa
      const newTask: Task = { ...mockTask1, id: "3" };
      mockedTaskService.createTask.mockResolvedValue(newTask);
      await createTask("user1", mockCreateTaskRequest);
      expect(useTaskStore.getState().tasks).toContain(newTask);

      // 4. Atualizar tarefa
      const updatedTask: Task = { ...mockTask1, title: "Tarefa Atualizada" };
      mockedTaskService.updateTask.mockResolvedValue(updatedTask);
      await updateTask("1", { title: "Tarefa Atualizada" });
      expect(useTaskStore.getState().tasks[0].title).toBe("Tarefa Atualizada");

      // 5. Simular erro e limpar
      mockedTaskService.deleteTask.mockRejectedValue(
        new Error("Erro de exclusão")
      );
      await deleteTask("1");
      expect(useTaskStore.getState().error).toBe("Erro de exclusão");

      clearError();
      expect(useTaskStore.getState().error).toBeNull();
    });
  });

  describe("State Consistency", () => {
    it("should maintain state consistency during operations", async () => {
      const mockedTaskService = vi.mocked(taskService);

      // Estado inicial
      expect(useTaskStore.getState().isLoading).toBe(false);

      // Durante operações assíncronas
      mockedTaskService.getTasks.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockTasks), 100);
          })
      );

      const { getTasks } = useTaskStore.getState();
      const promise = getTasks("user1");

      // Verificar loading state
      expect(useTaskStore.getState().isLoading).toBe(true);
      expect(useTaskStore.getState().error).toBeNull();

      await promise;

      // Verificar estado final
      expect(useTaskStore.getState().isLoading).toBe(false);
      expect(useTaskStore.getState().tasks).toEqual(mockTasks);
    });
  });
});
