/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import type { Area } from "../../../types/area";
import { fetchAreaById, deleteArea as apiDeleteArea } from "../../../api/areaAPI";

const SeeArea: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [area, setArea] = useState<Area | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await fetchAreaById(Number(id));
        setArea(data);
      } catch {
        alert("Error al obtener área");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("¿Eliminar área?")) return;
    try {
      await apiDeleteArea(Number(id));
      navigate("/area");
    } catch {
      alert("Error al eliminar área");
    }
  };

  if (loading) return <Layout><p className="p-6">Cargando...</p></Layout>;
  if (!area) return <Layout><p className="p-6">Área no encontrada</p></Layout>;

  const nombre = (area as any).nombre ?? (area as any).name ?? "-";
  const descripcion = (area as any).descripcion ?? (area as any).description ?? "-";
  const idVal = (area as any).id ?? (area as any).idArea;

  return (
    <Layout>
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-2xl font-semibold">Detalle Área</h2>
        <p className="mb-2"><strong>ID:</strong> {idVal}</p>
        <p className="mb-2"><strong>Nombre:</strong> {nombre}</p>
        <p className="mb-4"><strong>Descripción:</strong> {descripcion}</p>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/area/editar/${idVal}`)}
            className="px-4 py-2 text-white bg-yellow-500 rounded-md"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-white bg-red-500 rounded-md"
          >
            Eliminar
          </button>
          <button
            onClick={() => navigate("/area")}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Volver
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SeeArea;
