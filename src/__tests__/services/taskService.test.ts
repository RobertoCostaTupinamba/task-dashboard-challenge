import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { TaskService, taskService } from "../../services/taskService";
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
} from "../../types/task";

// Mock do axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

// Importar axios depois do mock
import axios from "axios";

describe("TaskService", () => {
  const mockTask1: Task = {
    id: "1",
    userId: "user1",
    title: "Tarefa 1",
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
    title: "Tarefa 2",
    description: "Descrição da tarefa 2",
    category: "Pessoal",
    priority: "Média",
    status: "Em Progresso",
    createdAt: "2024-01-02T10:00:00Z",
    updatedAt: "2024-01-02T10:00:00Z",
  };

  const mockTask3: Task = {
    id: "3",
    userId: "user1",
    title: "Tarefa Concluída",
    description: "Tarefa já finalizada",
    category: "Trabalho",
    priority: "Baixa",
    status: "Concluído",
    createdAt: "2024-01-03T10:00:00Z",
    updatedAt: "2024-01-03T10:00:00Z",
  };

  const mockTasks: Task[] = [mockTask1, mockTask2, mockTask3];

  const mockCreateTaskRequest: CreateTaskRequest = {
    title: "Nova Tarefa",
    description: "Descrição da nova tarefa",
    category: "Estudos",
    priority: "Alta",
    status: "Pendente",
  };

  const mockUpdateTaskRequest: UpdateTaskRequest = {
    title: "Tarefa Atualizada",
    status: "Concluído",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Singleton Pattern", () => {
    it("should return the same instance", () => {
      const instance1 = TaskService.getInstance();
      const instance2 = TaskService.getInstance();

      expect(instance1).toBe(instance2);
    });

    it("should export the singleton instance as taskService", () => {
      const instance = TaskService.getInstance();
      expect(taskService).toBe(instance);
    });
  });

  describe("getTasks", () => {
    it("should get tasks successfully", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockTasks,
      });

      const result = await taskService.getTasks("user1");

      expect(result).toEqual(mockTasks);
      expect(axios.get).toHaveBeenCalledWith("http://localhost:3001/tasks", {
        params: { userId: "user1" },
      });
    });

    it("should get tasks with status filter", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockTasks,
      });

      const filters: TaskFilters = { status: "Pendente" };
      const result = await taskService.getTasks("user1", filters);

      expect(result).toEqual([mockTask1]); // Apenas tarefa pendente
      expect(axios.get).toHaveBeenCalledWith("http://localhost:3001/tasks", {
        params: { userId: "user1" },
      });
    });

    it("should get tasks with category filter", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockTasks,
      });

      const filters: TaskFilters = { category: "Trabalho" };
      const result = await taskService.getTasks("user1", filters);

      expect(result).toEqual([mockTask1, mockTask3]); // Apenas tarefas de trabalho
    });

    it("should get tasks with priority filter", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockTasks,
      });

      const filters: TaskFilters = { priority: "Alta" };
      const result = await taskService.getTasks("user1", filters);

      expect(result).toEqual([mockTask1]); // Apenas tarefa de alta prioridade
    });

    it("should get tasks with search filter", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockTasks,
      });

      const filters: TaskFilters = { search: "Concluída" };
      const result = await taskService.getTasks("user1", filters);

      expect(result).toEqual([mockTask3]); // Apenas tarefa com "Concluída" no título
    });

    it("should get tasks with search filter in description", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockTasks,
      });

      const filters: TaskFilters = { search: "finalizada" };
      const result = await taskService.getTasks("user1", filters);

      expect(result).toEqual([mockTask3]); // Busca na descrição
    });

    it("should get tasks with multiple filters", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockTasks,
      });

      const filters: TaskFilters = {
        category: "Trabalho",
        priority: "Baixa",
        status: "Concluído",
      };
      const result = await taskService.getTasks("user1", filters);

      expect(result).toEqual([mockTask3]); // Tarefa que atende todos os filtros
    });

    it("should return empty array when no tasks match filters", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockTasks,
      });

      const filters: TaskFilters = { status: "Inexistente" as "Pendente" };
      const result = await taskService.getTasks("user1", filters);

      expect(result).toEqual([]);
    });

    it("should handle axios error", async () => {
      const axiosError = new Error("Network error");
      (axios.get as ReturnType<typeof vi.fn>).mockRejectedValue(axiosError);
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(true);

      await expect(taskService.getTasks("user1")).rejects.toThrow(
        "Erro ao buscar tarefas"
      );
    });

    it("should handle non-axios error", async () => {
      const error = new Error("Other error");
      (axios.get as ReturnType<typeof vi.fn>).mockRejectedValue(error);
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(false);

      await expect(taskService.getTasks("user1")).rejects.toThrow(
        "Other error"
      );
    });
  });

  describe("createTask", () => {
    it("should create task successfully", async () => {
      const createdTask: Task = {
        id: "4",
        userId: "user1",
        ...mockCreateTaskRequest,
        createdAt: "2024-01-04T10:00:00Z",
        updatedAt: "2024-01-04T10:00:00Z",
      };

      (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: createdTask,
      });

      // Mock Date para ter timestamps consistentes
      const mockDate = new Date("2024-01-04T10:00:00Z");
      vi.spyOn(globalThis, "Date").mockImplementation(() => mockDate);

      const result = await taskService.createTask(
        "user1",
        mockCreateTaskRequest
      );

      expect(result).toEqual(createdTask);
      expect(axios.post).toHaveBeenCalledWith("http://localhost:3001/tasks", {
        ...mockCreateTaskRequest,
        userId: "user1",
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString(),
      });

      vi.restoreAllMocks();
    });

    it("should handle axios error", async () => {
      const axiosError = new Error("Network error");
      (axios.post as ReturnType<typeof vi.fn>).mockRejectedValue(axiosError);
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(true);

      await expect(
        taskService.createTask("user1", mockCreateTaskRequest)
      ).rejects.toThrow("Erro ao criar tarefa");
    });

    it("should handle non-axios error", async () => {
      const error = new Error("Other error");
      (axios.post as ReturnType<typeof vi.fn>).mockRejectedValue(error);
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(false);

      await expect(
        taskService.createTask("user1", mockCreateTaskRequest)
      ).rejects.toThrow("Other error");
    });
  });

  describe("updateTask", () => {
    it("should update task successfully", async () => {
      const updatedTask: Task = {
        ...mockTask1,
        ...mockUpdateTaskRequest,
        updatedAt: "2024-01-04T10:00:00Z",
      };

      (axios.patch as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: updatedTask,
      });

      // Mock Date para ter timestamps consistentes
      const mockDate = new Date("2024-01-04T10:00:00Z");
      vi.spyOn(globalThis, "Date").mockImplementation(() => mockDate);

      const result = await taskService.updateTask("1", mockUpdateTaskRequest);

      expect(result).toEqual(updatedTask);
      expect(axios.patch).toHaveBeenCalledWith(
        "http://localhost:3001/tasks/1",
        {
          ...mockUpdateTaskRequest,
          updatedAt: mockDate.toISOString(),
        }
      );

      vi.restoreAllMocks();
    });

    it("should handle axios error", async () => {
      const axiosError = new Error("Network error");
      (axios.patch as ReturnType<typeof vi.fn>).mockRejectedValue(axiosError);
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(true);

      await expect(
        taskService.updateTask("1", mockUpdateTaskRequest)
      ).rejects.toThrow("Erro ao atualizar tarefa");
    });

    it("should handle non-axios error", async () => {
      const error = new Error("Other error");
      (axios.patch as ReturnType<typeof vi.fn>).mockRejectedValue(error);
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(false);

      await expect(
        taskService.updateTask("1", mockUpdateTaskRequest)
      ).rejects.toThrow("Other error");
    });
  });

  describe("deleteTask", () => {
    it("should delete task successfully", async () => {
      (axios.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await taskService.deleteTask("1");

      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:3001/tasks/1"
      );
    });

    it("should handle axios error", async () => {
      const axiosError = new Error("Network error");
      (axios.delete as ReturnType<typeof vi.fn>).mockRejectedValue(axiosError);
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(true);

      await expect(taskService.deleteTask("1")).rejects.toThrow(
        "Erro ao deletar tarefa"
      );
    });

    it("should handle non-axios error", async () => {
      const error = new Error("Other error");
      (axios.delete as ReturnType<typeof vi.fn>).mockRejectedValue(error);
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(false);

      await expect(taskService.deleteTask("1")).rejects.toThrow("Other error");
    });
  });

  describe("getTaskStats", () => {
    it("should calculate stats correctly", async () => {
      // Mock getTasks para retornar tasks conhecidas
      const getTasksSpy = vi.spyOn(taskService, "getTasks");
      getTasksSpy.mockResolvedValue(mockTasks);

      const result = await taskService.getTaskStats("user1");

      expect(result).toEqual({
        total: 3,
        completed: 1, // mockTask3
        pending: 1, // mockTask1
        inProgress: 1, // mockTask2
        byStatus: {
          Pendente: 1,
          "Em Progresso": 1,
          Concluído: 1,
        },
        byCategory: {
          Trabalho: 2, // mockTask1 e mockTask3
          Pessoal: 1, // mockTask2
        },
      });

      expect(getTasksSpy).toHaveBeenCalledWith("user1");
      getTasksSpy.mockRestore();
    });

    it("should handle empty tasks list", async () => {
      const getTasksSpy = vi.spyOn(taskService, "getTasks");
      getTasksSpy.mockResolvedValue([]);

      const result = await taskService.getTaskStats("user1");

      expect(result).toEqual({
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0,
        byStatus: {},
        byCategory: {},
      });

      getTasksSpy.mockRestore();
    });

    it("should handle getTasks error", async () => {
      const getTasksSpy = vi.spyOn(taskService, "getTasks");
      const axiosError = new Error("Network error");
      getTasksSpy.mockRejectedValue(axiosError);
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(true);

      await expect(taskService.getTaskStats("user1")).rejects.toThrow(
        "Erro ao buscar estatísticas"
      );

      getTasksSpy.mockRestore();
    });

    it("should handle non-axios error from getTasks", async () => {
      const getTasksSpy = vi.spyOn(taskService, "getTasks");
      const error = new Error("Other error");
      getTasksSpy.mockRejectedValue(error);
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(false);

      await expect(taskService.getTaskStats("user1")).rejects.toThrow(
        "Other error"
      );

      getTasksSpy.mockRestore();
    });
  });

  describe("getCategories", () => {
    it("should get unique categories sorted", async () => {
      const getTasksSpy = vi.spyOn(taskService, "getTasks");
      getTasksSpy.mockResolvedValue(mockTasks);

      const result = await taskService.getCategories("user1");

      expect(result).toEqual(["Pessoal", "Trabalho"]); // Ordenado alfabeticamente
      expect(getTasksSpy).toHaveBeenCalledWith("user1");
      getTasksSpy.mockRestore();
    });

    it("should handle duplicate categories", async () => {
      const tasksWithDuplicates: Task[] = [
        { ...mockTask1, category: "Trabalho" },
        { ...mockTask2, category: "Trabalho" },
        { ...mockTask3, category: "Pessoal" },
      ];

      const getTasksSpy = vi.spyOn(taskService, "getTasks");
      getTasksSpy.mockResolvedValue(tasksWithDuplicates);

      const result = await taskService.getCategories("user1");

      expect(result).toEqual(["Pessoal", "Trabalho"]); // Sem duplicatas
      getTasksSpy.mockRestore();
    });

    it("should handle empty tasks list", async () => {
      const getTasksSpy = vi.spyOn(taskService, "getTasks");
      getTasksSpy.mockResolvedValue([]);

      const result = await taskService.getCategories("user1");

      expect(result).toEqual([]);
      getTasksSpy.mockRestore();
    });

    it("should handle getTasks error", async () => {
      const getTasksSpy = vi.spyOn(taskService, "getTasks");
      const axiosError = new Error("Network error");
      getTasksSpy.mockRejectedValue(axiosError);
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(true);

      await expect(taskService.getCategories("user1")).rejects.toThrow(
        "Erro ao buscar categorias"
      );

      getTasksSpy.mockRestore();
    });

    it("should handle non-axios error from getTasks", async () => {
      const getTasksSpy = vi.spyOn(taskService, "getTasks");
      const error = new Error("Other error");
      getTasksSpy.mockRejectedValue(error);
      (
        axios.isAxiosError as unknown as ReturnType<typeof vi.fn>
      ).mockReturnValue(false);

      await expect(taskService.getCategories("user1")).rejects.toThrow(
        "Other error"
      );

      getTasksSpy.mockRestore();
    });
  });

  describe("API Base URL", () => {
    it("should use correct API base URL", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });

      await taskService.getTasks("user1");

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:3001/tasks",
        expect.any(Object)
      );
    });
  });

  describe("Complex Filtering Scenarios", () => {
    it("should handle case-insensitive search", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockTasks,
      });

      const filters: TaskFilters = { search: "TAREFA" };
      const result = await taskService.getTasks("user1", filters);

      // Todas as tarefas contêm "tarefa" no título
      expect(result).toHaveLength(3);
    });

    it("should return no results when no filters match", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockTasks,
      });

      const filters: TaskFilters = {
        status: "Pendente",
        category: "Inexistente",
      };
      const result = await taskService.getTasks("user1", filters);

      expect(result).toEqual([]);
    });

    it("should handle undefined filters object", async () => {
      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockTasks,
      });

      const result = await taskService.getTasks("user1", undefined);

      expect(result).toEqual(mockTasks); // Sem filtro, retorna todas
    });
  });
});
