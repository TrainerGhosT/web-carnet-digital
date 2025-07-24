import axios from 'axios';
import { store } from '../redux/store';

export const refreshToken = async () => {
  const refresh_token = store.getState().login.Usuario?.refresh_token;

  if (!refresh_token) {
    throw new Error('No hay refresh_token disponible');
  }

  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/refresh`,
    null, // body vacío (null), se usa el token en el header
    {
      headers: { refresh_token },
    }
  );

  // NO guardar localStorage aquí, solo devolver los datos
  return response.data; // debe incluir access_token, refresh_token, expires_in
};
