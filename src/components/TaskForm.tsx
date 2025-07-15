import React, { useState, useEffect } from "react";
import { useTaskStore } from "../stores/taskStore";
import { useAuthStore } from "../stores/authStore";
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from "../types/task";
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "../types/task";

interface TaskFormProps {
  task?: Task | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onCancel,
  onSuccess,
}) => {
  const {
    createTask,
    updateTask,
    categories,
    getCategories,
    isLoading,
    error,
    clearError,
  } = useTaskStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Média" as "Alta" | "Média" | "Baixa",
    status: "Pendente" as "Pendente" | "Em Progresso" | "Concluído",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  useEffect(() => {
    if (user) {
      getCategories(user.id.toString());
    }
  }, [user, getCategories]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: task.status,
      });
    } else {
      // Reset form when no task is selected (creating new task)
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "Média",
        status: "Pendente",
      });
    }
  }, [task]);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    const categoryValue = showCustomCategory
      ? customCategory
      : formData.category;
    if (!categoryValue.trim()) {
      newErrors.category = "Categoria é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    const categoryValue = showCustomCategory
      ? customCategory
      : formData.category;
    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: categoryValue.trim(),
      priority: formData.priority,
      status: formData.status,
    };

    try {
      if (task) {
        await updateTask(task.id, taskData as UpdateTaskRequest);
      } else {
        await createTask(user.id.toString(), taskData as CreateTaskRequest);
      }
      onSuccess();
    } catch {
      // Erro será tratado pelo store
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpar erro do campo quando usuário digita
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setShowCustomCategory(true);
      setCustomCategory("");
    } else {
      setShowCustomCategory(false);
      setFormData((prev) => ({ ...prev, category: value }));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {task ? "Editar Tarefa" : "Nova Tarefa"}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Título *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Digite o título da tarefa"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Digite a descrição da tarefa"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Categoria */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoria *
              </label>
              {!showCustomCategory ? (
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="custom">+ Nova categoria</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Digite a nova categoria"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomCategory(false)}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              )}
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Prioridade */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Prioridade
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TASK_PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TASK_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Salvando..." : task ? "Atualizar" : "Criar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
