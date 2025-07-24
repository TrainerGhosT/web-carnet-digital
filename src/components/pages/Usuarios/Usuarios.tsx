import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Lock } from 'lucide-react';
import Layout from '../../layout/Layout';
import Button from '../../common/Button';
import { obtenerUsuarios, eliminarUsuario, obtenerTiposUsuario, cambiarEstadoUsuario } from '../../../api/usuarioApi';
import Swal from 'sweetalert2';
import type { TipoUsuario, UsuarioData, UsuarioFiltros } from '../../../types/IUsuario';

const Usuarios: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>([]);
  const [filtros, setFiltros] = useState<UsuarioFiltros>({
    identificacion: '',
    nombre: '',
    tipo: undefined
  });

  useEffect(() => {
    cargarUsuarios();
    cargarTiposUsuario();
  }, []);

  const cargarUsuarios = async (filters?: UsuarioFiltros) => {
    try {
      setLoading(true);
      const response = await obtenerUsuarios(filters);
      setUsuarios(response.data || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los usuarios',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarTiposUsuario = async () => {
    try {
      const tipos = await obtenerTiposUsuario();
      setTiposUsuario(tipos);
    } catch (error) {
      console.error('Error al cargar tipos de usuario:', error);
    }
  };

  const handleToggleEstado = async (usuario: UsuarioData) => {
    const nuevoEstado = usuario.estadoUsuario === 1 ? 2 : 1;
    const accion = usuario.estadoUsuario === 1 ? 'bloquear' : 'activar';

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${accion} al usuario ${usuario.nombreCompleto}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: usuario.estadoUsuario === 1 ? '#d33' : '#3085d6'
    });

    if (result.isConfirmed) {
      try {
        await cambiarEstadoUsuario(Number(usuario.idUsuario), nuevoEstado);
        await cargarUsuarios(filtros);
        Swal.fire({
          title: '¡Éxito!',
          text: `Usuario ${accion}do correctamente`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } catch (e) {
        console.error(`Error al ${accion} usuario:`, e);
        Swal.fire({
          title: 'Error',
          text: `No se pudo ${accion} el usuario`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  };

  const handleEliminar = async (idUsuario: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    });

    if (result.isConfirmed) {
      try {
        await eliminarUsuario(idUsuario);
        await cargarUsuarios(filtros);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'Usuario eliminado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } catch {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el usuario',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  };

  const handleFiltrar = () => {
    const filtrosLimpios: UsuarioFiltros = {};
    if (filtros.identificacion?.trim()) filtrosLimpios.identificacion = filtros.identificacion.trim();
    if (filtros.nombre?.trim()) filtrosLimpios.nombre = filtros.nombre.trim();
    if (filtros.tipo) filtrosLimpios.tipo = filtros.tipo;
    cargarUsuarios(filtrosLimpios);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      identificacion: '',
      nombre: '',
      tipo: undefined
    });
    cargarUsuarios();
  };

  return (
    <Layout>
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <Button
            onClick={() => navigate('/usuarios/crear')}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo Usuario
          </Button>
        </div>

        {/* Filtros */}
        <div className="p-4 mb-6 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Identificación
              </label>
              <input
                type="text"
                value={filtros.identificacion}
                onChange={(e) => setFiltros({...filtros, identificacion: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar por identificación"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                value={filtros.nombre}
                onChange={(e) => setFiltros({...filtros, nombre: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar por nombre"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Tipo Usuario
              </label>
              <select
                value={filtros.tipo || ''}
                onChange={(e) => setFiltros({...filtros, tipo: Number(e.target.value) || undefined})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los tipos</option>
                {tiposUsuario.map(tipo => (
                  <option key={tipo.idTipoUsuario} value={tipo.idTipoUsuario}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleFiltrar}
              className="flex items-center gap-2"
            >
              <Search size={20} />
              Filtrar
            </Button>
            <Button
              variant="secondary"
              onClick={handleLimpiarFiltros}
            >
              Limpiar
            </Button>
          </div>
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Identificación
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map(usuario => (
                  <tr key={usuario.idUsuario} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {usuario.identificacion}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {usuario.nombreCompleto}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {usuario.correo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {tiposUsuario.find(t => t.idTipoUsuario === usuario.tipoUsuario)?.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${
                        usuario.estadoUsuario === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.estadoUsuario === 1 ? 'Activo' : 'Bloqueado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => navigate(`/usuarios/ver/${usuario.idUsuario}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Ver detalles"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => navigate(`/usuarios/editar/${usuario.idUsuario}`)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Editar usuario"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleToggleEstado(usuario)}
                          className={`${
                            usuario.estadoUsuario === 1
                              ? 'text-red-600 hover:text-red-800'
                              : 'text-green-600 hover:text-green-800'
                          }`}
                          title={usuario.estadoUsuario === 1 ? 'Bloquear usuario' : 'Activar usuario'}
                        >
                          <Lock size={20} />
                        </button>
                        <button
                          onClick={() => handleEliminar(usuario.idUsuario)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Usuarios;