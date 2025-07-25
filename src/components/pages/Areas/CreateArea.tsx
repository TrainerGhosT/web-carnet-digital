import { useState } from "react";
import axios from "axios";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate para la redirección

const CreateArea = () => {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Inicializamos el hook para la navegación

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (nombre.trim() === "") {
      setError("⚠️ El nombre del área no puede estar vacío ni contener solo espacios.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3002/area",
        { nombre: nombre.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMensaje("✅ Área creada exitosamente.");
      setNombre("");
    } catch {
      setError("❌ Error al crear el área. Verifica que no exista o que estés autenticado.");
    }
  };

  // Función para navegar hacia la página anterior
  const handleGoBack = () => {
    navigate(-1);  // Regresa a la página anterior
  };

  return (
    <Layout>
      {/* Cuadro blanco con sombra */}
      <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Crear Nueva Área de Trabajo</h1>

        {/* Cuadro azul para el formulario */}
        <div className="mt-6 p-6 bg-blue-100 rounded-lg border border-blue-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de nombre */}
            <input
              type="text"
              placeholder="Nombre del área"
              className="w-full border p-2 rounded-md"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            {/* Botón de crear área */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Crear Área
            </button>
          </form>

          {/* Mensajes de error o éxito */}
          {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {/* Botón "Atrás" */}
        <div className="mt-6">
          <button
            onClick={handleGoBack}  // Llama a la función handleGoBack para regresar
            className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Atrás
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CreateArea;
