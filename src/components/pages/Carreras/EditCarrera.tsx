import { useState } from "react";
import axios from "axios";

const EditCarrera = () => {
  const [id, setId] = useState("");
  const [carrera, setCarrera] = useState({
    nombre: "",
    director: "",
    email: "",
    telefono: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const buscarCarrera = async () => {
    setMensaje("");
    setError("");

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
      setError("❌ No se encontró la carrera con ese ID.");
    }
  };

  const validar = () => {
    const { nombre, director, email, telefono } = carrera;

    if (!nombre.trim() || !director.trim() || !email.trim() || !telefono.trim()) {
      setError("⚠️ Todos los campos son requeridos.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("⚠️ Formato de email inválido.");
      return false;
    }

    const telefonoRegex = /^[0-9]+$/;
    if (!telefonoRegex.test(telefono)) {
      setError("⚠️ El teléfono debe contener solo números.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setMensaje("");
    setError("");

    if (!validar()) return;

    try {
      await axios.put(
        `http://localhost:3002/carrera/${id}`,
        carrera,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMensaje("✅ Carrera actualizada correctamente.");
    } catch {
      setError("❌ Error al actualizar la carrera.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Editar Carrera</h1>

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

      {carrera.nombre && (
        <div className="space-y-3 mt-4">
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Nombre"
            value={carrera.nombre}
            onChange={(e) => setCarrera({ ...carrera, nombre: e.target.value })}
          />
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Director"
            value={carrera.director}
            onChange={(e) => setCarrera({ ...carrera, director: e.target.value })}
          />
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={carrera.email}
            onChange={(e) => setCarrera({ ...carrera, email: e.target.value })}
          />
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Teléfono"
            value={carrera.telefono}
            onChange={(e) => setCarrera({ ...carrera, telefono: e.target.value })}
          />

          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            Actualizar
          </button>
        </div>
      )}

      {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default EditCarrera;
