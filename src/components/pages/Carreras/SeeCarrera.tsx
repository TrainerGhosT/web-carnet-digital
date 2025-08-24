/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import type { Carrera } from "../../../types/carrera";
import { fetchCarreraById, deleteCarrera as apiDeleteCarrera } from "../../../api/carreraAPI";

const SeeCarrera: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await fetchCarreraById(Number(id));
        setCarrera(data);
      } catch {
        alert("Error al obtener carrera");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("¿Eliminar carrera?")) return;
    try {
      await apiDeleteCarrera(Number(id));
      navigate("/carrera");
    } catch {
      alert("Error al eliminar carrera");
    }
  };

  if (loading) return <Layout><p className="p-6">Cargando...</p></Layout>;
  if (!carrera) return <Layout><p className="p-6">Carrera no encontrada</p></Layout>;

  const { idCarrera, nombre, director , email, telefono } = carrera;
  return (
    <Layout>
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-2xl font-semibold">Detalle Carrera</h2>
        <p className="mb-2"><strong>Id Carrera:</strong> {idCarrera}</p>
        <p className="mb-2"><strong>Nombre:</strong> {nombre}</p>
        <p className="mb-4"><strong>Direccion:</strong> {director}</p>
        <p className="mb-4"><strong>Email:</strong> {email}</p>
        <p className="mb-4"><strong>Telefono:</strong> {telefono}</p>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/carrera/editar/${idCarrera}`)}
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
            onClick={() => navigate("/carrera")}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Volver
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SeeCarrera;
