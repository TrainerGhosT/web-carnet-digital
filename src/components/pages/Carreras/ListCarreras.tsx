import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCarreras, deleteCarrera } from "../../../redux/slices/carreraSlice";  
import { useNavigate } from "react-router-dom";  // Importamos useNavigate
import type { RootState, AppDispatch } from "../../../redux/store";
import type { Carrera } from "../../../types/carrera";  
import Layout from "../../layout/Layout";
import axios from "axios";

const ListCarreras = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { carreras, loading, error } = useSelector((state: RootState) => state.carreras);
  const navigate = useNavigate();  // Inicializamos el hook para la navegación

  const [searchId, setSearchId] = useState<string>(""); 
  const [errorSearch, setErrorSearch] = useState<string>("");

  // Estado para la carrera encontrada
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [mensaje, setMensaje] = useState<string>("");

  // Variables para la confirmación de eliminación
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [carreraToDelete, setCarreraToDelete] = useState<Carrera | null>(null);

  // Cargar carreras al inicio
  useEffect(() => {
    dispatch(getCarreras());
  }, [dispatch]);

  // Función para manejar la búsqueda por ID
  const handleSearch = async () => {
    setErrorSearch(""); 
    const id = parseInt(searchId.trim(), 10);  
    if (isNaN(id) || id <= 0) {
      setErrorSearch("⚠️ Ingrese un ID válido (mayor que 0)");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3002/carrera/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;  
      setCarrera({
        idCarrera: data.idCarrera,  
        nombre: data.nombre,
        director: data.director,
        email: data.email,
        telefono: data.telefono,
      });
    } catch {
      setErrorSearch("❌ Carrera no encontrada.");
    }
  };



  // Función para eliminar una carrera 
  const handleDelete = async () => {
    if (carreraToDelete) {
      console.log("Eliminando carrera con ID:", carreraToDelete.idCarrera);  // Verifica el ID
      try {
        // Eliminamos la carrera del backend
        await axios.delete(`http://localhost:3002/carrera/${carreraToDelete.idCarrera}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Actualizamos el estado global en Redux, eliminando la carrera
        dispatch(deleteCarrera(carreraToDelete.idCarrera));

        // Actualizamos el mensaje
        setMensaje("✅ Carrera eliminada correctamente.");

        // Eliminamos la carrera de la lista local (sin necesidad de buscar nuevamente)
        setCarrera(null);
        setSearchId("");  // Limpiamos el ID de búsqueda
        setConfirmDelete(false); // Cerramos el modal de confirmación

      } catch (error) {
        console.error("Error al eliminar la carrera:", error);
        setMensaje("❌ Error al eliminar la carrera.");
      }
    }
  };

  // Función para mostrar el modal de confirmación
  const confirmElimination = (carrera: Carrera) => {
    setCarreraToDelete(carrera);
    setConfirmDelete(true);
  };

  // Función para cancelar la eliminación
  const cancelElimination = () => {
    setConfirmDelete(false);
  };

  // Función para redirigir a la página de edición
  const handleEditCarrera = (idCarrera: number) => {  
    console.log("ID a editar:", idCarrera);  // Asegúrate de que el ID sea el correcto
    if (idCarrera) {
      navigate(`/carrera/editar/${idCarrera}`);  // Redirige a la página de edición de la carrera
    } else {
      console.log("ID no válido");
    }
  };

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Listado de Carreras
        </h1>

        {/* Confirmación de eliminación */}
        {confirmDelete && carreraToDelete && (
          <div className="bg-yellow-100 p-4 rounded shadow mb-4">
            <p>¿Estás seguro que deseas eliminar la carrera <strong>{carreraToDelete.nombre}</strong>?</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleDelete}  // Ejecuta la eliminación cuando el usuario confirma
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sí, eliminar
              </button>
              <button
                onClick={cancelElimination}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Búsqueda por ID */}
        <div className="mb-4">
          <input
            type="number"  
            placeholder="Buscar por ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="p-2 border rounded-md mr-2"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            Buscar
          </button>
          {errorSearch && <p className="text-red-500 mt-2">{errorSearch}</p>}
        </div>

        {carrera && (
          <div className="mt-6 p-6 bg-yellow-100 rounded-lg border border-yellow-300">
            <h2 className="text-xl font-semibold text-yellow-800 mb-3">
              Información de la Carrera
            </h2>
            <p><strong>Nombre:</strong> {carrera.nombre}</p>
            <p><strong>Director:</strong> {carrera.director}</p>
            <p><strong>Email:</strong> {carrera.email}</p>
            <p><strong>Teléfono:</strong> {carrera.telefono}</p>
            <button
            >
              Eliminar Carrera
            </button>
          </div>
        )}

        {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
        {loading && <p className="text-blue-700 font-medium">Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="mt-6 p-6 bg-blue-100 rounded-lg border border-blue-300">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Carreras Registradas
          </h2>

          {/* Recorrer las carreras */}
          <ul className="space-y-2 text-left mt-4">
            {Array.isArray(carreras) &&
              carreras.map((carrera: Carrera) => (
                <li key={carrera.idCarrera} className="bg-white p-3 shadow rounded">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">{carrera.nombre}</p>
                    <div>
                      {/* Eliminar */}
                      <button
                        onClick={() => confirmElimination(carrera)}  // Al hacer clic, mostramos el modal de confirmación
                        className="mr-2 text-red-500 p-2 rounded-md hover:scale-105 hover:bg-red-600 hover:text-white transition-all duration-200 ease-in-out"
                      >
                        Eliminar
                      </button>
                      {/* Editar */}
                      <button
                        onClick={() => handleEditCarrera(carrera.idCarrera)}  
                        className="mr-2 text-yellow-500 p-2 rounded-md hover:scale-105 hover:bg-yellow-600 hover:text-white transition-all duration-200 ease-in-out"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* Botón para Crear Nueva Carrera */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/carrera/crear")}
            className="p-2 bg-green-500 text-white rounded-md"
          >
            Crear Carrera
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ListCarreras;
