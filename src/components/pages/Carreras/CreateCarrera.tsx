import { useState } from "react";
import axios from "axios";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate

const CreateCarrera = () => {
  const [nombre, setNombre] = useState("");
  const [director, setDirector] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Inicializamos el hook para la navegación

  const validar = () => {
    if (!nombre.trim() || !director.trim() || !email.trim() || !telefono.trim()) {
      setError("⚠️ Todos los campos son requeridos.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("⚠️ El correo electrónico no tiene un formato válido.");
      return false;
    }

    const telefonoRegex = /^[0-9]+$/;
    if (!telefonoRegex.test(telefono)) {
      setError("⚠️ El teléfono solo debe contener números.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setMensaje("");
    setError("");

    if (!validar()) return;

    try {
      await axios.post(
        "http://localhost:3002/carrera",
        {
          nombre,
          director,
          email,
          telefono,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMensaje("✅ Carrera creada exitosamente.");
      setNombre("");
      setDirector("");
      setEmail("");
      setTelefono("");
    } catch {
      setError("❌ Error al crear la carrera.");
    }
  };

  // Función para manejar la navegación hacia la página anterior
  const handleGoBack = () => {
    navigate(-1); // Regresa a la página anterior en el historial
  };

  return (
    <Layout>
      <div className="mt-6 p-6 bg-blue-100 rounded-lg border border-blue-300 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Crear Nueva Carrera</h1>

        <div className="space-y-3">
          {/* Campo de nombre */}
          <input
            type="text"
            placeholder="Nombre"
            className="w-full border p-2 rounded-md"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          {/* Campo de director */}
          <input
            type="text"
            placeholder="Director"
            className="w-full border p-2 rounded-md"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
          />

          {/* Campo de email */}
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border p-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Campo de teléfono */}
          <input
            type="text"
            placeholder="Teléfono"
            className="w-full border p-2 rounded-md"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          {/* Botón de crear */}
          <button
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            onClick={handleSubmit}
          >
            Crear Carrera
          </button>
        </div>

        {/* Mensajes de error o éxito */}
        {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Botón Atrás */}
        <div className="mt-6">
          <button
            onClick={handleGoBack} // Llama a la función handleGoBack para ir atrás
            className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Atrás
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCarrera;
