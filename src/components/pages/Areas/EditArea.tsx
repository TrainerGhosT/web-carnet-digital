/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import { fetchAreaById, updateArea } from "../../../api/areaAPI";
import Swal from "sweetalert2";

const EditArea: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loadingInit, setLoadingInit] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await fetchAreaById(Number(id));
        setNombre((data as any).nombre ?? "");
        setDescripcion((data as any).descripcion ?? "");
      } catch  {
        Swal.fire('Error', 'No se pudo obtener la área', 'error');
      } finally {
        setLoadingInit(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await updateArea(Number(id), { nombre, descripcion } as any);
      navigate("/area");
    } catch (err: any) {
      alert(err?.message ?? "Error al actualizar área");
    } finally {
      setSaving(false);
    }
  };

  if (loadingInit) return <Layout><p className="p-6">Cargando área...</p></Layout>;

  return (
    <Layout>
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-2xl font-semibold">Editar Área</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="block w-full p-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="block w-full p-2 mt-1 border rounded-md"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/area")}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditArea;
