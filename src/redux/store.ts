import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/loginSlice';
import usuarioReducer from './slices/usuarioSlice';

import areaReducer from './slices/areaSlice';
import carreraReducer from './slices/carreraSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    usuario: usuarioReducer,
    areas: areaReducer,
    carrera: carreraReducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;