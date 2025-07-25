import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";  // Usamos useParams para obtener el ID de la URL

const EditArea = () => {
  const { id } = useParams();  // Obtenemos el ID desde la URL
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Inicializamos el hook para la navegación


  // Cargar los datos del área al principio usando el ID desde la URL
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3002/area/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          setNombre(data.nombre);
        })
        .catch(() => {
          setError("❌ No se encontró el área con ese ID.");
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (nombre.trim() === "") {
      setError("⚠️ El nombre no puede estar vacío.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3002/area/${id}`,
        { nombre: nombre.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMensaje("✅ Área modificada correctamente.");
    } catch {
      setError("❌ Error al modificar el área.");
    }
  };

  // Función para manejar la navegación hacia la página anterior
  const handleGoBack = () => {
    navigate(-1); // Regresa a la página anterior en el historial
  };

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Modificar Área</h1>

        {/* Formulario de edición dentro del recuadro azul */}
        <div className="mt-6 p-6 bg-blue-100 rounded-lg border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nuevo nombre del área"
              className="w-full border p-2 rounded"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Guardar Cambios
            </button>

            <button
              onClick={handleGoBack}
              className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"

            >
              Atras
            </button>
          </form>

          {/* Mensajes de error o éxito */}
          {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </Layout>
  );
};

export default EditArea;
