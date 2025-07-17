// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  // useLocation,
} from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "./redux/store";

// Componentes
import Bienvenida from "./components/pages/Bienvenida";
import CambiarEstado from "./components/pages/CambiarEstado";
import Login from "./components/pages/Login";
import ListAreas from "./components/pages/Areas/ListAreas"; 
import SeeArea from "./components/pages/Areas/SeeArea";
import CreateArea from "./components/pages/Areas/CreateArea";
import EditArea from "./components/pages/Areas/EditArea";
import DeleteArea from "./components/pages/Areas/DeleteArea";
import ListCarreras from "./components/pages/Carreras/ListCarreras";
import SeeCarrera from "./components/pages/Carreras/SeeCarrera";
import CreateCarrera from "./components/pages/Carreras/CreateCarrera";
import EditCarrera from "./components/pages/Carreras/EditCarrera";
import DeleteCarrera from "./components/pages/Carreras/DeleteCarrera";


// Componente para proteger rutas privadas (DESACTIVADO TEMPORALMENTE)
/*
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.login);
  const location = useLocation();

  if (isAuthenticated) return <>{children}</>;

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
*/

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Areas */}

        {/* Vista para probar Listado de Áreas */}
        <Route path="/area" element={<ListAreas />} />
        {/* Vista para ver un Área por ID */}
        <Route path="/area/:id" element={<SeeArea />} />
        {/* Vista para probar Listado de Áreas */}
        <Route path="/area/crear" element={<CreateArea />} />
        {/* Vista para probar Listado de Áreas */}
        <Route path="/area/editar" element={<EditArea />} />
        {/* Vista para probar Listado de Áreas */}
        <Route path="/area/eliminar" element={<DeleteArea />} />

        {/* Carreras */}

        {/* Vista para probar Listado de Carreras */}
        <Route path="/carrera" element={<ListCarreras />} />
        {/* Vista para ver un Carrera por ID */}
        <Route path="/carrera/:id" element={<SeeCarrera />} />
        {/* Vista para ver una pagina de crear carreras*/}
        <Route path="/carrera/crear" element={<CreateCarrera />} />
        {/* Vista para ver una pagina de editar carreras*/}
        <Route path="/carrera/editar" element={<EditCarrera />} />

        {/* Vista para ver una pagina de eliminar carreras*/}
        <Route path="/carrera/eliminar" element={<DeleteCarrera />} />

        {/* Desactivadas temporalmente las rutas protegidas */}
        <Route path="/dashboard" element={<Bienvenida />} />
        <Route path="/CambiarEstado" element={<CambiarEstado />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

