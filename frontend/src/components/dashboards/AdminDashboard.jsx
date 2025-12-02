import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, Users, Package, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        ventasHoy: 0,
        usuariosActivos: 0,
        productosBajoStock: 0,
        ordenesPendientes: 0
    });

    useEffect(() => {
        // Fetch real stats here. For now mocking or using available endpoints.
        // Ideally: axios.get('/reportes/dashboard-stats')
        // We'll simulate for now or fetch what we can.
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                // Example: Fetch users count
                const usersRes = await axios.get('http://localhost:8080/usuarios', { headers: { Authorization: `Bearer ${token}` } });
                setStats(prev => ({ ...prev, usuariosActivos: usersRes.data.length }));

                // We could add more specific endpoints later.
            } catch (e) { console.error(e); }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Administración</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Ventas Hoy</p>
                            <h3 className="text-2xl font-bold text-gray-800">S/ 0.00</h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <DollarSign className="w-6 h-6 text-secondary" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Usuarios</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.usuariosActivos}</h3>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Bajo Stock</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.productosBajoStock}</h3>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Órdenes Pendientes</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.ordenesPendientes}</h3>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <ShoppingBag className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity & Charts Placeholders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Ventas Recientes</h3>
                    <div className="text-gray-500 text-center py-8">
                        No hay ventas recientes para mostrar.
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Productos Más Vendidos</h3>
                    <div className="text-gray-500 text-center py-8">
                        Gráfico de productos más vendidos.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
