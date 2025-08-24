import type {
  Area,
  Carrera,
  Estado,
  TipoIdentificacion,
  TipoUsuario,
  UsuarioFiltros,
  UsuarioFormData,
} from "../types/IUsuario";
import api from "./axios";

const API_GATEWAY_URL = import.meta.env.VITE_API_URL;
const AUTH_SERVICE_URL = import.meta.env.VITE_API_AUTH_URL;

// Obtener todos los usuarios con filtros opcionales
export const obtenerUsuarios = async (filters?: UsuarioFiltros) => {
  const params = new URLSearchParams();

  if (filters?.identificacion)
    params.append("identificacion", filters.identificacion);
  if (filters?.nombre) params.append("nombre", filters.nombre);
  if (filters?.tipo) params.append("tipo", filters.tipo.toString());

  const queryString = params.toString();
  const url = queryString
    ? `${API_GATEWAY_URL}/usuario?${queryString}`
    : `${API_GATEWAY_URL}/usuario`;

  const response = await api.get(url);
  console.log("Response:", response.data);
  return response.data;
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (idUsuario: string) => {
  const response = await api.get(`${AUTH_SERVICE_URL}/usuario/${idUsuario}`);
  return response.data;
};

// Crear usuario
export const crearUsuario = async (usuario: UsuarioFormData) => {
  try {
    const response = await api.post(`${API_GATEWAY_URL}/usuario`, usuario);
    console.log("usuario form data:", usuario);
    console.log("Response crear usuario:", response.data);
    return response;
  } catch (error) {
    console.log("usuario form data:", usuario);
    console.log("Response crear usuario:", error);
    throw error;
  }
};

// Actualizar usuario
export const actualizarUsuario = async (
  idUsuario: string,
  usuario: UsuarioFormData
) => {
  const response = await api.put(
    `${AUTH_SERVICE_URL}/usuario/${idUsuario}`,
    usuario
  );
  return response.data;
};

// Eliminar usuario
export const eliminarUsuario = async (idUsuario: string) => {
  const response = await api.delete(`${AUTH_SERVICE_URL}/usuario/${idUsuario}`);
  return response.data;
};

// Cambiar estado de usuario (función existente)
export const cambiarEstadoUsuario = async (
  usuarioId: string,
  codigoEstado: number
) => {
  return api.patch(`${AUTH_SERVICE_URL}/usuario/estado/${usuarioId}`, {
    codigoEstado,
  });
};

// obtener foto de perfil del usuario por id

export const obtenerFotoPerfil = async (usuarioId: string) => {
  const response = await api.get(`${API_GATEWAY_URL}/usuario/fotografia/${usuarioId}`);
  return response.data;
};

export const actualizarFotografiaUsuario = async (usuarioId: string , fotografia: string) => {
  const response = await api.post(`${AUTH_SERVICE_URL}/usuario/fotografia`, {
    usuarioId, fotografia
  });
  console.log('Dato actualizar fotografia:', usuarioId, fotografia);

  return response.data;
};

export const eliminarFotografiaUsuario = async (usuarioId: string) => {
  const response = await api.delete(`${AUTH_SERVICE_URL}/usuario/fotografia/${usuarioId}`);
  return response.data;
};

// APIs para obtener catálogos
export const obtenerTiposIdentificacion = async (): Promise<
  TipoIdentificacion[]
> => {
  const response = await api.get(`${AUTH_SERVICE_URL}/tiposidentificacion`);
  return response.data;
};

export const obtenerTiposUsuario = async (): Promise<TipoUsuario[]> => {
  const response = await api.get(`${AUTH_SERVICE_URL}/tiposusuario`);
  console.log("Response tipo usuario:", response.data);
  return response.data;
};

export const obtenerCarreras = async (): Promise<Carrera[]> => {
  const response = await api.get(`${AUTH_SERVICE_URL}/carrera`);
  return response.data.data;
};

export const obtenerAreas = async (): Promise<Area[]> => {
  const response = await api.get(`${AUTH_SERVICE_URL}/area`);
  console.log("Response.data areas:", response.data);
  console.log("Response.data.data areas:", response.data.data);
  return response.data.data;
};

export const obtenerEstados = async (): Promise<Estado[]> => {
  const response = await api.get(`${AUTH_SERVICE_URL}/estados`);
  console.log("Response.data estados:", response.data);
  return response.data;
};

// Obtener Qr de usuario por la identificación (cédula)

export const obtenerQrUsuarioPorIdentificacion = async (
  identificacion: string
): Promise<{ success: boolean; message: string; data: { qrCode: string; format: string; identificacion: string; areas?: string[]; carreras?: string[] } }> => {
  const response = await api.get(
    `${API_GATEWAY_URL}/usuario/qr/${identificacion}`
  );

  console.log('Response obtener qr:', response.data);
  return response.data;
};
