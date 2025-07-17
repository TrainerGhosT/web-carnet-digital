// src/components/pages/Areas/ListAreas.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAreas } from '../../../redux/slices/areaSlice'; 
import type { RootState, AppDispatch } from '../../../redux/store';
import type { Area } from '../../../types/area'; 

const ListAreas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { areas, loading, error } = useSelector((state: RootState) => state.areas);

  useEffect(() => {
    console.log("🚀 Disparando getAreas()");
    dispatch(getAreas());
  }, [dispatch]);


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Listado de las áreas de trabajo</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {Array.isArray(areas) ? (
          areas.map((area: Area) => (
            <li key={area.id} className="bg-white p-2 shadow rounded">
              {area.nombre}
            </li>
          ))
        ) : (
          <p className="text-red-500">⚠️ Error: áreas no es un arreglo</p>
        )}
      </ul>
    </div>
  );
};

export default ListAreas;
