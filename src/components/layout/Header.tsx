import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';


const Header: React.FC = () => {
   const { Usuario } = useSelector((state: RootState) => state.login);
  
  const foto = Usuario?.Usuario.fotografia?.fotoBase64
    ? `data:image/jpeg;base64,${Usuario.Usuario.fotografia.fotoBase64}`
    : null;

  return (
    <header className="flex items-center px-6 h-16 bg-white shadow">
      <div className="flex-1"></div>
      <div className="flex items-center">
      <span className="mr-3 text-gray-700">{Usuario?.Usuario.nombreCompleto || 'Usuario'}</span>
        <div className="flex justify-center items-center w-10 h-10 text-blue-200 bg-gray-900 rounded-full">
          { foto ? (
            <img src={foto} alt="Foto de perfil" className="w-full h-full object-cover rounded-full" />
          ) : (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          )}
         
        </div>
      </div>
    </header>
  );
};

export default Header;