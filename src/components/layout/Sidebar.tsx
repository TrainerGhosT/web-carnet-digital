import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/loginSlice";
import { 
  Home, 
  Users, 
  UserCheck, 
  GraduationCap, 
  Shield, 
  IdCard, 
  Camera, 
  QrCode, 
  Building, 
  ToggleLeft,
  ChevronRight,
  LogOut,
  Settings
} from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

  const menuItems = [
    {
      to: "/dashboard",
      label: "Inicio",
      icon: Home,
    },
    {
      label: "Usuarios",
      icon: Users,
      children: [
        {
          to: "/usuarios",
          label: "Gestión de Usuarios",
          icon: Users,
        },
        {
          to: "/cambiar-estado",
          label: "Cambiar Estado",
          icon: ToggleLeft,
        },
        {
          to: "/fotografia",
          label: "Fotografía",
          icon: Camera,
        },
      ],
    },
    {
      label: "Administración",
      icon: Settings,
      children: [
        {
          to: "/carreras",
          label: "Carreras",
          icon: GraduationCap,
          
        },
        {
          to: "/tipos-usuario",
          label: "Tipos de Usuario",
          icon: UserCheck,
        },
        {
          to: "/tipos-identificacion",
          label: "Tipos Identificación",
          icon: IdCard,
        },
        {
          to: "/areas-trabajo",
          label: "Áreas de Trabajo",
          icon: Building,
        },
      ],
    },
    {
      to: "/generar-qr",
      label: "Generar QR",
      icon: QrCode,
    },
  ];

  // Mantener abierto el submenú si algún hijo está activo
  useEffect(() => {
    const newOpenMenus: { [key: number]: boolean } = {};

    menuItems.forEach((item, index) => {
      if (item.children && isChildActive(item.children)) {
        newOpenMenus[index] = true;
      }
    });

    setOpenMenus((prev) => ({ ...prev, ...newOpenMenus }));
  }, [location.pathname]);

  const toggleMenu = (index: number) => {
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    // Usar navigate en lugar de modificar location.pathname directamente
    window.location.href = "/login";
  };

  type ChildMenuItem = {
    to: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
  };

  const isChildActive = (children: ChildMenuItem[]) => {
    return children.some((child) => location.pathname === child.to);
  };

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 bg-slate-900  h-full flex flex-col w-64 shadow-2xl">
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white h-full flex flex-col w-64 shadow-2xl">
      {/* Header */}
      <div className="px-6 py-8 flex items-center border-b border-slate-800/50">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25"></div>
          <div className="relative bg-slate-800 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-blue-400 drop-shadow-lg" />
          </div>
        </div>
        <div className="ml-3">
          <h1 className="text-lg font-bold bg-gradient-to-r text-slate-300">
            Carnet Digital
          </h1>
          <p className="text-xs text-slate-400">Grupo Los 4 Mares</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.children ? (
              // Elemento con submenú
              <div>
                <button
                  onClick={() => toggleMenu(index)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isChildActive(item.children)
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openMenus[index] ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {openMenus[index] && (
                  <div className="mt-2 ml-4 space-y-1">
                    {item.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        to={child.to}
                        className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 border-l-2 ${
                          location.pathname === child.to
                            ? "border-blue-400 bg-blue-900/30 text-blue-300 shadow-md"
                            : "border-transparent text-slate-400 hover:bg-slate-800/30 hover:border-indigo-600 hover:text-slate-300"
                        }`}
                      >
                        <child.icon className="h-4 w-4 mr-3" />
                        <span className="text-sm font-medium">{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Elemento normal sin submenú
              <Link
                to={item.to}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  location.pathname === item.to
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-slate-300 hover:text-white hover:bg-red-900/20 hover:border-red-500/50 rounded-xl transition-all duration-200 border border-transparent group"
        >
          <LogOut className="h-5 w-5 mr-3 group-hover:text-red-400" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>

    </section>
  );
};

export default Sidebar;