import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAreas, deleteArea } from "../../../redux/slices/areaSlice";  // Asegúrate de que 'deleteArea' esté exportada
import type { RootState, AppDispatch } from "../../../redux/store";
import type { Area } from "../../../types/area";
import Layout from "../../layout/Layout";

const ListAreas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { areas, loading, error } = useSelector((state: RootState) => state.areas);

  // const [errorSearch, setErrorSearch] = useState<string>("");

  // Cargar áreas al inicio
  useEffect(() => {
    dispatch(getAreas());
  }, [dispatch]);

  // Función para eliminar un área
  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteArea(id));  // Llamamos a la acción deleteArea con id como number
    } catch (error) {
      console.error("Error al eliminar el área:", error);
    }
  };

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Listado de Áreas de Trabajo
        </h1>

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
                        onClick={() => handleDelete(area.idArea)}  // El ID ahora es un number y se pasa correctamente
                        className="mr-2 text-red-500 p-2 rounded-md hover:scale-105 hover:bg-red-600 hover:text-white transition-all duration-200 ease-in-out"
                      >
                        Eliminar
                      </button>
                      {/* Editar */}
                      <button
                        onClick={() => console.log("Editar", area.idArea)}
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
              onClick={() => console.log("Crear nueva área")}
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
