import React, { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useTaskStore } from "../stores/taskStore";
import { TasksPage } from "./TasksPage";
import { TaskStatsCards } from "../components/TaskStatsCards";
import { TaskStatusChart } from "../components/TaskStatusChart";
import { TaskCategoryChart } from "../components/TaskCategoryChart";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { stats, getStats, isLoading, error } = useTaskStore();
  const [currentView, setCurrentView] = useState<"dashboard" | "tasks">(
    "dashboard"
  );

  useEffect(() => {
    if (user) {
      getStats(user.id.toString());
    }
  }, [user, getStats]);

  if (currentView === "tasks") {
    return <TasksPage onNavigateBack={() => setCurrentView("dashboard")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Olá, <span className="font-medium">{user?.name}</span>
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              Carregando estatísticas...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <svg
                className="w-5 h-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao carregar estatísticas
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && !isLoading && <TaskStatsCards stats={stats} />}

        {/* Charts Section */}
        {stats && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Status Distribution Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribuição por Status
              </h3>
              <TaskStatusChart data={stats.byStatus} />
            </div>

            {/* Category Distribution Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribuição por Categoria
              </h3>
              <TaskCategoryChart data={stats.byCategory} />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Acesso Rápido
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                ✅ Funcionalidades Implementadas:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Sistema de autenticação completo</li>
                <li>• Gerenciamento de tarefas (CRUD)</li>
                <li>• Filtros por status, categoria e prioridade</li>
                <li>• Busca por texto</li>
                <li>• Dashboard com gráficos analíticos</li>
                <li>• Interface responsiva</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                🚀 Gerenciar Tarefas:
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-green-700">
                  Acesse a página de gerenciamento para criar, editar e
                  organizar suas tarefas.
                </p>
                <button
                  onClick={() => setCurrentView("tasks")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Gerenciar Tarefas
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {stats && stats.total === 0 && !isLoading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-gray-500 mb-6">
              Comece criando sua primeira tarefa para ver as estatísticas aqui.
            </p>
            <button
              onClick={() => setCurrentView("tasks")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Criar Primeira Tarefa
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
