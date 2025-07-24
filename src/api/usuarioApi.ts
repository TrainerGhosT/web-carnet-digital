// src/api/usuarioApi.ts

import type { Area, Carrera, TipoIdentificacion, TipoUsuario, UsuarioFiltros, UsuarioFormData } from "../types/IUsuario";
import api from "./axios";


const CATALOG_BASE_URL = 'http://localhost:3001';
const USERS_BASE_URL = 'http://localhost:3000';

// Obtener todos los usuarios con filtros opcionales
export const obtenerUsuarios = async (filters?: UsuarioFiltros) => {
  const params = new URLSearchParams();
  
  if (filters?.identificacion) params.append('identificacion', filters.identificacion);
  if (filters?.nombre) params.append('nombre', filters.nombre);
  if (filters?.tipo) params.append('tipo', filters.tipo.toString());
  
  const queryString = params.toString();
  const url = queryString ? `${USERS_BASE_URL}/usuario?${queryString}` : `${USERS_BASE_URL}/usuario` ;
  
  const response = await api.get(url);
  console.log("Response:", response.data);
  return response.data;
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (idUsuario: string) => {
  const response = await api.get(`${USERS_BASE_URL}/usuario/${idUsuario}`);
  return response.data;
};

// Crear usuario
export const crearUsuario = async (usuario: UsuarioFormData) => {
  const response = await api.post(`${USERS_BASE_URL}/usuario`, usuario);
  return response.data;
};

// Actualizar usuario
export const actualizarUsuario = async (idUsuario: string, usuario: UsuarioFormData) => {
  const response = await api.put(`${USERS_BASE_URL}/usuario/${idUsuario}`, usuario);
  return response.data;
};

// Eliminar usuario
export const eliminarUsuario = async (idUsuario: string) => {
  const response = await api.delete(`${USERS_BASE_URL}/usuario/${idUsuario}`);
  return response.data;
};

// Cambiar estado de usuario (función existente)
export const cambiarEstadoUsuario = async (usuarioId: number, estadoId: number) => {
  return api.patch(`${USERS_BASE_URL}/usuario/estado`, {
    usuarioId,
    estadoId,
  });
};

// APIs para obtener catálogos
export const obtenerTiposIdentificacion = async (): Promise<TipoIdentificacion[]> => {
  const response = await fetch(`${CATALOG_BASE_URL}/tiposidentificacion`);
  return response.json();
};

export const obtenerTiposUsuario = async (): Promise<TipoUsuario[]> => {
  const response = await api.get(`${CATALOG_BASE_URL}/tiposusuario`);
  console.log("Response:", response);
  return response.data;

};

export const obtenerCarreras = async (): Promise<Carrera[]> => {
  const response = await fetch(`${CATALOG_BASE_URL}/carrera`);
  return response.json();
};

export const obtenerAreas = async (): Promise<Area[]> => {
  const response = await fetch(`${CATALOG_BASE_URL}/area`);
  return response.json();
};