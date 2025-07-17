import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCarreras } from "../../../redux/slices/carreraSlice";
import type { RootState, AppDispatch } from "../../../redux/store";
import type { Carrera } from "../../../types/carrera";

const ListCarreras = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { carreras, loading, error } = useSelector((state: RootState) => state.carreras);

  useEffect(() => {
    dispatch(getCarreras());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Listado de Carreras</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {Array.isArray(carreras) &&
          carreras.map((carrera: Carrera) => (
            <li key={carrera.id} className="bg-white p-3 shadow rounded">
              <p><strong></strong> {carrera.nombre}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ListCarreras;
