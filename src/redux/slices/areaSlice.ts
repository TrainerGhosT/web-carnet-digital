import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AreaState } from '../../types/area';
import * as api from '../../api/areaAPI';
import axios from "axios";

const initialState: AreaState = {
  areas: [],
  loading: false,
  error: null
};

// Thunk: obtiene la lista de áreas
export const getAreas = createAsyncThunk(
  'areas/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.fetchAreas();
      console.log('🟢 RESPONSE:', response);
      return response;  // Suponiendo que la respuesta tiene la estructura { data: [...] }
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('Error desconocido al obtener áreas');
    }
  }
);

// Thunk para eliminar un área
export const deleteArea = createAsyncThunk(
  'areas/deleteArea',
  async (id: number, { rejectWithValue }) => {
    try {
      // Llamada a la API para eliminar el área
      await axios.delete(`http://localhost:3002/area/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return id;  // Devolvemos el ID para eliminarlo del estado global
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('Error desconocido al eliminar el área');
    }
  }
);

const areaSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAreas.fulfilled, (state, action) => {
        console.log('✅ Datos recibidos en fulfilled:', action.payload);
        state.loading = false;
        state.areas = action.payload ?? [];  // Asigna el payload que contiene el arreglo de áreas
      })
      .addCase(getAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.areas = []; // ❗️evita que quede en undefined
      })
      .addCase(deleteArea.fulfilled, (state, action) => {
        state.loading = false;
        // Eliminar el área del estado global utilizando el ID
        state.areas = state.areas.filter(area => area.idArea !== action.payload);
      })
      .addCase(deleteArea.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export default areaSlice.reducer;
