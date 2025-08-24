/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../layout/Layout";

import {
  obtenerFotoPerfil,
  actualizarFotografiaUsuario,
  eliminarFotografiaUsuario,
  obtenerUsuarios,
} from "../../../api/usuarioApi";
import {
  CloudUpload,
  ImageOff,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
  Users,
  Download,
} from "lucide-react";
import type { RootState } from "../../../redux/store";
import type { UsuarioData } from "../../../types/IUsuario";

const MAX_BYTES = 1_000_000; // 1 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const FotografiaUsuario: React.FC = () => {
  const usuario = useSelector((state: RootState) => state.login.Usuario);
  const defaultUsuarioId = usuario?.usuarioID ? String(usuario.usuarioID) : "";

  const [loading, setLoading] = useState<boolean>(true); // Carga de fotografía
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true); // Carga de usuarios
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string>("");

  const [serverImage, setServerImage] = useState<string | null>(null); // data URL completa
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [fileError, setFileError] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);

  const selectedUsuario = useMemo(
    () => usuarios.find((u) => String(u.idUsuario) === String(selectedUsuarioId)),
    [usuarios, selectedUsuarioId]
  );

  const displayName = useMemo(
    () => selectedUsuario?.nombreCompleto || "Usuario",
    [selectedUsuario]
  );

  const normalizeFromGet = (payload: any): string | null => {
    // Intenta manejar distintas formas de respuesta (data.fotografia o data.fotoBase64)
    // Retorna siempre una data URL lista para mostrar.
    try {
      if (!payload) return null;
      const d = payload.data || payload; // por si ya viene desenvuelto
      // 1) Si trae 'fotografia' con prefijo
      if (d?.fotografia && typeof d.fotografia === "string" && d.fotografia.startsWith("data:image/")) {
        return d.fotografia;
      }
      // 2) Si trae fotoBase64 sin prefijo, asumimos jpeg como fallback
      if (d?.fotoBase64 && typeof d.fotoBase64 === "string") {
        return `data:image/jpeg;base64,${d.fotoBase64}`;
      }
      // 3) Si trae .data.fotografia
      if (payload?.data?.fotografia && typeof payload.data.fotografia === "string" && payload.data.fotografia.startsWith("data:image/")) {
        return payload.data.fotografia;
      }
      // 4) Si trae .data.fotoBase64
      if (payload?.data?.fotoBase64 && typeof payload.data.fotoBase64 === "string") {
        return `data:image/jpeg;base64,${payload.data.fotoBase64}`;
      }
    } catch {
      // ignorar
    }
    return null;
  };

  const cargarUsuarios = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const resp = await obtenerUsuarios();
      const lista = resp?.data ? resp.data : resp;
      setUsuarios(lista || []);
      // Si no hay seleccionado, asignar por defecto (usuario logueado o primero)
      if (!selectedUsuarioId) {
        const porDefecto =
          (defaultUsuarioId && lista?.find((u: UsuarioData) => String(u.idUsuario) === defaultUsuarioId)?.idUsuario) ??
          (lista?.[0]?.idUsuario ?? "");
        setSelectedUsuarioId(porDefecto ? String(porDefecto) : "");
      }
    } finally {
      setLoadingUsers(false);
    }
  }, [defaultUsuarioId, selectedUsuarioId]);

  const cargarFoto = useCallback(async () => {
    if (!selectedUsuarioId) {
      setServerImage(null);
      setUpdatedAt(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setFileError("");
    try {
      // POST con usuarioId en el body
      const resp = await obtenerFotoPerfil(String(selectedUsuarioId));
      const img = normalizeFromGet(resp);
      setServerImage(img);
      console.log('1-img:', img)
      const fecha = resp?.data?.fechaActualizacion || resp?.fechaActualizacion || null;
      setUpdatedAt(fecha ? String(fecha) : null);
    } catch {
      // Si no tiene foto o 404, mostrar estado vacío
      setServerImage(null);
      setUpdatedAt(null);
    } finally {
      setLoading(false);
    }
  }, [selectedUsuarioId]);

  useEffect(() => {
    void cargarUsuarios();
  }, [cargarUsuarios]);

  useEffect(() => {
    // Cargar la foto cada vez que cambie el usuario seleccionado
    if (selectedUsuarioId) {
      void cargarFoto();
    }
  }, [selectedUsuarioId, cargarFoto]);

  const onSelectFile = async (file: File) => {
    setFileError("");
    setSelectedFileName("");
    setPreview(null);

    // Validaciones
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Formato no permitido. Solo JPEG, PNG o WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setFileError("La fotografía no debe superar 1 MB.");
      return;
    }

    // Convertir a Data URL con prefijo
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setSelectedFileName(file.name);
      

    };
    reader.onerror = () => {
      setFileError("No se pudo leer el archivo. Intente nuevamente.");
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (saving) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onSelectFile(file);
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelectFile(file);
  };

  const handleSave = async () => {
    if (!preview || !selectedUsuarioId) return;
    setSaving(true);
    setFileError("");
    try {
      // POST con usuarioId y fotografiaBase64 en body
      const resp = await actualizarFotografiaUsuario(String(selectedUsuarioId), preview);
      const nueva = normalizeFromGet(resp) || preview;
      setServerImage(nueva);
      console.log('2-img', nueva)
      setUpdatedAt(resp?.data?.fechaActualizacion || resp?.fechaActualizacion || new Date().toISOString());
      setPreview(null);
      setSelectedFileName("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Ocurrió un error al guardar la fotografía.";
      setFileError(String(msg));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUsuarioId) return;
    setDeleting(true);
    setFileError("");
    try {
      // DELETE con id en URL
      await eliminarFotografiaUsuario(String(selectedUsuarioId));
      setServerImage(null);
      setUpdatedAt(null);
      setPreview(null);
      setSelectedFileName("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Ocurrió un error al eliminar la fotografía.";
      setFileError(String(msg));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Fotografía de Usuario
                </h1>
                <p className="text-gray-600">
                  Selecciona el usuario y gestiona su fotografía. Formatos: JPG, PNG, WebP. Máx 1 MB. Recomendado: 3:4 (vertical).
                </p>
              </div>
            </div>
            {serverImage && (
              <div className="items-center hidden text-sm text-gray-500 sm:flex">
                {updatedAt ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    <span>Actualizado: {new Date(updatedAt).toLocaleString()}</span>
                  </>
                ) : (
                  <span>Foto cargada</span>
                )}
              </div>
            )}
          </div>

          {/* Formulario de selección de usuario */}
          <div className="p-6 mb-6 bg-white shadow rounded-xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
              <div className="sm:col-span-2">
                <label className="flex items-center block gap-2 mb-1 text-sm font-medium text-gray-700">
                  <Users className="w-4 h-4 text-gray-500" />
                  Seleccionar usuario
                </label>
                <select
                  value={selectedUsuarioId}
                  onChange={(e) => setSelectedUsuarioId(e.target.value)}
                  className="w-full px-3 py-2 transition border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loadingUsers}
                >
                  <option value="">
                    {loadingUsers ? "Cargando usuarios..." : "Seleccione un usuario"}
                  </option>
                  {usuarios.map((u) => (
                    <option key={u.idUsuario} value={String(u.idUsuario)}>
                      {u.nombreCompleto} ({u.identificacion})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cargarFoto}
                  disabled={!selectedUsuarioId || loading}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedUsuarioId && !loading
                      ? "text-blue-700 border-blue-300 hover:bg-blue-50"
                      : "text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                  title="Obtener fotografía del usuario seleccionado"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Obtener fotografía
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Vista previa actual */}
            <div className="p-6 bg-white shadow rounded-xl">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Vista actual {selectedUsuario ? `de ${selectedUsuario.nombreCompleto}` : ""}
              </h2>
              <div className="flex items-center justify-center w-full overflow-hidden border border-gray-200 rounded-lg bg-gray-50 aspect-square">
                {loading ? (
                  <div className="flex flex-col items-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="mt-2 text-sm">Cargando fotografía...</span>
                  </div>
                ) : serverImage ? (
                  <img src={serverImage} alt={displayName} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageOff className="w-12 h-12" />
                    <span className="mt-2 text-sm">Sin fotografía</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleDelete}
                  disabled={!serverImage || deleting || !selectedUsuarioId}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    serverImage && selectedUsuarioId
                      ? "text-red-700 border-red-300 hover:bg-red-50"
                      : "text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Eliminar
                </button>
              </div>
            </div>

            {/* Área de carga (drag & drop) */}
            <div className="p-6 bg-white shadow rounded-xl">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Subir nueva fotografía</h2>

              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  saving ? "opacity-70" : ""
                } ${
                  fileError
                    ? "border-red-300 bg-red-50/40"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/40"
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <CloudUpload className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="mt-4 font-medium text-gray-700">
                    Arrastra y suelta tu imagen aquí
                  </p>
                  <p className="text-sm text-gray-500">
                    o
                  </p>
                  <div className="mt-3">
                    <label className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white transition-colors bg-blue-600 rounded-lg shadow cursor-pointer hover:bg-blue-700">
                      Seleccionar archivo
                      <input
                        type="file"
                        accept={ACCEPTED_TYPES.join(",")}
                        onChange={onPickFile}
                        className="hidden"
                        disabled={saving || !selectedUsuarioId}
                      />
                    </label>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Formatos permitidos: JPG, PNG, WebP. Tamaño máximo: 1 MB.
                  </p>
                </div>
              </div>

              {/* Preview del archivo seleccionado */}
              {preview && (
                <div className="mt-5">
                  <div className="mb-2 text-sm text-gray-600">
                    <span className="font-medium">Archivo:</span> {selectedFileName}
                  </div>
                  <div className="w-full overflow-hidden border border-gray-200 rounded-lg aspect-square">
                    <img src={preview} alt="Vista previa" className="object-cover w-full h-full" />
                  </div>
                </div>
              )}

              {/* Error / Estado */}
              {fileError && (
                <div className="flex items-start gap-2 p-3 mt-4 text-red-700 border border-red-200 rounded-md bg-red-50">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Validación</p>
                    <p className="text-sm">{fileError}</p>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={!preview || saving || !selectedUsuarioId}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
                    preview && selectedUsuarioId ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setPreview(null);
                    setSelectedFileName("");
                    setFileError("");
                  }}
                  disabled={!preview || saving}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    preview
                      ? "text-gray-700 border-gray-300 hover:bg-gray-50"
                      : "text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  Cancelar
                </button>
              </div>

              {/* Nota de proporción recomendada */}
              <div className="mt-4 text-xs text-gray-500">
                Consejo: Para mejores resultados en el carnet, usa una foto vertical con fondo neutro (relación ~3:4).
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FotografiaUsuario;