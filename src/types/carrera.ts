export interface Carrera {
  idCarrera: number;
  nombre: string;
  director: string;
  email: string;
  telefono: string;
}

export interface CarreraState {
  carreras: Carrera[];
  loading: boolean;
  error: string | null;
}
