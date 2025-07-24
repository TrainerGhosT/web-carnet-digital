import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (correo: string, contrasena: string) => {
  const tipousuario = correo.endsWith('@cuc.cr') ? 'estudiante'
                    : correo.endsWith('@cuc.ac.cr') ? 'funcionario' 
                    : '';

  if (!tipousuario) {
    throw new Error('Dominio del correo no es válido');
  }

  console.log("Tipo de usuario:", tipousuario);

  const response = await axios.post(`${API_URL}/login`, null, {
    headers: {
      'correo': correo,
      'contrasena': contrasena,
      'tipousuario': tipousuario
    }
  });

  console.log("Response:", response.data);

  return response.data;
};