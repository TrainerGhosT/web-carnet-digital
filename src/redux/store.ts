import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/loginSlice';
import usuarioReducer from './slices/usuarioSlice';
import carreraReducer from './slices/carreraSlice'
import areaReducer from './slices/areaSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    usuario: usuarioReducer,
    areas: areaReducer,
    carreras: carreraReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;