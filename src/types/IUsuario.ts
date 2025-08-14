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
  fotografia?: UsuarioFoto;
  
}

export interface ActualizarUsuarioData {
  
  correo?: string | undefined;
  tipoIdentificacion?: number | undefined ;
  identificacion?: string | undefined;
  nombreCompleto?: string | undefined;
  contrasena?: string | undefined;
  tipoUsuario?: number | undefined;
  carreras?:  number[] | [];
  areas?: number[] | []; 
  telefonos?: Array<{ numero: string }>;
 
}

export interface UsuarioFormData {
  correo: string;
  tipoIdentificacion: number;
  identificacion: string;
  nombreCompleto: string;
  contrasena: string;
  tipoUsuario: number;
  carreras?: number[] ;
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

export interface Estado {
  idEstado: number;
  nombre: string;
}

export interface QrUsuario {
  qrBase64: string;
  
}

export interface UsuarioFoto {
  usuario: string
  fotoBase64: string;
}