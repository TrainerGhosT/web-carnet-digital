// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
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
// import DeleteCarrera  from "./components/pages/Carreras/DeleteCarrera";



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
        <Route path="/area"           element={<ListAreas />} />
        <Route path="/area/crear"     element={<CreateArea />} />
        <Route path="/area/editar/:id" element={<EditArea />} />
        <Route path="/area/eliminar"  element={<DeleteArea />} />
        <Route path="/area/:id"       element={<SeeArea />} />

        {/* Rutas para Carreras */}
        <Route path="/carrera"           element={<ListCarreras />} />
        <Route path="/carrera/crear"     element={<CreateCarrera />} />
        <Route path="/carrera/editar/:id" element={<EditCarrera />} />
        {/* <Route path="/carrera/eliminar"  element={<DeleteCarrera />} /> */}
        <Route path="/carrera/:id"       element={<SeeCarrera />} />

        {/* Redirección por defecto
        <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
