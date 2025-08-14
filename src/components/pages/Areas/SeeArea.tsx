import { useState } from "react";
import axios from "axios";
import type { Area } from "../../../types/area";

const SeeArea = () => {
  const [idInput, setIdInput] = useState<string>("");
  const [area, setArea] = useState<Area | null>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setArea(null);

    const id = parseInt(idInput.trim());
    if (isNaN(id) || id <= 0) {
      setError("⚠️ Ingrese un ID válido (mayor que 0)");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3002/area/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Asegúrate que esté guardado
        },
      });

      // Mapeamos idArea → id para que coincida con la interfaz Area
    const data = response.data.data;
    const parsed: Area = {
    id: data.idArea,
    nombre: data.nombre,
    };

    setArea(parsed);
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            setError(`❌ Error: ${err.response?.data?.message || "No se pudo obtener el área"}`);
        } else {
            setError("❌ Error inesperado al buscar el área");
        }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Buscar area por identificador</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Ingrese el ID del área"
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {area && (
        <div className="mt-6 p-4 bg-white shadow rounded">
          <p><strong>Identificador del área de trabajo:</strong> {area.id}</p>
          <p><strong>Nombre del área de trabajo:</strong> {area.nombre}</p>
        </div>
      )}
    </div>
  );
};

export default SeeArea;
