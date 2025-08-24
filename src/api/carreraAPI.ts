import api from "./axios";
import type { Carrera } from "../types/carrera";

const API_URL = import.meta.env.VITE_API_AUTH_URL;

// Función para obtener todas las carreras
export const fetchCarreras = async (): Promise<Carrera[]> => {
  const response = await api.get(`${API_URL}/carrera`);
  return response.data.data ?? response.data;
};

// Función para obtener una carrera por su ID
export const fetchCarreraById = async (id: number): Promise<Carrera> => {
  const response = await api.get(`${API_URL}/carrera/${id}`);
  return response.data.data ?? response.data;
};

// Función para crear una nueva carrera
export const createCarrera = async (carrera: Omit<Carrera, "id">) => {
  const response = await api.post(`${API_URL}/carrera`, carrera);
  return response.data;
};

// Función para actualizar una carrera existente
export const updateCarrera = async (id: number, carrera: Omit<Carrera, "id">) => {
  const response = await api.put(`${API_URL}/carrera/${id}`, carrera);
  return response.data;
};

// Función para eliminar una carrera
export const deleteCarrera = async (id: number) => {
  const response = await api.delete(`${API_URL}/carrera/${id}`);
  return response.data;
};
