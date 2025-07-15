import React, { useState, useEffect } from "react";
import { useTaskStore } from "../stores/taskStore";
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from "../types/task";
import type { TaskFilters as TaskFiltersType } from "../types/task";

interface TaskFiltersProps {
  categories: string[];
  onFiltersChange: (filters: TaskFiltersType) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  categories,
  onFiltersChange,
}) => {
  const { filters, setFilters, clearFilters } = useTaskStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  useEffect(() => {
    setSearchTerm(filters.search || "");
  }, [filters.search]);

  const handleFilterChange = (
    field: keyof TaskFiltersType,
    value: string | undefined
  ) => {
    const newFilters = { ...filters, [field]: value || undefined };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const newFilters = { ...filters, search: value || undefined };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    clearFilters();
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ""
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Campo de busca */}
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Buscar tarefas
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite título ou descrição..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
          {/* Filtro por Status */}
          <div className="min-w-0 sm:w-40">
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todos</option>
              {TASK_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Categoria */}
          <div className="min-w-0 sm:w-40">
            <label
              htmlFor="category-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoria
            </label>
            <select
              id="category-filter"
              value={filters.category || ""}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Prioridade */}
          <div className="min-w-0 sm:w-40">
            <label
              htmlFor="priority-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Prioridade
            </label>
            <select
              id="priority-filter"
              value={filters.priority || ""}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todas</option>
              {TASK_PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Botão limpar filtros */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
                title="Limpar filtros"
              >
                <svg
                  className="w-4 h-4"
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
                Limpar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Indicadores de filtros ativos */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Busca: "{filters.search}"
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Status: {filters.status}
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Categoria: {filters.category}
            </span>
          )}
          {filters.priority && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Prioridade: {filters.priority}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
