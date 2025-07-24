import axios from "axios";
import type { Carrera } from "../types/carrera";

const API_URL = import.meta.env.VITE_API_CATALOG_URL || "http://localhost:3002";

export const fetchCarreras = async (): Promise<Carrera[]> => {
  const response = await axios.get(`${API_URL}/carrera`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data.data; // suponiendo formato como { success, data: [...] }
};
