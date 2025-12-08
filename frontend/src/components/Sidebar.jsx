import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, FileText, Settings, LogOut, Tag } from 'lucide-react';
import useAuthStore from '../store/authStore';

import logo from '../assets/tienda_mass_logo.png';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuthStore();
    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMINISTRADOR', 'CAJERO', 'ALMACENERO'] },
        { path: '/pos', icon: ShoppingCart, label: 'Punto de Venta', roles: ['ADMINISTRADOR', 'CAJERO'] },
        { path: '/mis-ventas', icon: FileText, label: 'Mis Ventas', roles: ['ADMINISTRADOR', 'CAJERO'] },
        { path: '/devoluciones', icon: Package, label: 'Devoluciones', roles: ['ADMINISTRADOR', 'CAJERO'] },
        { path: '/productos', icon: Package, label: 'Productos', roles: ['ADMINISTRADOR', 'ALMACENERO'] },
        { path: '/categorias', icon: Tag, label: 'Categorías', roles: ['ADMINISTRADOR', 'ALMACENERO'] },
        { path: '/inventario', icon: Package, label: 'Inventario', roles: ['ADMINISTRADOR', 'ALMACENERO'] },
        { path: '/ajustes', icon: Settings, label: 'Ajustes Stock', roles: ['ADMINISTRADOR', 'ALMACENERO'] },
        { path: '/usuarios', icon: Users, label: 'Usuarios', roles: ['ADMINISTRADOR'] },
        { path: '/proveedores', icon: Users, label: 'Proveedores', roles: ['ADMINISTRADOR', 'ALMACENERO'] },
        { path: '/ordenes', icon: FileText, label: 'Órdenes Compra', roles: ['ADMINISTRADOR', 'ALMACENERO'] },
        { path: '/reportes-stock', icon: Tag, label: 'Reportes Stock', roles: ['ADMINISTRADOR', 'ALMACENERO'] },
        { path: '/reportes', icon: FileText, label: 'Reportes Grales.', roles: ['ADMINISTRADOR'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

    return (
        <div className="w-64 bg-primary shadow-md flex flex-col">
            <div className="p-6 flex items-center justify-center border-b border-yellow-600">
                <img src={logo} alt="Tienda Mass" className="h-12 object-contain" />
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul>
                    {filteredNavItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-6 py-3 text-gray-800 hover:bg-yellow-500 hover:text-secondary transition-colors ${location.pathname === item.path ? 'bg-secondary text-white border-r-4 border-yellow-600' : ''
                                    }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-yellow-600">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-red-500 hover:text-white rounded-md transition-colors font-semibold"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
