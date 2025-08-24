/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import type { Area } from "../../../types/area";
import { fetchAreas, deleteArea as apiDeleteArea } from "../../../api/areaAPI";

const ListAreas: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAreas();
      setAreas(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message ?? "Error al cargar áreas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar área? Esta acción no se puede deshacer.")) return;
    try {
      await apiDeleteArea(id);
      await loadAreas();
    } catch (err: any) {
      alert(err?.message ?? "Error al eliminar el área");
    }
  };

  return (
    <Layout>
      <div className="p-6 text-center bg-white rounded-lg shadow">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Listado de Áreas de Trabajo
        </h1>

        <div className="p-6 mt-6 bg-blue-100 border border-blue-100 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-blue-800">Áreas Registradas</h2>
            <button
              onClick={() => navigate("/area/crear")}
              className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Crear Área
            </button>
          </div>

          {loading && <p className="font-medium text-blue-700">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <ul className="mt-4 space-y-2 text-left">
            {Array.isArray(areas) && areas.length > 0 ? (
              areas.map((area: Area) => {
                const idVal = (area as any).id ?? (area as any).idArea;
                const nombre = (area as any).nombre ?? (area as any).name ?? "-";
                const descripcion = (area as any).descripcion ?? (area as any).description ?? "-";
                return (
                  <li key={String(idVal)} className="p-3 bg-white rounded shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">{nombre}</p>
                        <p className="text-sm text-gray-500">{descripcion}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => navigate(`/area/${idVal}`)}
                          className="p-2 mr-2 text-blue-500 transition rounded-md hover:bg-blue-100"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => navigate(`/area/editar/${idVal}`)}
                          className="p-2 mr-2 text-yellow-500 transition rounded-md hover:bg-yellow-100"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(Number(idVal))}
                          className="p-2 text-red-500 transition rounded-md hover:bg-red-600 hover:text-white"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="text-gray-600">No hay áreas registradas.</li>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ListAreas;
