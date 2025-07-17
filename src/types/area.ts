export interface Area {
  id: number;
  nombre: string;
}

export interface AreaState {
  areas: Area[];
  loading: boolean;
  error: string | null;
}
