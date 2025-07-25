import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { CarreraState } from '../../types/carrera';
import * as api from '../../api/carreraAPI';

const initialState: CarreraState = {
  carreras: [],
  loading: false,
  error: null
};

// Thunk: obtiene la lista de carreras
export const getCarreras = createAsyncThunk(
  'carreras/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.fetchCarreras();
      return response; // Asegúrate de que la respuesta contenga la propiedad `data`
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('Error desconocido al obtener carreras');
    }
  }
);

// Thunk para eliminar una carrera
export const deleteCarrera = createAsyncThunk(
  'carreras/deleteCarrera',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.deleteCarrera(id);  // Asegúrate de que esta función esté correctamente exportada
      return id;  // Devolvemos el ID para eliminarlo del estado
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('Error al eliminar la carrera');
    }
  }
);

const carreraSlice = createSlice({
  name: 'carreras',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCarreras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCarreras.fulfilled, (state, action) => {
        state.loading = false;
        state.carreras = action.payload ?? [];  // Asegúrate de que 'action.payload' tenga el formato adecuado
      })
      .addCase(getCarreras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCarrera.fulfilled, (state, action) => {
        const idToDelete = action.payload;  // El ID que recibimos
        state.carreras = state.carreras.filter(carrera => carrera.idCarrera !== idToDelete);  // Asegúrate de que el campo sea idCarrera
      })
      .addCase(deleteCarrera.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export default carreraSlice.reducer;
