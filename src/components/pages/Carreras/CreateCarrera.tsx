import { useState } from "react";
import axios from "axios";

const CreateCarrera = () => {
  const [nombre, setNombre] = useState("");
  const [director, setDirector] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

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

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Crear Nueva Carrera</h1>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full border p-2 rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Director"
          className="w-full border p-2 rounded"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teléfono"
          className="w-full border p-2 rounded"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <button
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          onClick={handleSubmit}
        >
          Crear
        </button>
      </div>

      {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CreateCarrera;
