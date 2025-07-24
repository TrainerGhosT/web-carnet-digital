export interface UsuarioData {
  idUsuario: string;
  correo: string;
  tipoIdentificacion: number;
  identificacion: string;
  nombreCompleto: string;
  contrasena: string;
  tipoUsuario: number;
  estadoUsuario: number;
  carreras: Array<{ carrera: number }>;
  areas: Array<{ area: number }>;
  telefonos: Array<{ numero: string }>;
}

export interface UsuarioFormData {
  correo: string;
  tipoIdentificacion: number;
  identificacion: string;
  nombreCompleto: string;
  contrasena: string;
  tipoUsuario: number;
  carreras: number[];
  areas?: number[];
  telefonos: Array<{ numero: string }>;
}

export interface TipoIdentificacion {
  idTipoIdentificacion: number;
  nombre: string;
}

export interface TipoUsuario {
  idTipoUsuario: number;
  nombre: string;
}

export interface Carrera {
  idCarrera: number;
  nombre: string;
}

export interface Area {
  idArea: number;
  nombre: string;
}

export interface UsuarioFiltros {
  identificacion?: string;
  nombre?: string;
  tipo?: number;
}