/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pages/Usuarios/FormUsuario.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import Layout from '../../layout/Layout';
import Button from '../../common/Button';

import { 
  crearUsuario, 
  actualizarUsuario, 
  obtenerUsuarioPorId,
  obtenerTiposIdentificacion,
  obtenerTiposUsuario,
  obtenerCarreras,
  obtenerAreas
} from '../../../api/usuarioApi';
import Swal from 'sweetalert2';
import type { TipoIdentificacion, TipoUsuario, Carrera, Area, UsuarioFormData } from '../../../types/IUsuario';

const FormUsuario: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const esEdicion = !!id;

  const [loading, setLoading] = useState(false);
  const [tiposIdentificacion, setTiposIdentificacion] = useState<TipoIdentificacion[]>([]);
  const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [formData, setFormData] = useState<UsuarioFormData>({
    correo: '',
    tipoIdentificacion: 0,
    identificacion: '',
    nombreCompleto: '',
    contrasena: '',
    tipoUsuario: 0,
    carreras: [],
    areas: [],
    telefonos: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nuevoTelefono, setNuevoTelefono] = useState('');

  useEffect(() => {
    cargarCatalogos();
    if (esEdicion && id) {
      cargarUsuario(id);
    }
  }, [id, esEdicion]);

  const cargarCatalogos = async () => {
    try {
      const [tipos, usuarios, carrerasData, areasData] = await Promise.all([
        obtenerTiposIdentificacion(),
        obtenerTiposUsuario(),
        obtenerCarreras(),
        obtenerAreas()
      ]);

      setTiposIdentificacion(tipos);
      setTiposUsuario(usuarios);
      setCarreras(carrerasData);
      setAreas(areasData);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos necesarios',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const cargarUsuario = async (idUsuario: string) => {
    try {
      setLoading(true);
      const response = await obtenerUsuarioPorId(idUsuario);
      const usuario = response.data;
      
      setFormData({
        correo: usuario.correo,
        tipoIdentificacion: usuario.tipoIdentificacion,
        identificacion: usuario.identificacion,
        nombreCompleto: usuario.nombreCompleto,
        contrasena: '', // No cargar contraseña por seguridad
        tipoUsuario: usuario.tipoUsuario,
        carreras: usuario.carreras.map((c: any) => c.carrera),
        areas: usuario.areas.map((a: any) => a.area),
        telefonos: usuario.telefonos || []
      });
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar el usuario',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoading(false);
    }
  };

  const validarFormulario = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar correo
    if (!formData.correo) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El formato del correo no es válido';
    } else if (!formData.correo.endsWith('@cuc.cr') && !formData.correo.endsWith('@cuc.ac.cr')) {
      newErrors.correo = 'El correo debe ser del dominio @cuc.cr o @cuc.ac.cr';
    }

    // Validar tipo de identificación
    if (!formData.tipoIdentificacion) {
      newErrors.tipoIdentificacion = 'El tipo de identificación es requerido';
    }

    // Validar identificación
    if (!formData.identificacion.trim()) {
      newErrors.identificacion = 'La identificación es requerida';
    }

    // Validar nombre completo
    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre completo es requerido';
    }

    // Validar contraseña (solo en creación)
    if (!esEdicion && !formData.contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
    }

    // Validar tipo de usuario
    if (!formData.tipoUsuario) {
      newErrors.tipoUsuario = 'El tipo de usuario es requerido';
    }

    // Validar lógica de dominio y tipo de usuario
    if (formData.correo && formData.tipoUsuario) {
      if (formData.correo.endsWith('@cuc.cr') && formData.tipoUsuario !== 1) {
        newErrors.tipoUsuario = 'Los usuarios con dominio @cuc.cr deben ser estudiantes';
      }
      if (formData.correo.endsWith('@cuc.ac.cr') && formData.tipoUsuario === 1) {
        newErrors.tipoUsuario = 'Los usuarios con dominio @cuc.ac.cr deben ser funcionarios o administradores';
      }
    }

    // Validar carreras/áreas según tipo de usuario
    if (formData.tipoUsuario === 1 && formData.carreras.length === 0) {
      newErrors.carreras = 'Los estudiantes deben tener al menos una carrera asociada';
    }
    if (formData.tipoUsuario === 2 && formData.areas.length === 0) {
      newErrors.areas = 'Los funcionarios deben tener al menos un área asociada';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      setLoading(true);
      
      if (esEdicion && id) {
        await actualizarUsuario(id, formData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } else {
        await crearUsuario(formData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }

      navigate('/usuarios');
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      Swal.fire({
        title: 'Error',
        text: `No se pudo ${esEdicion ? 'actualizar' : 'crear'} el usuario`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UsuarioFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const agregarTelefono = () => {
    if (nuevoTelefono.trim()) {
      setFormData(prev => ({
        ...prev,
        telefonos: [...prev.telefonos, { numero: nuevoTelefono.trim() }]
      }));
      setNuevoTelefono('');
    }
  };

  const eliminarTelefono = (index: number) => {
    setFormData(prev => ({
      ...prev,
      telefonos: prev.telefonos.filter((_, i) => i !== index)
    }));
  };

  const handleCarreraChange = (carreraId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      carreras: checked
        ? [...prev.carreras, carreraId]
        : prev.carreras.filter(id => id !== carreraId)
    }));
  };

  const handleAreaChange = (areaId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      areas: checked
        ? [...prev.areas, areaId]
        : prev.areas.filter(id => id !== areaId)
    }));
  };

  const puedeSeleccionarCarreras = () => {
    return formData.tipoUsuario === 1 || formData.tipoUsuario === 3; // Estudiante o Admin
  };

  const puedeSeleccionarAreas = () => {
    return formData.tipoUsuario === 2 || formData.tipoUsuario === 3; // Funcionario o Admin
  };

  return (
    <Layout>
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/usuarios')}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              {esEdicion ? 'Editar Usuario' : 'Crear Usuario'}
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => handleInputChange('correo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.correo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="usuario@cuc.cr"
                />
                {errors.correo && (
                  <p className="mt-1 text-sm text-red-600">{errors.correo}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Tipo de Identificación *
                </label>
                <select
                  value={formData.tipoIdentificacion}
                  onChange={(e) => handleInputChange('tipoIdentificacion', Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.tipoIdentificacion ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value={0}>Seleccione un tipo</option>
                  {tiposIdentificacion.map(tipo => (
                    <option key={tipo.idTipoIdentificacion} value={tipo.idTipoIdentificacion}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
                {errors.tipoIdentificacion && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipoIdentificacion}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Identificación *
                </label>
                <input
                  type="text"
                  value={formData.identificacion}
                  onChange={(e) => handleInputChange('identificacion', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.identificacion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123456789"
                />
                {errors.identificacion && (
                  <p className="mt-1 text-sm text-red-600">{errors.identificacion}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.nombreCompleto}
                  onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nombreCompleto ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Juan Pérez González"
                />
                {errors.nombreCompleto && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombreCompleto}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Contraseña {!esEdicion && '*'}
                </label>
                <input
                  type="password"
                  value={formData.contrasena}
                  onChange={(e) => handleInputChange('contrasena', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.contrasena ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={esEdicion ? "Dejar vacío para no cambiar" : "Ingrese contraseña"}
                />
                {errors.contrasena && (
                  <p className="mt-1 text-sm text-red-600">{errors.contrasena}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Tipo de Usuario *
                </label>
                <select
                  value={formData.tipoUsuario}
                  onChange={(e) => handleInputChange('tipoUsuario', Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.tipoUsuario ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value={0}>Seleccione un tipo</option>
                  {tiposUsuario.map(tipo => (
                    <option key={tipo.idTipoUsuario} value={tipo.idTipoUsuario}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
                {errors.tipoUsuario && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipoUsuario}</p>
                )}
              </div>
            </div>

            {/* Carreras (solo para estudiantes y administradores) */}
            {puedeSeleccionarCarreras() && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Carreras {formData.tipoUsuario === 1 ? '*' : ''}
                </label>
                <div className="grid grid-cols-1 gap-2 p-3 overflow-y-auto border border-gray-300 rounded-md md:grid-cols-2 lg:grid-cols-3 max-h-40">
                  {carreras.map(carrera => (
                    <label key={carrera.idCarrera} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.carreras.includes(carrera.idCarrera)}
                        onChange={(e) => handleCarreraChange(carrera.idCarrera, e.target.checked)}
                        className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{carrera.nombre}</span>
                    </label>
                  ))}
                </div>
                {errors.carreras && (
                  <p className="mt-1 text-sm text-red-600">{errors.carreras}</p>
                )}
              </div>
            )}

            {/* Áreas (solo para funcionarios y administradores) */}
            {puedeSeleccionarAreas() && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Áreas {formData.tipoUsuario === 2 ? '*' : ''}
                </label>
                <div className="grid grid-cols-1 gap-2 p-3 overflow-y-auto border border-gray-300 rounded-md md:grid-cols-2 lg:grid-cols-3 max-h-40">
                  {areas.map(area => (
                    <label key={area.idArea} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.areas.includes(area.idArea)}
                        onChange={(e) => handleAreaChange(area.idArea, e.target.checked)}
                        className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{area.nombre}</span>
                    </label>
                  ))}
                </div>
                {errors.areas && (
                  <p className="mt-1 text-sm text-red-600">{errors.areas}</p>
                )}
              </div>
            )}

            {/* Teléfonos */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Teléfonos de Contacto
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nuevoTelefono}
                    onChange={(e) => setNuevoTelefono(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingrese número de teléfono"
                  />
                  <Button
                    type="button"
                    onClick={agregarTelefono}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Agregar
                  </Button>
                </div>
                
                {formData.telefonos.length > 0 && (
                  <div className="space-y-2">
                    {formData.telefonos.map((telefono, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-gray-50">
                        <span className="flex-1 text-sm">{telefono.numero}</span>
                        <button
                          type="button"
                          onClick={() => eliminarTelefono(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end pt-6 space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/usuarios')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <Save size={16} />
                )}
                {esEdicion ? 'Actualizar' : 'Crear'} Usuario
              </Button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default FormUsuario;