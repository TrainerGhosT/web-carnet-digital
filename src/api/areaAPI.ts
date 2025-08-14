
import api from './axios';
import type { Area } from '../types/area';

const API_URL = import.meta.env.VITE_API_AUTH_URL;


export const fetchAreas = () =>
  api.get<{ success: boolean; message: string; data: Area[] }>(API_URL);

export const fetchAreaById = async (id: number): Promise<Area> => {
  const response = await api.get(`${API_URL}/area/${id}`);
  return response.data.data;
};


export const createArea = (area: Omit<Area, 'id'>) => api.post(API_URL, area);
export const updateArea = (id: number, area: Omit<Area, 'id'>) => api.put(`${API_URL}/${id}`, area);
export const deleteArea = (id: number) => api.delete(`${API_URL}/${id}`);
