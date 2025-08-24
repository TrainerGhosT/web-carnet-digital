import api from './axios';
import type { Area } from '../types/area';

const API_URL = import.meta.env.VITE_API_AUTH_URL;

// Obtener todas las areas
export const fetchAreas = async (): Promise<Area[]> => {
  const response = await api.get(`${API_URL}/area`);
  // Se asume que la API responde { data: Area[] } o { success, message, data }
  return response.data.data ?? response.data;
};

export const fetchAreaById = async (id: number): Promise<Area> => {
  const response = await api.get(`${API_URL}/area/${id}`);
  return response.data.data ?? response.data;
};

export const createArea = async (area: Omit<Area, 'id'>) => {
  const response = await api.post(`${API_URL}/area`, area);
  return response.data;
};

export const updateArea = async (id: number, area: Omit<Area, 'id'>) => {
  const response = await api.put(`${API_URL}/area/${id}`, area);
  return response.data;
};

export const deleteArea = async (id: number) => {
  const response = await api.delete(`${API_URL}/area/${id}`);
  return response.data;
};
