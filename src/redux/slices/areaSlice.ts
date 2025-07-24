// src/redux/slices/areaSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {  AreaState } from '../../types/area';
import * as api from '../../api/areaAPI';

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
      console.log('🟢 RESPONSE:', response.data);
      return response.data.data;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('Error desconocido al obtener áreas');
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
        state.areas = action.payload ?? [];
      })
      .addCase(getAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.areas = []; // ❗️evita que quede en undefined
      });
  }
});

export default areaSlice.reducer;
