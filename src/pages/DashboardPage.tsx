import React, { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { TasksPage } from "./TasksPage";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [currentView, setCurrentView] = useState<"dashboard" | "tasks">(
    "dashboard"
  );

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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Bem-vindo ao Sistema de Gerenciamento de Tarefas!
          </h2>
          <p className="text-gray-600 mb-4">
            Você está logado como:{" "}
            <span className="font-medium">{user?.email}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                ✅ Funcionalidades Implementadas:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Sistema de autenticação completo</li>
                <li>• Gerenciamento de tarefas (CRUD)</li>
                <li>• Filtros por status, categoria e prioridade</li>
                <li>• Busca por texto</li>
                <li>• Interface responsiva</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                🚀 Acesso Rápido:
              </h3>
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
      </main>
    </div>
  );
};
