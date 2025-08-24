/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import { createArea } from "../../../api/areaAPI";

const CreateArea: React.FC = () => {
  const [nombre, setNombre] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createArea({ nombre } as any);
      navigate("/area");
    } catch (err: any) {
      alert(err?.message ?? "Error al crear área");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-2xl font-semibold">Crear Área</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="block w-full p-2 mt-1 border rounded-md"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {loading ? "Creando..." : "Crear"}
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

export default CreateArea;
