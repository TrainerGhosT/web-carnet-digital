import axios from "axios";
import type { Carrera } from "../types/carrera";

const API_URL = import.meta.env.VITE_API_CATALOG_URL || "http://localhost:3002";

// Función para obtener todas las carreras
export const fetchCarreras = async (): Promise<Carrera[]> => {
  try {
    const response = await axios.get(`${API_URL}/carrera`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data.data;  // Asegúrate de que accedes correctamente a 'data'
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    throw error;  // Re-lanzamos el error para que sea capturado en el thunk
  }
};

// Función para eliminar una carrera
export const deleteCarrera = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/carrera/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;  // Aquí puedes manejar lo que retorna la API si es necesario
  } catch (error) {
    console.error("Error al eliminar la carrera:", error);
    throw error;  // Re-lanzamos el error para que sea capturado en el thunk
  }
};
