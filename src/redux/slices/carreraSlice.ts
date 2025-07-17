import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCarreras } from "../../api/carreraAPI";
import type { CarreraState } from "../../types/carrera";

const initialState: CarreraState = {
  carreras: [],
  loading: false,
  error: null,
};

export const getCarreras = createAsyncThunk("carreras/getCarreras", async (_, thunkAPI) => {
  try {
    return await fetchCarreras();
  } catch{
    return thunkAPI.rejectWithValue("Error al obtener carreras");
  }
});

const carreraSlice = createSlice({
  name: "carreras",
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
        state.carreras = action.payload;
      })
      .addCase(getCarreras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default carreraSlice.reducer;
