import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../layout/Layout";
import { useNavigate ,useParams } from "react-router-dom";  // Usamos useParams para obtener el ID en la URL

const EditCarrera = () => {
  const { id } = useParams();  // Obtenemos el ID desde la URL
  const [carrera, setCarrera] = useState({
    id: "",  // Agregamos 'id' en el estado
    nombre: "",
    director: "",
    email: "",
    telefono: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Inicializamos el hook para la navegación


  // Cargar la carrera al principio
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3002/carrera/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          setCarrera({
            id: data.id,  // Asignamos el id aquí
            nombre: data.nombre,
            director: data.director,
            email: data.email,
            telefono: data.telefono,
          });
        })
        .catch(() => {
          setError("❌ No se encontró la carrera con ese ID.");
        });
    }
  }, [id]);

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
        `http://localhost:3002/carrera/${id}`,  // Usamos el id en la URL
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

  // Función para manejar la navegación hacia la página anterior
  const handleGoBack = () => {
    navigate(-1); // Regresa a la página anterior en el historial
  };

  return (
    <Layout>
      {/* Recuadro blanco con sombra */}
      <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">Editar Carrera</h1>

        {/* Recuadro azul para el formulario */}
        <div className="mt-6 p-6 bg-blue-100 rounded-lg border border-blue-100">
          {carrera.nombre && (
            <div className="space-y-3 mt-4">
              <input
                type="text"
                className="w-full border p-2 rounded"
                placeholder="Nombre"
                value={carrera.nombre}
                onChange={(e) =>
                  setCarrera({ ...carrera, nombre: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full border p-2 rounded"
                placeholder="Director"
                value={carrera.director}
                onChange={(e) =>
                  setCarrera({ ...carrera, director: e.target.value })
                }
              />
              <input
                type="email"
                className="w-full border p-2 rounded"
                placeholder="Email"
                value={carrera.email}
                onChange={(e) =>
                  setCarrera({ ...carrera, email: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full border p-2 rounded"
                placeholder="Teléfono"
                value={carrera.telefono}
                onChange={(e) =>
                  setCarrera({ ...carrera, telefono: e.target.value })
                }
              />

              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleSubmit}
              >
                Actualizar
              </button>

              {/* Botón Atrás */}

              <button
                onClick={handleGoBack} // Llama a la función handleGoBack para ir atrás
                className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Atrás
              </button>


            </div>
          )}

          {/* Mensajes de error o éxito */}
          {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </Layout>
  );
};

export default EditCarrera;
