import { useState } from "react";
import axios from "axios";

const DeleteArea = () => {
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState(""); // para mostrar antes de eliminar
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const buscarArea = async () => {
    setError("");
    setMensaje("");
    setNombre("");

    try {
      const response = await axios.get(`http://localhost:3002/area/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data.data;
      setNombre(data.nombre);
      setMostrarConfirmacion(true);
    } catch {
      setError("❌ Área no encontrada.");
    }
  };

  const eliminarArea = async () => {
    try {
      await axios.delete(`http://localhost:3002/area/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMensaje("✅ Área eliminada correctamente.");
      setNombre("");
      setId("");
      setMostrarConfirmacion(false);
    } catch {
      setError("❌ Error al eliminar el área.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Eliminar Área</h1>

      <div className="space-y-2 mb-6">
        <input
          type="number"
          placeholder="ID del área"
          className="w-full border p-2 rounded"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button
          onClick={buscarArea}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Buscar Área
        </button>
      </div>

      {mostrarConfirmacion && (
        <div className="bg-yellow-100 p-4 rounded shadow mb-4">
          <p>¿Estás seguro que deseas eliminar el área <strong>{nombre}</strong>?</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={eliminarArea}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sí, eliminar
            </button>
            <button
              onClick={() => setMostrarConfirmacion(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default DeleteArea;
