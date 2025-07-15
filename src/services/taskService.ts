import axios from "axios";
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
  TaskStats,
} from "../types/task";

const API_BASE_URL = "http://localhost:3001";

export class TaskService {
  private static instance: TaskService;

  private constructor() {}

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async getTasks(userId: string, filters?: TaskFilters): Promise<Task[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        params: { userId },
      });

      let tasks: Task[] = response.data;

      // Aplicar filtros
      if (filters) {
        tasks = tasks.filter((task) => {
          if (filters.status && task.status !== filters.status) {
            return false;
          }
          if (filters.category && task.category !== filters.category) {
            return false;
          }
          if (filters.priority && task.priority !== filters.priority) {
            return false;
          }
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
              task.title.toLowerCase().includes(searchLower) ||
              task.description.toLowerCase().includes(searchLower)
            );
          }
          return true;
        });
      }

      return tasks;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Erro ao buscar tarefas");
      }
      throw error;
    }
  }

  async createTask(userId: string, data: CreateTaskRequest): Promise<Task> {
    try {
      const newTask = {
        ...data,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await axios.post(`${API_BASE_URL}/tasks`, newTask);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Erro ao criar tarefa");
      }
      throw error;
    }
  }

  async updateTask(taskId: string, data: UpdateTaskRequest): Promise<Task> {
    try {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      const response = await axios.patch(
        `${API_BASE_URL}/tasks/${taskId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Erro ao atualizar tarefa");
      }
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Erro ao deletar tarefa");
      }
      throw error;
    }
  }

  async getTaskStats(userId: string): Promise<TaskStats> {
    try {
      const tasks = await this.getTasks(userId);

      const stats: TaskStats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.status === "Concluído").length,
        pending: tasks.filter((t) => t.status === "Pendente").length,
        inProgress: tasks.filter((t) => t.status === "Em Progresso").length,
        byStatus: {},
        byCategory: {},
      };

      // Calcular estatísticas por status
      tasks.forEach((task) => {
        stats.byStatus[task.status] = (stats.byStatus[task.status] || 0) + 1;
      });

      // Calcular estatísticas por categoria
      tasks.forEach((task) => {
        stats.byCategory[task.category] =
          (stats.byCategory[task.category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Erro ao buscar estatísticas");
      }
      throw error;
    }
  }

  async getCategories(userId: string): Promise<string[]> {
    try {
      const tasks = await this.getTasks(userId);
      const categories = [...new Set(tasks.map((task) => task.category))];
      return categories.sort();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Erro ao buscar categorias");
      }
      throw error;
    }
  }
}

export const taskService = TaskService.getInstance();
