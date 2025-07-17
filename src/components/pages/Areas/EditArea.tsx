import { useState } from "react";
import axios from "axios";

const EditArea = () => {
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const buscarArea = async () => {
    setError("");
    setMensaje("");
    setNombre("");
    setCargando(true);

    try {
      const response = await axios.get(`http://localhost:3002/area/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data.data;
      setNombre(data.nombre);
    } catch {
      setError("❌ No se encontró el área con ese ID.");
    } finally {
      setCargando(false);
    }
  };

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

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Modificar Área</h1>

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
          disabled={cargando}
        >
          {cargando ? "Buscando..." : "Buscar Área"}
        </button>
      </div>

      {nombre && (
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
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Guardar Cambios
          </button>
        </form>
      )}

      {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default EditArea;
