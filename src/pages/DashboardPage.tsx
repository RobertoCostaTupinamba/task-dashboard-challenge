import React from "react";
import { useAuthStore } from "../stores/authStore";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();

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
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Próximas funcionalidades:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Gerenciamento de tarefas (CRUD)</li>
              <li>• Filtros por status, categoria e prioridade</li>
              <li>• Dashboard analítico com gráficos</li>
              <li>• Busca por texto</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};
