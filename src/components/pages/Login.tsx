import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../redux/slices/loginSlice";
import { login } from "../../api/loginApi";
import Button from "../common/Button";
import axios from "axios";
import api from "../../api/axios";
import type { AppDispatch, RootState } from "../../redux/store";
import { obtenerUsuarioPorId } from "../../api/usuarioApi";
import Swal from "sweetalert2";
import { User, Lock } from "lucide-react";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, errorType } = useSelector(
    (state: RootState) => state.login
  );
  const state = location.state as {
    message?: string;
    fromLogout?: boolean;
  } | null;

  useEffect(() => {
    if (state?.message && !state?.fromLogout) {
      Swal.fire({
        icon: "info",
        html: `<strong>${state.message}</strong>`,
        confirmButtonText: "Aceptar",
      }).then(() => {
        navigate(location.pathname, { replace: true });
      });
    }
  }, [state, navigate, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      dispatch(
        loginFailure({
          message: "Usuario y/o contraseña incorrectos",
          errorType: "authError",
        })
      );

      if (!username) {
        usernameRef.current?.focus();
      } else {
        passwordRef.current?.focus();
      }
      return;
    }

    dispatch(loginStart());

    try {
      const { access_token, refresh_token, usuarioID, expires_in } =
        await login(username, password);

      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      
      // Obtener datos completos del usuario por su ID
      const usuarioResponse = await obtenerUsuarioPorId(usuarioID.toString());
      const usuarioData = usuarioResponse.data;

      const formattedUserData = {
        Usuario: usuarioData,
        access_token,
        refresh_token,
        usuarioID,
        expires_in,
        nombre_completo: usuarioData.nombreCompleto,
      };

      dispatch(loginSuccess(formattedUserData));

      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Error al realizar login:", error);

      let errorMsg = "Usuario y/o contraseña incorrectos";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMsg = String(error.response.data.message);
      }

      dispatch(
        loginFailure({
          message: errorMsg,
          errorType: "authError",
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
          
          {/* Card Izquierdo - Inspirado en Sidebar */}
          <div className="bg-gradient-to-b bg-slate-950 text-white p-10 lg:p-16 flex flex-col justify-center">
            <div className="text-center space-y-4">
              {/* Logo */}
              <div className="flex justify-center">
                <div className="w-76 h-50 rounded-3xl flex items-center justify-center shadow-lg p-0"> 
                  <img
                    src="/logo_carnet.jpg"
                    alt="Logo Carnet Digital"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>

              {/* Información del sistema */}
              <div className="space-y-6">
                <h1 className="text-4xl font-extrabold text-white tracking-wide">
                  Carnet Digital CUC
                </h1>
                <h2 className="text-2xl font-semibold text-blue-400">
                  Grupo Los 4 Mares
                </h2>
              </div>

              <div className="pt-6">
                <p className="text-slate-400 text-center leading-relaxed max-w-md mx-auto text-lg">
                  Plataforma implementada para la gestión y scaneo de carnets digitales.
                </p>
              </div>
            </div>
          </div>

          {/* Card Derecho - Formulario de Login */}
          <div className="bg-white relative overflow-hidden p-12 flex flex-col justify-center">
            {/* Mensaje de error flotante fuera del form, fixed top-right */}
            {error && errorType === "authError" && (
              <div className="fixed top-6 right-6 w-auto max-w-sm z-50">
                <div className="p-4 bg-red-50 border border-red-300 rounded-xl shadow-lg animate-pulse">
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-red-600 mr-3 flex-shrink-0">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-red-800 text-sm font-semibold">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Header del formulario */}
            <div className="bg-white px-8 py-6 mb-8">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-28 h-28 flex items-center justify-center">
                    <img src="https://www.cuc.ac.cr/wp-content/uploads/2022/12/logo-cuc.svg" alt="Logo CUC" className="w-full h-full object-contain" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
                <p className="text-gray-600 text-base">Accede a tu cuenta para continuar</p>
              </div>
            </div>

            {/* Formulario */}
            <div className="p-0">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Campo Usuario */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Usuario
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-800" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      ref={usernameRef}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (error)
                          dispatch(loginFailure({ message: "", errorType: "" }));
                      }}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ingresa tu correo institucional"
                    />
                  </div>
                </div>

                {/* Campo Contraseña */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-800" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      ref={passwordRef}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error)
                          dispatch(loginFailure({ message: "", errorType: "" }));
                      }}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ingresa tu contraseña"
                    />
                  </div>
                </div>

                {/* Botón Submit */}
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/25  hover:to-blue-700 py-3 px-4 rounded-xl shadow-lg hover:shadow-xl "
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Iniciando sesión...
                      </span>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;