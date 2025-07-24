import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/loginSlice';
import usuarioReducer from './slices/usuarioSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    usuario: usuarioReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;