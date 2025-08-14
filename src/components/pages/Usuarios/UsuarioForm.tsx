/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Plus,
  X,
  User,
  Mail,
  IdCard,
  Lock,
  Briefcase,
  Phone,
  Users2,
  GraduationCap,
} from "lucide-react";
import Button from "../../common/Button";
import {
  obtenerTiposIdentificacion,
  obtenerTiposUsuario,
  obtenerCarreras,
  obtenerAreas,
} from "../../../api/usuarioApi";
import Swal from "sweetalert2";
import type {
  TipoIdentificacion,
  TipoUsuario,
  Carrera,
  Area,
  UsuarioFormData,
  ActualizarUsuarioData,
} from "../../../types/IUsuario";

// --- INTERFAZ DE PROPS ---
// Define las propiedades que el formulario reutilizable aceptará.
interface FormUsuarioProps {
  initialData?: Partial<UsuarioFormData>;
  onSubmit: (data: UsuarioFormData | ActualizarUsuarioData) => Promise<void>;
  isEditMode: boolean;
  isLoading: boolean;
  title: string;
}

const FormUsuario: React.FC<FormUsuarioProps> = ({
  initialData,
  onSubmit,
  isEditMode,
  isLoading,
  title,
}) => {
  const navigate = useNavigate();

  // --- ESTADOS DEL COMPONENTE ---
  const [tiposIdentificacion, setTiposIdentificacion] = useState<
    TipoIdentificacion[]
  >([]);
  const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [formData, setFormData] = useState<UsuarioFormData>({
    correo: "",
    tipoIdentificacion: 0,
    identificacion: "",
    nombreCompleto: "",
    contrasena: "",
    tipoUsuario: 0,
    carreras: [],
    areas: [],
    telefonos: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nuevoTelefono, setNuevoTelefono] = useState("");

  

  // Carga los catálogos (tipos de ID, roles, etc.) al montar el componente.
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [tipos, usuarios, carrerasData, areasData] = await Promise.all([
          obtenerTiposIdentificacion(),
          obtenerTiposUsuario(),
          obtenerCarreras(),
          obtenerAreas(),
        ]);
        setTiposIdentificacion(tipos);
        setTiposUsuario(usuarios);
        setCarreras(carrerasData);
        setAreas(areasData);
      } catch (error) {
        console.error("Error al cargar catálogos:", error);
        Swal.fire(
          "Error",
          "No se pudieron cargar los datos necesarios.",
          "error"
        );
      }
    };
    cargarCatalogos();
  }, []);

  // Popula el formulario con los datos iniciales en modo de edición.
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        ...initialData,
        contrasena: "", // La contraseña nunca se precarga por seguridad
        telefonos: initialData.telefonos || [],
        carreras: initialData.carreras || [],
        areas: initialData.areas || [],
      } as UsuarioFormData);
    }
  }, [initialData, isEditMode]);

  // --- MANEJADORES Y LÓGICA ---

  const validarFormulario = (): boolean => {
    const newErrors: Record<string, string> = {};
    // La lógica de validación se mantiene, ya que diferencia entre edición y creación.
    if (!formData.correo) newErrors.correo = "El correo es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo))
      newErrors.correo = "El formato del correo no es válido";
    else if (
      !formData.correo.endsWith("@cuc.cr") &&
      !formData.correo.endsWith("@cuc.ac.cr")
    )
      newErrors.correo = "El correo debe ser del dominio @cuc.cr o @cuc.ac.cr";
    if (!formData.tipoIdentificacion)
      newErrors.tipoIdentificacion = "El tipo de identificación es requerido";
    if (!formData.identificacion.trim())
      newErrors.identificacion = "La identificación es requerida";
    if (!formData.nombreCompleto.trim())
      newErrors.nombreCompleto = "El nombre completo es requerido";
    if (!isEditMode && !formData.contrasena)
      newErrors.contrasena = "La contraseña es requerida";
    if (!formData.tipoUsuario)
      newErrors.tipoUsuario = "El tipo de usuario es requerido";
    if (formData.correo && formData.tipoUsuario) {
      if (formData.correo.endsWith("@cuc.cr") && formData.tipoUsuario !== 1)
        newErrors.tipoUsuario =
          "Los usuarios con dominio @cuc.cr deben ser Estudiantes";
      if (formData.correo.endsWith("@cuc.ac.cr") && formData.tipoUsuario === 1)
        newErrors.tipoUsuario =
          "Los usuarios con dominio @cuc.ac.cr no pueden ser Estudiantes";
    }
    if (formData.tipoUsuario === 1 && formData.carreras?.length === 0)
      newErrors.carreras =
        "Los estudiantes deben tener al menos una carrera asociada";
    if (formData.tipoUsuario === 3 && formData.areas?.length === 0)
      newErrors.areas =
        "Los administradores deben tener al menos un área asociada";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) {
      Swal.fire(
        "Atención",
        "Por favor, corrija los errores en el formulario.",
        "warning"
      );
      return;
    }
    // Llama a la función onSubmit que viene de las props del componente padre.
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof UsuarioFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const agregarTelefono = () => {
    if (nuevoTelefono.trim() && /^[0-9]+$/.test(nuevoTelefono.trim())) {
      setFormData((prev) => ({
        ...prev,
        telefonos: [...prev.telefonos, { numero: nuevoTelefono.trim() }],
      }));
      setNuevoTelefono("");
    } else {
      Swal.fire("Atención", "Ingrese un número de teléfono válido.", "warning");
    }
  };

  const eliminarTelefono = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      telefonos: prev.telefonos.filter((_, i) => i !== index),
    }));
  };

  const handleCarreraChange = (carreraId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      carreras: checked
        ? [...(prev.carreras || []), carreraId]
        : prev.carreras?.filter((id) => id !== carreraId),
    }));
  };

  const handleAreaChange = (areaId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      areas: checked
        ? [...(prev.areas || []), areaId]
        : (prev.areas || []).filter((id) => id !== areaId),
    }));
  };

  const puedeSeleccionarCarreras = () =>
    formData.tipoUsuario === 1 || formData.tipoUsuario === 2;
  const puedeSeleccionarAreas = () =>
    formData.tipoUsuario === 2 || formData.tipoUsuario === 3;

  const renderInputField = (
    id: string,
    label: string,
    type: string,
    value: string,
    field: keyof UsuarioFormData,
    icon: React.ReactNode,
    placeholder: string,
    required = true
  ) => (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="flex absolute inset-y-0 left-0 items-center pl-3 text-blue-500">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`w-full pl-10 pr-3 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors[field] ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          placeholder={placeholder}
        />
      </div>
      {errors[field] && (
        <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <>
      <div className="flex gap-3 items-center mb-8">
        <Button
          onClick={() => navigate("/usuarios")}
          variant="secondary"
          className="!p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-10 space-y-8 bg-white rounded-2xl border border-gray-100 shadow-xl"
      >
        {/* Sección Información Personal */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-blue-700">
            Información Personal
          </h2>
          <div className="grid grid-cols-2 gap-8">
            {renderInputField(
              "nombreCompleto",
              "Nombre Completo",
              "text",
              formData.nombreCompleto,
              "nombreCompleto",
              <User size={20} />,
              "Ej: Juan Pérez"
            )}
            {renderInputField(
              "correo",
              "Correo Electrónico",
              "email",
              formData.correo,
              "correo",
              <Mail size={20} />,
              "usuario@cuc.cr"
            )}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Tipo de Identificación <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="flex absolute inset-y-0 left-0 items-center pl-3 text-blue-500">
                  <IdCard size={20} />
                </span>
                <select
                  id="tipoIdentificacion"
                  value={formData.tipoIdentificacion}
                  onChange={(e) =>
                    handleInputChange(
                      "tipoIdentificacion",
                      Number(e.target.value)
                    )
                  }
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg appearance-none bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.tipoIdentificacion
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value={0}>Seleccione un tipo</option>
                  {tiposIdentificacion.map((t) => (
                    <option
                      key={t.idTipoIdentificacion}
                      value={t.idTipoIdentificacion}
                    >
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {errors.tipoIdentificacion && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tipoIdentificacion}
                </p>
              )}
            </div>
            {renderInputField(
              "identificacion",
              "Identificación",
              "text",
              formData.identificacion,
              "identificacion",
              <IdCard size={20} />,
              "123456789"
            )}
          </div>
        </section>

        {/* Sección Credenciales y Rol */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-blue-700">
            Credenciales y Rol
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-1">
            {renderInputField(
              "contrasena",
              "Contraseña",
              "password",
              formData.contrasena,
              "contrasena",
              <Lock size={20} />,
              isEditMode ? "Dejar vacío para no cambiar" : "********",
              !isEditMode
            )}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Tipo de Usuario <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {tiposUsuario.map((t) => (
                  <label
                    key={t.idTipoUsuario}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border cursor-pointer transition-all ${
                      formData.tipoUsuario === t.idTipoUsuario
                        ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <Users2 size={16} className="text-blue-500" />
                    <input
                      type="radio"
                      checked={formData.tipoUsuario === t.idTipoUsuario}
                      onChange={() =>
                        handleInputChange("tipoUsuario", t.idTipoUsuario)
                      }
                      className="sr-only"
                    />
                    {t.nombre}
                  </label>
                ))}
              </div>
              {errors.tipoUsuario && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tipoUsuario}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Sección Carreras y Áreas */}
        <section>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-1">
            {puedeSeleccionarCarreras() && (
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-md">
                  Carreras{" "}
                  {formData.tipoUsuario === 1 && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <div className="flex flex-wrap gap-2">
                  {carreras.map((carrera) => (
                    <label
                      key={carrera.idCarrera}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full border cursor-pointer transition-all ${
                        formData.carreras?.includes(carrera.idCarrera)
                          ? "bg-green-100 border-green-500 text-green-700 font-semibold"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <GraduationCap size={20} className="text-green-600" />
                      <input
                        type="checkbox"
                        value={carrera.idCarrera}
                        checked={formData.carreras?.includes(carrera.idCarrera)}
                        onChange={(e) =>
                          handleCarreraChange(
                            carrera.idCarrera,
                            e.target.checked
                          )
                        }
                        className="sr-only"
                      />
                      {carrera.nombre}
                    </label>
                  ))}
                </div>
                {errors.carreras && (
                  <p className="mt-1 text-sm text-red-600">{errors.carreras}</p>
                )}
              </div>
            )}
            {puedeSeleccionarAreas() && (
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-md">
                  Áreas de Trabajo{" "}
                  {formData.tipoUsuario === 3 && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <div className="flex flex-wrap gap-2">
                  {areas.map((area) => (
                    <label
                      key={area.idArea}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full border cursor-pointer transition-all ${
                        formData.areas?.includes(area.idArea)
                          ? "bg-purple-100 border-purple-500 text-purple-700 font-semibold"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <Briefcase size={20} className="text-purple-500" />
                      <input
                        type="checkbox"
                        value={area.idArea}
                        checked={formData.areas?.includes(area.idArea)}
                        onChange={(e) =>
                          handleAreaChange(area.idArea, e.target.checked)
                        }
                        className="sr-only"
                      />
                      {area.nombre}
                    </label>
                  ))}
                </div>
                {errors.areas && (
                  <p className="mt-1 text-sm text-red-600">{errors.areas}</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Sección Teléfonos de Contacto */}
        <section className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <label className="block mb-3 text-sm font-medium text-gray-700">
            Teléfonos de Contacto
          </label>
          <div className="flex relative gap-2 mb-4">
            <span className="flex absolute inset-y-0 left-0 items-center pl-3 text-blue-500">
              <Phone size={20} />
            </span>
            <input
              type="text"
              value={nuevoTelefono}
              onChange={(e) => setNuevoTelefono(e.target.value)}
              className="py-2 pr-3 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese número de teléfono"
            />
            <Button
              type="button"
              onClick={agregarTelefono}
              variant="secondary"
              className="flex gap-2 items-center text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              <Plus size={16} /> Agregar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.telefonos.length > 0 ? (
              formData.telefonos.map((telefono, index) => (
                <span
                  key={index}
                  className="flex gap-2 items-center px-3 py-1 font-medium text-blue-800 bg-blue-100 rounded-full border border-blue-200"
                >
                  <Phone size={16} /> {telefono.numero}
                  <button
                    type="button"
                    onClick={() => eliminarTelefono(index)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400">
                No hay teléfonos registrados
              </span>
            )}
          </div>
        </section>

        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/usuarios")}
            className="hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <div className="w-5 h-5 rounded-full border-b-2 border-white animate-spin"></div>
            ) : (
              <Save size={20} />
            )}
            {isEditMode ? "Actualizar Usuario" : "Crear Usuario"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormUsuario;
