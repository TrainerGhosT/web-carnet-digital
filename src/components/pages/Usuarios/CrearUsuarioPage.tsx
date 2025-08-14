import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Layout from "../../layout/Layout";

import { crearUsuario } from "../../../api/usuarioApi";
import type {
  ActualizarUsuarioData,
  UsuarioFormData,
} from "../../../types/IUsuario";
import FormUsuario from "./UsuarioForm";

const CrearUsuarioPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /**
   * Maneja el envío del formulario para crear un nuevo usuario.
   * @param data - Los datos del formulario.
   */
  const handleCreateUser = async (data: UsuarioFormData) => {
    setLoading(true);
    try {
      // El payload es exactamente lo que viene del formulario.
      const payload = { ...data };
      if (!payload.carreras) payload.carreras = [];
      if (!payload.areas) payload.areas = [];

      await crearUsuario(payload);
      Swal.fire("¡Éxito!", "Usuario creado correctamente", "success");
      navigate("/usuarios");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      Swal.fire("Error", "No se pudo crear el usuario.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-4 mx-auto max-w-5xl">
        <FormUsuario
          onSubmit={(data: UsuarioFormData | ActualizarUsuarioData) =>
            // Type assertion since we know this component only handles UsuarioFormData
            handleCreateUser(data as UsuarioFormData)
          }
          isEditMode={false}
          isLoading={loading}
          title="Crear Nuevo Usuario"
        />
      </div>
    </Layout>
  );
};

export default CrearUsuarioPage;
