/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Layout from "../../layout/Layout";

import {
  obtenerUsuarioPorId,
  actualizarUsuario,
} from "../../../api/usuarioApi";

import FormUsuario from "./UsuarioForm";
import type { ActualizarUsuarioData } from "../../../types/IUsuario";
import { ArrowLeft } from "lucide-react";


const EditarUsuarioPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] =
    useState<Partial<ActualizarUsuarioData> | null>(null);

  // Efecto para cargar los datos del usuario a editar.
  useEffect(() => {
    if (!id) {
      navigate("/usuarios");
      return;
    }

    const cargarUsuario = async (idUsuario: string) => {
      setLoading(true);
      try {
        const response = await obtenerUsuarioPorId(idUsuario);
        const usuario = response.data;

        // Prepara los datos iniciales para el formulario.
        setInitialData({
          correo: usuario.correo,
          tipoIdentificacion: usuario.tipoIdentificacion,
          identificacion: usuario.identificacion,
          nombreCompleto: usuario.nombreCompleto,
          tipoUsuario: usuario.tipoUsuario,
          carreras: usuario.carreras?.map((c: any) => c.carrera) || [],
          areas: usuario.areas?.map((a: any) => a.area) || [],
          telefonos: usuario.telefonos || [],
        });
      } catch  {
       console.error("Error al cargar usuario:");
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario(id);
  }, [id, navigate]);

  /**
   * Maneja la actualización del usuario.
   * @param data - Los datos actuales del formulario.
   */
  const handleUpdateUser = async (data: ActualizarUsuarioData) => {
    if (!id) return;
    setLoading(true);
    try {
      
      // Se construye un payload con el tipo 'ActualizarUsuarioData' que tiene campos opcionales.
      const payload: ActualizarUsuarioData = {
        correo: data.correo,
        tipoIdentificacion: data.tipoIdentificacion,
        identificacion: data.identificacion,
        nombreCompleto: data.nombreCompleto,
        tipoUsuario: data.tipoUsuario,
        carreras: data.carreras,
        areas: data.areas,
        telefonos: data.telefonos,
      };
      console.log('payload 1:', payload);

      // Solo se incluye la contraseña en el payload si el usuario ha escrito una nueva.
      if (data.contrasena && data.contrasena.trim() !== "") {
        payload.contrasena = data.contrasena;
      }

      const response = await actualizarUsuario(id, {
        correo: payload.correo as string || "",
        tipoIdentificacion: payload.tipoIdentificacion as number,
        identificacion: payload.identificacion as string || "",
        nombreCompleto: payload.nombreCompleto as string || "",
        contrasena: payload.contrasena as string || "",
        tipoUsuario: payload.tipoUsuario as number || 0,
        carreras: payload.carreras,
        areas: payload.areas,
        telefonos: payload.telefonos as Array<{ numero: string }>,
      });
      console.log('payload 2:', payload);
      console.log('response actu user:', response);
      Swal.fire("¡Éxito!", "Usuario actualizado correctamente", "success");
      navigate("/usuarios");
      return response;
    } catch {
      
      return;
    } finally {
      setLoading(false);
    }
  };

  // Muestra un estado de carga mientras se obtienen los datos.
  if (loading && !initialData) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
          </div>
      </Layout>
    );
  }

  // Si no hay datos, no renderiza el formulario.
  if (!initialData) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto mt-10 bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-12 bg-slate-300 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-300 rounded w-3/4"></div>
              <div className="h-4 bg-slate-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-6 space-y-2">
            <svg 
              className="h-12 w-12 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No se encontró la información</h3>
            <p className="text-sm text-gray-500">No se pudo cargar los datos del usuario solicitado.</p>
            <button
              onClick={() => navigate("/usuarios/")}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 gap-2 font-semibold rounded-md focus:outline-none transition duration-300 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeft size={20} />
              <span>Regresar a la página de usuarios</span>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-4 mx-auto max-w-5xl">
        <FormUsuario
          onSubmit={handleUpdateUser}
          isEditMode={true}
          isLoading={loading}
          initialData={initialData}
          title="Editar Usuario"
        />
      </div>
    </Layout>
  );
};

export default EditarUsuarioPage;
