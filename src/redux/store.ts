import { configureStore } from '@reduxjs/toolkit';
import areaReducer from './slices/areaSlice';
import carreraReducer from './slices/carreraSlice'

export const store = configureStore({
  reducer: {
    areas: areaReducer,
    carreras: carreraReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
