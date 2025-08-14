/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  ShieldQuestion,
  Shield,
  User,
} from "lucide-react";

import {
  cambiarEstadoUsuario,
  obtenerUsuarios,
  obtenerTiposIdentificacion,
  obtenerTiposUsuario,
  obtenerEstados,
} from "../../api/usuarioApi";
import { loginSuccess, logout } from "../../redux/slices/loginSlice";
import Swal from "sweetalert2";
import Layout from "../layout/Layout";
import type { AppDispatch, RootState } from "../../redux/store";
import type {
  Estado,
  TipoIdentificacion,
  TipoUsuario,
  UsuarioData,
} from "../../types/IUsuario";

const CambiarEstado: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>([]);
  const [tiposIdentificacion, setTiposIdentificacion] = useState<
    TipoIdentificacion[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string>("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("");
  const [filtroNombre, setFiltroNombre] = useState<string>("");

  const usuarioLogueado = useSelector(
    (state: RootState) => state.login.Usuario
  );

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        usuariosResponse,
        estadosData,
        tiposUsuarioData,
        tiposIdentificacionData,
      ] = await Promise.all([
        obtenerUsuarios(),
        obtenerEstados(),
        obtenerTiposUsuario(),
        obtenerTiposIdentificacion(),
      ]);
      setUsuarios(
        usuariosResponse.data ? usuariosResponse.data : usuariosResponse
      );
      setEstados(estadosData);
      setTiposUsuario(tiposUsuarioData);
      setTiposIdentificacion(tiposIdentificacionData);
    } catch (err) {
      console.error("Error al cargar datos", err);
      setError(
        "No se pudieron cargar los datos necesarios. Por favor, recargue la página."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!usuarioLogueado) {
      const usuarioLocal = localStorage.getItem("usuario");
      if (usuarioLocal) {
        dispatch(loginSuccess(JSON.parse(usuarioLocal)));
      } else {
        dispatch(logout());
      }
    } else {
      cargarDatos();
    }
  }, [usuarioLogueado]);

  const getEstadoNombre = (estadoId: number): string => {
    const estado = estados.find((e) => e.idEstado === estadoId);
    return estado ? estado.nombre : "Desconocido";
  };

  const getTipoIdentificacionNombre = (tipoId: number): string => {
    const tipo = tiposIdentificacion.find(
      (t) => t.idTipoIdentificacion === tipoId
    );
    return tipo ? tipo.nombre : "No especificado";
  };

  const getTipoUsuarioNombre = (tipoId: number): string => {
    const tipo = tiposUsuario.find((t) => t.idTipoUsuario === tipoId);
    return tipo ? tipo.nombre : "No especificado";
  };

  const getEstadoVisuals = (estadoNombre: string) => {
    const nombreNormalizado = estadoNombre.toLowerCase();
    switch (nombreNormalizado) {
      case "activo":
        return {
          color: "bg-green-100 text-green-800",
          icon: <ShieldCheck size={16} />,
        };
      case "bloqueado":
        return {
          color: "bg-red-100 text-red-800",
          icon: <ShieldX size={16} />,
        };
      case "inactivo":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <ShieldAlert size={16} />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <ShieldQuestion size={16} />,
        };
    }
  };

  const handleConfirmarCambio = async () => {
    if (!usuarioSeleccionado || !estadoSeleccionado) {
      Swal.fire(
        "Campos requeridos",
        "Por favor seleccione un usuario y un estado.",
        "warning"
      );
      return;
    }

    const usuario = usuarios.find((u) => u.idUsuario === usuarioSeleccionado);
    const estado = estados.find(
      (e) => e.idEstado === Number(estadoSeleccionado)
    );

    if (!usuario || !estado) {
      Swal.fire("Error", "Usuario o estado no válido.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "¿Confirmar cambio de estado?",
      html: `
        <div class="text-left p-4 border rounded-lg bg-gray-50">
          <p class="flex items-center gap-2"><strong>Usuario:</strong> ${
            usuario.nombreCompleto
          }</p>
          <p class="flex items-center gap-2 mt-2"><strong>Estado actual:</strong> ${getEstadoNombre(
            usuario.estadoUsuario
          )}</p>
          <p class="flex items-center gap-2 mt-2 font-semibold"><strong>Nuevo estado:</strong> ${
            estado.nombre
          }</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    setLoadingAction(true);
    try {
      await cambiarEstadoUsuario(
        usuarioSeleccionado,
        Number(estadoSeleccionado)
      );

      Swal.fire(
        "¡Éxito!",
        "El estado del usuario se actualizó correctamente.",
        "success"
      );

      setUsuarioSeleccionado("");
      setEstadoSeleccionado("");
      await cargarDatos(); // Recargar todos los datos para consistencia
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire(
        "Error",
        "No se pudo actualizar el estado del usuario.",
        "error"
      );
    } finally {
      setLoadingAction(false);
    }
  };

  const usuariosFiltrados = useMemo(
    () =>
      usuarios.filter((usuario) =>
        usuario.nombreCompleto
          .toLowerCase()
          .includes(filtroNombre.toLowerCase())
      ),
    [usuarios, filtroNombre]
  );

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg text-gray-700 font-semibold">
              Cargando datos...
            </p>
            <p className="text-gray-500">Por favor, espere un momento.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestión de Estados de Usuario
                </h1>
                <p className="text-gray-600 mt-1">
                  Administre los estados de los usuarios del sistema
                </p>
              </div>
            </div>
          </header>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 mb-8">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-bold text-red-800">Error</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-gray-500" />
              Cambiar Estado de un Usuario
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label
                  htmlFor="select-usuario"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Seleccionar Usuario
                </label>
                <select
                  id="select-usuario"
                  value={usuarioSeleccionado}
                  onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loadingAction}
                >
                  <option value=""> Seleccione un usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.idUsuario} value={usuario.idUsuario}>
                      {usuario.nombreCompleto} ({usuario.identificacion})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-estado"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Asignar Nuevo Estado
                </label>
                <select
                  id="select-estado"
                  value={estadoSeleccionado}
                  onChange={(e) => setEstadoSeleccionado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loadingAction}
                >
                  <option value="">Seleccione un estado </option>
                  {estados.map((estado) => (
                    <option key={estado.idEstado} value={estado.idEstado}>
                      {estado.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleConfirmarCambio}
                disabled={
                  loadingAction || !usuarioSeleccionado || !estadoSeleccionado
                }
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
              >
                {loadingAction ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                {loadingAction ? "Procesando..." : "Confirmar Cambio"}
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <Users className="w-6 h-6 text-gray-500" />
                  <span>
                    Lista de Usuarios{" "}
                    <span className="text-blue-600 font-bold">
                      ({usuariosFiltrados.length})
                    </span>
                  </span>
                </h2>

                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-72 transition"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Usuario
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Identificación
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Correo
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Tipo Usuario
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usuario) => {
                    const estadoNombre = getEstadoNombre(usuario.estadoUsuario);
                    const { color, icon } = getEstadoVisuals(estadoNombre);
                    return (
                      <tr
                        key={usuario.idUsuario}
                        className="bg-white border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div>
                              <div>{usuario.nombreCompleto}</div>
                              <div className="text-xs text-gray-500">
                                ID: {usuario.idUsuario}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div>
                              <div>{usuario.identificacion}</div>
                              <div className="text-xs text-gray-500">
                                {getTipoIdentificacionNombre(
                                  usuario.tipoIdentificacion
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{usuario.correo}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            <User className="w-4 h-4" />
                            {getTipoUsuarioNombre(usuario.tipoUsuario)}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${color}`}
                          >
                            {icon}
                            {estadoNombre}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {usuariosFiltrados.length === 0 && (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    No se encontraron usuarios
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {filtroNombre
                      ? "Intente con otro término de búsqueda."
                      : "No hay usuarios para mostrar en este momento."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CambiarEstado;
