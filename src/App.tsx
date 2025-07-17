// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";

// Componentes
import Bienvenida from "./components/pages/Bienvenida";
import CambiarEstado from "./components/pages/CambiarEstado";
import Login from "./components/pages/Login";

// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.login);
  const location = useLocation();

  if (isAuthenticated) return <>{children}</>;

  // Solo enviar mensaje si NO estoy ya en /login
  if (location.pathname !== "/login") {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: "Por favor inicie sesión para utilizar el sistema",
        }}
      />
    );
  }

  return <Navigate to="/login" replace />;
};

/*
Comentar los <ProtectedRoute> para desactivar la protección de rutas.
Luego volverlas a activar cuando se implementen las funcionalidades para que funcione normal la denegación de acceso a las rutas.

*/

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Bienvenida />
            </ProtectedRoute>
          }
        />

        <Route
          path="/CambiarEstado"
          element={
            <ProtectedRoute>
              <CambiarEstado />
            </ProtectedRoute>
          }
        />


        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
