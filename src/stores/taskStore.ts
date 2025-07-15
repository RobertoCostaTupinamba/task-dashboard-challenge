import { create } from "zustand";
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
  TaskStats,
} from "../types/task";
import { taskService } from "../services/taskService";

interface TaskStore {
  tasks: Task[];
  categories: string[];
  stats: TaskStats | null;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  getTasks: (userId: string) => Promise<void>;
  createTask: (userId: string, data: CreateTaskRequest) => Promise<void>;
  updateTask: (taskId: string, data: UpdateTaskRequest) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getStats: (userId: string) => Promise<void>;
  getCategories: (userId: string) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  categories: [],
  stats: null,
  filters: {},
  isLoading: false,
  error: null,

  getTasks: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const tasks = await taskService.getTasks(userId, get().filters);
      set({
        tasks,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },

  createTask: async (userId: string, data: CreateTaskRequest) => {
    set({ isLoading: true, error: null });

    try {
      const newTask = await taskService.createTask(userId, data);
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },

  updateTask: async (taskId: string, data: UpdateTaskRequest) => {
    set({ isLoading: true, error: null });

    try {
      const updatedTask = await taskService.updateTask(taskId, data);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },

  deleteTask: async (taskId: string) => {
    set({ isLoading: true, error: null });

    try {
      await taskService.deleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },

  getStats: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const stats = await taskService.getTaskStats(userId);
      set({
        stats,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },

  getCategories: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const categories = await taskService.getCategories(userId);
      set({
        categories,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },

  setFilters: (filters: TaskFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  clearError: () => {
    set({ error: null });
  },
}));
