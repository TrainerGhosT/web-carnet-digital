import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAreas, deleteArea } from "../../../redux/slices/areaSlice";  // Asegúrate de que 'deleteArea' esté exportada
import type { RootState, AppDispatch } from "../../../redux/store";
import type { Area } from "../../../types/area";  // Asegúrate de que 'Area' esté correctamente definido con 'idArea'
import Layout from "../../layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListAreas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { areas, loading, error } = useSelector((state: RootState) => state.areas);

  const [searchId, setSearchId] = useState<string>("");  // El input sigue siendo un string
  const [area, setArea] = useState<Area | null>(null); // Para almacenar el área obtenida por ID
  const [errorSearch, setErrorSearch] = useState<string>("");

  // Variables de estado para la confirmación de eliminación
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null);

  // Cargar áreas al inicio
  useEffect(() => {
    dispatch(getAreas());
  }, [dispatch]);

   // Usamos useNavigate para la redirección
  const navigate = useNavigate();

  // Función para manejar la búsqueda por ID
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorSearch(""); // Limpiar errores previos
    setArea(null); // Limpiar el área mostrada previamente

    const id = parseInt(searchId.trim(), 10);  // Convertir el ID de string a number
    if (isNaN(id) || id <= 0) {
      setErrorSearch("⚠️ Ingrese un ID válido");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3002/area/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data.data;
      setArea({
        idArea: data.idArea,  // Usamos 'idArea' aquí porque parece que el campo correcto es 'idArea'
        nombre: data.nombre,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErrorSearch(`❌ Error: ${err.response?.data?.message || "No se pudo obtener el área"}`);
      } else {
        setErrorSearch("❌ Error inesperado al buscar el área");
      }
    }
  };

  // Función para eliminar un área
  const handleDelete = (area: Area) => {
    setAreaToDelete(area);  // Almacenar el área que se va a eliminar
    setConfirmDelete(true);  // Mostrar la caja de confirmación
  };

  // Funcion para mensaje de confirmar area
  const confirmElimination = async () => {
    if (areaToDelete) {
      try {
        await dispatch(deleteArea(areaToDelete.idArea));  // Llamamos a la acción deleteArea con idArea como number
        setConfirmDelete(false);  // Ocultar la caja de confirmación después de la eliminación
      } catch (error) {
        console.error("Error al eliminar el área:", error);
      }
    }
  };

  const cancelElimination = () => {
    setConfirmDelete(false);  // Cerrar la caja de confirmación sin eliminar
  };

  // Función para redirigir a la página de Crear area
  const handleCreateArea = () => {
    navigate("/area/crear");  // Redirige a la ruta de crear area
  };

  // Función para redirigir a la página de edición de area
  const handleEditArea = (idArea: number) => {
    navigate(`/area/editar/${idArea}`);  // Redirigir a la página de edición con el ID
  };


  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Listado de Áreas de Trabajo
        </h1>

        {/* Búsqueda por ID */}
        <div className="mb-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <input
              type="number"
              placeholder="Buscar por ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="p-2 border border-gray-300 rounded-md mr-2"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-md"
            >
              Buscar
            </button>
          </form>
          {errorSearch && <p className="text-red-500 mt-2">{errorSearch}</p>}
        </div>

        {/* Mostrar el área encontrada por ID */}
        {area && (
          <div className="mt-6 p-4 bg-blue-100 border border-blue-300 shadow rounded">
            <p className="text-left">
              <strong>Identificador del área de trabajo:</strong> {area.idArea}
            </p>
            <p className="text-left">
              <strong>Nombre del área de trabajo:</strong> {area.nombre}
            </p>
          </div>
        )}

        {/* Confirmación de eliminación */}
        {confirmDelete && areaToDelete && (
          <div className="bg-yellow-100 p-4 rounded shadow mb-4">
            <p>¿Estás seguro que deseas eliminar el área <strong>{areaToDelete.nombre}</strong>?</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={confirmElimination}
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

        {/* Áreas registradas */}
        <div className="mt-6 p-6 bg-blue-100 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Áreas Registradas
          </h2>

          {loading && <p className="text-blue-700 font-medium">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <ul className="space-y-2 text-left mt-4">
            {Array.isArray(areas) &&
              areas.map((area: Area) => (
                <li key={area.idArea} className="bg-white p-3 shadow rounded">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">{area.nombre}</p>
                    <div>
                      {/* Eliminar */}
                      <button
                        onClick={() => handleDelete(area)}  // Almacenar el área a eliminar
                        className="mr-2 text-red-500 p-2 rounded-md hover:scale-105 hover:bg-red-600 hover:text-white transition-all duration-200 ease-in-out"
                      >
                        Eliminar
                      </button>
                      {/* Editar */}
                      <button
                        onClick={() => handleEditArea(area.idArea)}  // Redirigir al formulario de edición
                        className="mr-2 text-yellow-500 p-2 rounded-md hover:scale-105 hover:bg-yellow-600 hover:text-white transition-all duration-200 ease-in-out"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>

          {/* Botón para Crear Nueva Área */}
          <div className="mt-6">
            <button
              onClick={handleCreateArea}
              className="p-2 bg-green-500 text-white rounded-md"
            >
              Crear Área
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListAreas;
