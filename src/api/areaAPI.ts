// pnpm add axios
// pnpm add -D @types/axios
import axios from 'axios';
import type { Area } from '../types/area';

const API_URL = import.meta.env.VITE_API_CATALOG_URL + '/area';


export const fetchAreas = () =>
  axios.get<{ success: boolean; message: string; data: Area[] }>(API_URL);

export const fetchAreaById = async (id: number): Promise<Area> => {
  const response = await axios.get(`${API_URL}/area/${id}`);
  return response.data.data;
};


export const createArea = (area: Omit<Area, 'id'>) => axios.post(API_URL, area);
export const updateArea = (id: number, area: Omit<Area, 'id'>) => axios.put(`${API_URL}/${id}`, area);
export const deleteArea = (id: number) => axios.delete(`${API_URL}/${id}`);
