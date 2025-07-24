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

// Pantallas de Áreas y Carreras
import ListAreas      from "./components/pages/Areas/ListAreas";
import SeeArea        from "./components/pages/Areas/SeeArea";
import CreateArea     from "./components/pages/Areas/CreateArea";
import EditArea       from "./components/pages/Areas/EditArea";
import DeleteArea     from "./components/pages/Areas/DeleteArea";

import ListCarreras   from "./components/pages/Carreras/ListCarreras";
import SeeCarrera     from "./components/pages/Carreras/SeeCarrera";
import CreateCarrera  from "./components/pages/Carreras/CreateCarrera";
import EditCarrera    from "./components/pages/Carreras/EditCarrera";
import DeleteCarrera  from "./components/pages/Carreras/DeleteCarrera";

// // Componente para proteger rutas privadas
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated } = useSelector((state: RootState) => state.login);
//   const location = useLocation();

//   if (isAuthenticated) return <>{children}</>;

//   // Solo enviar mensaje si NO estoy ya en /login
//   if (location.pathname !== "/login") {
//     return (
//       <Navigate
//         to="/login"
//         replace
//         state={{
//           from: location.pathname,
//           message: "Por favor inicie sesión para utilizar el sistema",
//         }}
//       />
//     );
//   }

//   return <Navigate to="/login" replace />;
// };

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
            // <ProtectedRoute>
              <Bienvenida />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/CambiarEstado"
          element={
            // <ProtectedRoute>
              <CambiarEstado />
            // </ProtectedRoute>
          }
        />

        {/* Rutas para Áreas de Trabajo */}
        <Route path="/areas-trabajo"           element={<ListAreas />} />
        <Route path="/areas-trabajo/crear"     element={<CreateArea />} />
        <Route path="/areas-trabajo/editar"    element={<EditArea />} />
        <Route path="/areas-trabajo/eliminar"  element={<DeleteArea />} />
        <Route path="/areas-trabajo/:id"       element={<SeeArea />} />

        {/* Rutas para Carreras */}
        <Route path="/carreras"           element={<ListCarreras />} />
        <Route path="/carreras/crear"     element={<CreateCarrera />} />
        <Route path="/carreras/editar"    element={<EditCarrera />} />
        <Route path="/carreras/eliminar"  element={<DeleteCarrera />} />
        <Route path="/carreras/:id"       element={<SeeCarrera />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
