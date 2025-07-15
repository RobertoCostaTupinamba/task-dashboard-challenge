import React, { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Inicializar estado de autenticação ao carregar a aplicação
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="App">
      {isAuthenticated ? <DashboardPage /> : <AuthPage />}
    </div>
  );
}

export default App;
