// src/redux/slices/usuarioSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { UsuarioData, TipoIdentificacion, TipoUsuario, Carrera, Area } from '../../types/IUsuario';


interface UsuarioState {
  usuarios: UsuarioData[];
  usuarioActual: UsuarioData | null;
  tiposIdentificacion: TipoIdentificacion[];
  tiposUsuario: TipoUsuario[];
  carreras: Carrera[];
  areas: Area[];
  loading: boolean;
  error: string | null;
}

const initialState: UsuarioState = {
  usuarios: [],
  usuarioActual: null,
  tiposIdentificacion: [],
  tiposUsuario: [],
  carreras: [],
  areas: [],
  loading: false,
  error: null,
};

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {
    // Acciones para usuarios
    fetchUsuariosStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsuariosSuccess: (state, action: PayloadAction<UsuarioData[]>) => {
      state.loading = false;
      state.usuarios = action.payload;
      state.error = null;
    },
    fetchUsuariosFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Acciones para usuario individual
    fetchUsuarioStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsuarioSuccess: (state, action: PayloadAction<UsuarioData>) => {
      state.loading = false;
      state.usuarioActual = action.payload;
      state.error = null;
    },
    fetchUsuarioFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Acciones para catálogos
    fetchCatalogosStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCatalogosSuccess: (state, action: PayloadAction<{
      tiposIdentificacion: TipoIdentificacion[];
      tiposUsuario: TipoUsuario[];
      carreras: Carrera[];
      areas: Area[];
    }>) => {
      state.loading = false;
      state.tiposIdentificacion = action.payload.tiposIdentificacion;
      state.tiposUsuario = action.payload.tiposUsuario;
      state.carreras = action.payload.carreras;
      state.areas = action.payload.areas;
      state.error = null;
    },
    fetchCatalogosFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Limpiar usuario actual
    clearUsuarioActual: (state) => {
      state.usuarioActual = null;
    },
  },
});

export const {
  fetchUsuariosStart,
  fetchUsuariosSuccess,
  fetchUsuariosFailure,
  fetchUsuarioStart,
  fetchUsuarioSuccess,
  fetchUsuarioFailure,
  fetchCatalogosStart,
  fetchCatalogosSuccess,
  fetchCatalogosFailure,
  clearUsuarioActual,
} = usuarioSlice.actions;

export default usuarioSlice.reducer;