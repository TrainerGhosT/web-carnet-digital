export interface Carrera {
  id: number;
  nombre: string;
  director: string;
  email: string;
  telefono: number;
}

export interface CarreraState {
  carreras: Carrera[];
  loading: boolean;
  error: string | null;
}
