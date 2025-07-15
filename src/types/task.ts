export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: "Alta" | "Média" | "Baixa";
  status: "Pendente" | "Em Progresso" | "Concluído";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  category: string;
  priority: "Alta" | "Média" | "Baixa";
  status: "Pendente" | "Em Progresso" | "Concluído";
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: "Alta" | "Média" | "Baixa";
  status?: "Pendente" | "Em Progresso" | "Concluído";
}

export interface TaskFilters {
  status?: "Pendente" | "Em Progresso" | "Concluído";
  category?: string;
  priority?: "Alta" | "Média" | "Baixa";
  search?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
}

export const TASK_STATUS = {
  PENDING: "Pendente" as const,
  IN_PROGRESS: "Em Progresso" as const,
  COMPLETED: "Concluído" as const,
};

export const TASK_PRIORITY = {
  HIGH: "Alta" as const,
  MEDIUM: "Média" as const,
  LOW: "Baixa" as const,
};

export const TASK_STATUS_OPTIONS = [
  { value: TASK_STATUS.PENDING, label: "Pendente" },
  { value: TASK_STATUS.IN_PROGRESS, label: "Em Progresso" },
  { value: TASK_STATUS.COMPLETED, label: "Concluído" },
];

export const TASK_PRIORITY_OPTIONS = [
  { value: TASK_PRIORITY.HIGH, label: "Alta" },
  { value: TASK_PRIORITY.MEDIUM, label: "Média" },
  { value: TASK_PRIORITY.LOW, label: "Baixa" },
];
