
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import type { Carrera } from "../../../types/carrera";
import { fetchCarreras, deleteCarrera as apiDeleteCarrera } from "../../../api/carreraAPI";

const ListCarreras: React.FC = () => {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCarreras();
      setCarreras(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message ?? "Error al cargar carreras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar carrera?")) return;
    try {
      await apiDeleteCarrera(id);
      await load();
    } catch (err: any) {
      alert(err?.message ?? "Error al eliminar");
    }
  };

  return (
    <Layout>
      <div className="p-6 text-center bg-white rounded-lg shadow">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Carreras</h1>

        <div className="p-6 mt-6 bg-blue-100 border border-blue-100 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-blue-800">Carreras Registradas</h2>
            <button
              onClick={() => navigate("/carrera/crear")}
              className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Crear Carrera
            </button>
          </div>

          {loading && <p className="font-medium text-blue-700">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <ul className="mt-4 space-y-2 text-left">
            {Array.isArray(carreras) && carreras.length > 0 ? (
              carreras.map((c) => {
                const idVal = (c as any).id ?? (c as any).idCarrera;
                const nombre = (c as any).nombre ?? (c as any).name ?? "-";
                return (
                  <li key={String(idVal)} className="p-3 bg-white rounded shadow">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-700">{nombre}</p>
                      <div>
                        <button
                          onClick={() => navigate(`/carrera/${idVal}`)}
                          className="p-2 mr-2 text-blue-500 transition rounded-md hover:bg-blue-100"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => navigate(`/carrera/editar/${idVal}`)}
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
              <li className="text-gray-600">No hay carreras registradas.</li>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ListCarreras;
