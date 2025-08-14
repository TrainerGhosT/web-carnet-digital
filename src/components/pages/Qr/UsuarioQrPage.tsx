/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { QrCode, Search, User } from "lucide-react";

import { useNavigate } from "react-router-dom";
import {
  obtenerQrUsuarioPorIdentificacion,
  obtenerUsuarios,
} from "../../../api/usuarioApi";
import Layout from "../../layout/Layout";

const UsuarioQrPage: React.FC = () => {
  const [identificacion, setIdentificacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [qrMeta, setQrMeta] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSearch = async () => {
    setError(null);
    setQrBase64(null);
    setQrMeta(null);

    if (!identificacion?.trim()) {
      setError("Ingrese una identificación válida.");
      return;
    }

    setLoading(true);
    try {
      const resp = await obtenerQrUsuarioPorIdentificacion(
        identificacion.trim()
      );
      // resp.data esperado: { qrCode: string, format: string, identificacion: string, ... }
      if (resp?.data?.qrCode) {
        setQrBase64(resp.data.qrCode);
        setQrMeta(resp.data);
      } else {
        setError("No se encontró QR para la identificación indicada.");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Error consultando el QR. Revisa la consola para más detalles."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerPerfil = async () => {
    // Intentamos obtener el usuario por la identificación para conseguir idUsuario
    try {
      setLoading(true);
      const usuariosResp = await obtenerUsuarios({ identificacion });
      // la API puede devolver array en data o directamente data, ajusta según tu backend
      const usuarios =
        usuariosResp?.data ?? usuariosResp?.data?.data ?? usuariosResp;
      // Buscamos primer usuario que coincida
      const found =
        Array.isArray(usuarios) && usuarios.length > 0
          ? usuarios[0]
          : Array.isArray(usuarios?.data) && usuarios.data.length
          ? usuarios.data[0]
          : null;

      if (found && found.idUsuario) {
        navigate(`/usuarios/ver/${found.idUsuario}`);
      } else {
        setError(
          "No fue posible obtener el perfil del usuario (idUsuario no encontrado)."
        );
      }
    } catch (err: any) {
      console.error(err);
      setError("Error obteniendo datos del usuario para redirección.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <QrCode className="w-8 h-8 text-blue-600" /> Generar o Consultar QR
        </h1>

        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Identificación
          </label>
          <div className="flex gap-2">
            <input
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ingrese la cédula o identificación"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-60"
            >
              <Search className="w-4 h-4" />{" "}
              {loading ? "Buscando..." : "Consultar QR"}
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          {qrBase64 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="flex flex-col items-center">
                <div className="bg-gray-50 p-4 rounded-md border">
                  <img
                    src={`data:image/png;base64,${qrBase64}`}
                    alt="QR usuario"
                    className="w-56 h-56 object-contain"
                  />
                </div>

                <div className="mt-4 w-full flex gap-2">
                  <button
                    onClick={handleVerPerfil}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-emerald-700"
                  >
                    <User className="w-4 h-4" />
                    Ver perfil escaneado
                  </button>
                  <a
                    href={`data:image/png;base64,${qrBase64}`}
                    download={`qr_${identificacion}.png`}
                    className="px-3 py-2 border rounded-md flex items-center gap-2 justify-center"
                  >
                    Descargar
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Metadatos del QR
                </h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md border">
                  <pre className="text-xs leading-5 text-gray-800 overflow-auto max-h-56">
                    {JSON.stringify(qrMeta ?? {}, null, 2)}
                  </pre>
                  <p className="mt-3 text-sm text-gray-600">
                    Nota: la resolución que devuelve el servicio es una imagen
                    PNG en base64. En caso de necesitar decodificar el contenido
                    del QR (JSON interno), tu servicio ya lo genera y lo guarda
                    (ver qr.service.ts).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UsuarioQrPage;
