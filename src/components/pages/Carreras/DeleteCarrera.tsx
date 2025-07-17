import { useState } from "react";
import axios from "axios";

const DeleteCarrera = () => {
  const [id, setId] = useState("");
  const [carrera, setCarrera] = useState<null | {
    nombre: string;
    director: string;
    email: string;
    telefono: string;
  }>(null);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const buscarCarrera = async () => {
    setMensaje("");
    setError("");
    setCarrera(null);

    if (!id.trim()) {
      setError("⚠️ Ingrese un ID válido.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3002/carrera/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data.data;
      setCarrera({
        nombre: data.nombre,
        director: data.director,
        email: data.email,
        telefono: data.telefono,
      });
    } catch {
      setError("❌ Carrera no encontrada.");
    }
  };

  const eliminarCarrera = async () => {
    try {
      await axios.delete(`http://localhost:3002/carrera/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMensaje("✅ Carrera eliminada correctamente.");
      setCarrera(null);
      setId("");
    } catch {
      setError("❌ Error al eliminar la carrera.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Eliminar Carrera</h1>

      <div className="mb-4">
        <label className="block mb-1">ID de la carrera:</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={buscarCarrera}
        >
          Buscar
        </button>
      </div>

      {carrera && (
        <div className="bg-white p-4 shadow rounded space-y-2 mb-4">
          <p><strong>Nombre:</strong> {carrera.nombre}</p>
          <p><strong>Director:</strong> {carrera.director}</p>
          <p><strong>Email:</strong> {carrera.email}</p>
          <p><strong>Teléfono:</strong> {carrera.telefono}</p>

          <button
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={eliminarCarrera}
          >
            Eliminar Carrera
          </button>
        </div>
      )}

      {mensaje && <p className="text-green-600">{mensaje}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default DeleteCarrera;
