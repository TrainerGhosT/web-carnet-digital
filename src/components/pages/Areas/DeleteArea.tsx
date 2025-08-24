/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAreas, deleteArea } from "../../../redux/slices/areaSlice";  // Asegúrate de que 'deleteArea' esté exportada
import Layout from "../../layout/Layout";
import { deleteArea as apiDeleteArea } from "../../../api/areaAPI";
import type { RootState, AppDispatch } from "../../../redux/store";
import Swal from "sweetalert2";

const DeleteArea: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { areas, loading, error } = useSelector((state: RootState) => state.areas);

  // const [errorSearch, setErrorSearch] = useState<string>("");

  // Cargar áreas al inicio
  useEffect(() => {
    dispatch(getAreas());
  }, [dispatch]);

  // Función para eliminar un área
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar área?")) return;
    try {
      await apiDeleteArea(id);
      await dispatch(deleteArea(id));  // Llamamos a la acción deleteArea con id como number
    } catch (error) {
      console.error("Error al eliminar el área:", error);
      Swal.fire('Error', 'No se pudo eliminar la área', 'error');
    }
  };

  return (
    <Layout>
      <div className="p-6 text-center bg-white rounded-lg shadow">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Eliminar Áreas de Trabajo
        </h1>

        <div className="p-6 mt-6 bg-blue-100 border border-blue-100 rounded-lg">
          {loading && <p className="font-medium text-blue-700">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <ul className="mt-4 space-y-2 text-left">
            {Array.isArray(areas) && areas.length > 0 ? (
              areas.map((area) => {
                const idVal = (area as any).id ?? (area as any).idArea;
                const nombre = (area as any).nombre ?? (area as any).name ?? "-";
                return (
                  <li key={String(idVal)} className="p-3 bg-white rounded shadow">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-700">{nombre}</p>
                      <div>
                        <button
                          onClick={() => handleDelete(Number(idVal))}
                          className="p-2 mr-2 text-red-500 transition-all duration-200 ease-in-out rounded-md hover:scale-105 hover:bg-red-600 hover:text-white"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="text-gray-600">No hay áreas para eliminar.</li>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default DeleteArea;
