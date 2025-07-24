import { useState } from "react";
import axios from "axios";

const CreateArea = () => {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

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

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Crear nueva área de trabajo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre del área"
          className="w-full border border-gray-300 p-2 rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Crear Área
        </button>
      </form>

      {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CreateArea;
