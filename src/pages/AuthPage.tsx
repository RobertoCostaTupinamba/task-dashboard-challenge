import React, { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

type AuthMode = "login" | "register";

export const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const switchToLogin = () => setAuthMode("login");
  const switchToRegister = () => setAuthMode("register");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistema de Gerenciamento de Tarefas
          </h1>
          <p className="text-gray-600">
            Organize suas tarefas de forma eficiente
          </p>
        </div>

        {authMode === "login" ? (
          <LoginForm onSwitchToRegister={switchToRegister} />
        ) : (
          <RegisterForm onSwitchToLogin={switchToLogin} />
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Desenvolvido como parte do desafio técnico
          </p>
        </div>
      </div>
    </div>
  );
};
