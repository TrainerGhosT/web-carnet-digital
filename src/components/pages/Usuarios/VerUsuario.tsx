/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  CreditCard,
  Phone,
  GraduationCap,
  Briefcase,
  Shield,
  CheckCircle,
  XCircle,
  Camera,
  ArrowLeft,
  Edit,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import Layout from "../../layout/Layout";
import {
  obtenerUsuarioPorId,
  obtenerTiposIdentificacion,
  obtenerTiposUsuario,
  obtenerCarreras,
  obtenerAreas,
  obtenerEstados,
  obtenerFotoPerfil,
} from "../../../api/usuarioApi";
import type {
  TipoIdentificacion,
  TipoUsuario,
  Carrera,
  Area,
  Estado,
  UsuarioData,
} from "../../../types/IUsuario";

interface FotoPerfil {
  usuario: string;
  fotoBase64: string;
}

const VerUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Estados para datos
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [fotoPerfil, setFotoPerfil] = useState<FotoPerfil | null>(null);
  const [tiposIdentificacion, setTiposIdentificacion] = useState<
    TipoIdentificacion[]
  >([]);
  const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [loadingPhoto, setLoadingPhoto] = useState(true);

  useEffect(() => {
    if (id) {
      cargarDatos();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID de usuario no válido",
        confirmButtonText: "Aceptar",
      }).then(() => {
        navigate("/usuarios");
      });
    }
  }, [id, navigate]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar datos del usuario y catálogos en paralelo
      const [
        usuarioResponse,
        tiposIdentData,
        tiposUserData,
        carrerasData,
        areasData,
        estadosData,
      ] = await Promise.all([
        obtenerUsuarioPorId(id!),
        obtenerTiposIdentificacion(),
        obtenerTiposUsuario(),
        obtenerCarreras(),
        obtenerAreas(),
        obtenerEstados(),
      ]);

      // Configurar datos del usuario
      setUsuario(usuarioResponse.data);
      setTiposIdentificacion(tiposIdentData);
      setTiposUsuario(tiposUserData);
      setCarreras(carrerasData);
      setAreas(areasData);
      setEstados(estadosData);

      // Intentar cargar foto de perfil
      cargarFotoPerfil();
    } catch (error: any) {
      console.error("Error al cargar datos:", error);

      let errorMessage = "Error al cargar la información del usuario";
      if (error?.response?.status === 404) {
        errorMessage = "Usuario no encontrado";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "Volver a usuarios",
      }).then(() => {
        navigate("/usuarios");
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarFotoPerfil = async () => {
    try {
      setLoadingPhoto(true);
      const fotoResponse = await obtenerFotoPerfil(id!);
      setFotoPerfil(fotoResponse.data);
    } catch {
      // No mostrar error si no tiene foto, es opcional
      console.log("El usuario no tiene foto de perfil");
    } finally {
      setLoadingPhoto(false);
    }
  };

  // Funciones auxiliares para obtener nombres
  const obtenerNombreTipoIdentificacion = (id: number): string => {
    const tipo = tiposIdentificacion.find((t) => t.idTipoIdentificacion === id);
    return tipo?.nombre || "N/A";
  };

  const obtenerNombreTipoUsuario = (id: number): string => {
    const tipo = tiposUsuario.find((t) => t.idTipoUsuario === id);
    return tipo?.nombre || "N/A";
  };

  const obtenerNombreEstado = (id: number): string => {
    const estado = estados.find((e) => e.idEstado === id);
    return estado?.nombre || "N/A";
  };

  const obtenerNombreCarrera = (id: number): string => {
    const carrera = carreras.find((c) => c.idCarrera === id);
    return carrera?.nombre || "N/A";
  };

  const obtenerNombreArea = (id: number): string => {
    const area = areas.find((a) => a.idArea === id);
    return area?.nombre || "N/A";
  };

  const obtenerIconoTipoUsuario = (tipo: number) => {
    switch (tipo) {
      case 1:
        return <GraduationCap className="w-6 h-6" />;
      case 2:
        return <Briefcase className="w-6 h-6" />;
      case 3:
        return <Shield className="w-6 h-6" />;
      default:
        return <User className="w-6 h-6" />;
    }
  };

  const obtenerColorEstado = (estado: number): string => {
    const nombreEstado = obtenerNombreEstado(estado).toLowerCase();
    if (nombreEstado.includes("activo"))
      return "bg-green-100 text-green-800 border-green-200";
    if (nombreEstado.includes("bloqueado"))
      return "bg-red-100 text-red-800 border-red-200";
    if (nombreEstado.includes("inactivo"))
      return "bg-gray-100 text-gray-800 border-gray-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const handleNavigateBack = () => {
    navigate("/usuarios");
  };

  const handleEditProfile = (userId: string) => {
    navigate(`/usuarios/editar/${userId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!usuario) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600">Usuario no encontrado</p>
              <button
                onClick={handleNavigateBack}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver a usuarios
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-r">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleNavigateBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver</span>
            </button>
            <button
              onClick={() => handleEditProfile(usuario.idUsuario)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Edit className="w-4 h-4" />
              <span>Editar Perfil</span>
            </button>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-red-600 h-28"></div>     
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-col items-center md:items-center gap-6 -mt-16 ">
                {/* Profile Photo */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white shadow-xl overflow-hidden border-4 border-white">
                    {loadingPhoto ? (
                      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    ) : fotoPerfil?.fotoBase64 ? (
                      <img
                        src={`data:image/jpeg;base64,${fotoPerfil.fotoBase64}`}
                        alt={usuario.nombreCompleto}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-800 to-red-600 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">
                          {usuario.nombreCompleto
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left mt-2 md:mt-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {usuario.nombreCompleto}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      {obtenerIconoTipoUsuario(usuario.tipoUsuario)}
                      <span className="font-medium">
                        {obtenerNombreTipoUsuario(usuario.tipoUsuario)}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${obtenerColorEstado(
                        usuario.estadoUsuario
                      )}`}
                    >
                      {obtenerNombreEstado(usuario.estadoUsuario)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Información Personal
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Correo Electrónico</p>
                    <p className="text-gray-900 font-medium">
                      {usuario.correo}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Identificación</p>
                    <p className="text-gray-900 font-medium">
                      {obtenerNombreTipoIdentificacion(
                        usuario.tipoIdentificacion
                      )}{" "}
                      - {usuario.identificacion}
                    </p>
                  </div>
                </div>
                {usuario.telefonos && usuario.telefonos.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Teléfonos</p>
                      <div className="space-y-1">
                        {usuario.telefonos.map((tel, index) => (
                          <p key={index} className="text-gray-900 font-medium">
                            {tel.numero}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Academic/Professional Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {usuario.tipoUsuario === 1 ? (
                  <>
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Información Académica
                  </>
                ) : (
                  <>
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Información Profesional
                  </>
                )}
              </h2>
              <div className="space-y-4">
                {/* Mostrar carreras */}
                {usuario.carreras && usuario.carreras.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Carreras</p>
                    <div className="flex flex-wrap gap-2">
                      {usuario.carreras.map((c, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                        >
                          {obtenerNombreCarrera(c.carrera)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mostrar áreas */}
                {usuario.areas && usuario.areas.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Áreas</p>
                    <div className="flex flex-wrap gap-2">
                      {usuario.areas.map((a, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200"
                        >
                          {obtenerNombreArea(a.area)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensaje si no tiene carreras ni áreas */}
                {(!usuario.carreras || usuario.carreras.length === 0) &&
                  (!usuario.areas || usuario.areas.length === 0) && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 italic">
                        No hay información académica o profesional registrada
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Información del Sistema
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">ID de Usuario</p>
                <p className="text-gray-900 font-mono text-xs mt-1">
                  {usuario.idUsuario}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Tipo de Usuario</p>
                <p className="text-gray-900 font-medium mt-1">
                  {obtenerNombreTipoUsuario(usuario.tipoUsuario)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Estado Actual</p>
                <p className="text-gray-900 font-medium mt-1">
                  {obtenerNombreEstado(usuario.estadoUsuario)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerUsuario;
