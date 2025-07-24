import { useState } from "react";
import axios from "axios";
import type { Carrera } from "../../../types/carrera";

const SeeCarrera = () => {
  const [id, setId] = useState("");
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const buscarCarrera = async () => {
    setMensaje("");
    setError("");
    setCarrera(null);

    if (!id.trim()) {
      setError("⚠️ Debe ingresar un ID válido.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3002/carrera/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        });

        // Mapear idCarrera → id para que coincida con la interfaz Carrera
        const data = response.data.data;
        const parsed: Carrera = {
        id: data.idCarrera,
        nombre: data.nombre,
        director: data.director,
        email: data.email,
        telefono: data.telefono,
        };

        setCarrera(parsed);
        setMensaje("✅ Carrera encontrada.");

    } catch {
      setError("❌ Carrera no encontrada.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Buscar Carrera por ID</h1>

      <div className="space-y-2 mb-4">
        <input
          type="number"
          placeholder="ID de la carrera"
          className="w-full border p-2 rounded"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button
          onClick={buscarCarrera}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {mensaje && <p className="text-green-600">{mensaje}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {carrera && (
        <div className="mt-6 p-4 bg-white shadow rounded space-y-1">
          <p><strong>Identificador de la carrera:</strong> {carrera.id}</p>
          <p><strong>Nombre de la carrera:</strong> {carrera.nombre}</p>
          <p><strong>Director de la carrera:</strong> {carrera.director}</p>
          <p><strong>Email:</strong> {carrera.email}</p>
          <p><strong>Teléfono:</strong> {carrera.telefono}</p>
        </div>
      )}
    </div>
  );
};

export default SeeCarrera;
