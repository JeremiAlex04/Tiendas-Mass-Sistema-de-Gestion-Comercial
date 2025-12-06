import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Users, Package, ShoppingBag, TrendingUp, AlertTriangle, Plus, FileText, Settings } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        ventasHoy: 0,
        ventasMes: 0,
        transaccionesHoy: 0,
        usuariosActivos: 0,
        productosBajoStock: 0,
        ordenesPendientes: 0
    });
    const [ventasRecientes, setVentasRecientes] = useState([]);
    const [productosTop, setProductosTop] = useState([]);
    const [ventasSemana, setVentasSemana] = useState([]);
    const [inventarioBajo, setInventarioBajo] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const statsRes = await axios.get('http://localhost:8080/reportes/dashboard/stats', { headers });
                setStats(statsRes.data);
            } catch (e) { console.error('Error loading stats', e); }

            try {
                const topProductsRes = await axios.get('http://localhost:8080/reportes/dashboard/top-productos?limit=5', { headers });
                setProductosTop(topProductsRes.data.map(p => ({
                    nombre: p.nombre,
                    cantidad: p.cantidadVendida
                })));
            } catch (e) { console.error('Error loading top products', e); }

            try {
                const weeklySalesRes = await axios.get('http://localhost:8080/reportes/dashboard/ventas-semana', { headers });
                setVentasSemana(weeklySalesRes.data);
            } catch (e) { console.error('Error loading weekly sales', e); }

            try {
                const recentSalesRes = await axios.get('http://localhost:8080/reportes/dashboard/ventas-recientes', { headers });
                setVentasRecientes(recentSalesRes.data);
            } catch (e) { console.error('Error loading recent sales', e); }

            try {
                const inventoryRes = await axios.get('http://localhost:8080/reportes/stock', { headers });
                const lowStock = inventoryRes.data.filter(item => item.cantidad < 10);
                setInventarioBajo(lowStock.slice(0, 5));
            } catch (e) { console.error('Error loading inventory', e); }

            setLoading(false);
        } catch (error) {
            console.error('Error in dashboard initialization:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-xl text-gray-600">Cargando datos del dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Panel de Administración</h2>
                <div className="text-sm text-gray-500">
                    Última actualización: {new Date().toLocaleTimeString('es-PE')}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Ventas Hoy</p>
                            <h3 className="text-2xl font-bold text-gray-800">S/ {stats.ventasHoy.toFixed(2)}</h3>
                            <p className="text-xs text-gray-400 mt-1">{stats.transaccionesHoy} transacciones</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <DollarSign className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Ventas del Mes</p>
                            <h3 className="text-2xl font-bold text-gray-800">S/ {stats.ventasMes.toFixed(2)}</h3>
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" /> +12% vs mes anterior
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Usuarios Activos</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.usuariosActivos}</h3>
                            <p className="text-xs text-gray-400 mt-1">Empleados registrados</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Users className="w-6 h-6 text-secondary" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Alertas de Stock</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.productosBajoStock}</h3>
                            <p className="text-xs text-red-600 mt-1">Productos bajo mínimo</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => navigate('/pos')}
                        className="flex flex-col items-center p-4 bg-primary hover:bg-yellow-500 text-gray-800 rounded-lg transition-colors"
                    >
                        <Plus className="w-8 h-8 mb-2" />
                        <span className="text-sm font-semibold">Nueva Venta</span>
                    </button>
                    <button
                        onClick={() => navigate('/productos')}
                        className="flex flex-col items-center p-4 bg-secondary hover:bg-blue-800 text-white rounded-lg transition-colors"
                    >
                        <Package className="w-8 h-8 mb-2" />
                        <span className="text-sm font-semibold">Productos</span>
                    </button>
                    <button
                        onClick={() => navigate('/ordenes')}
                        className="flex flex-col items-center p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        <ShoppingBag className="w-8 h-8 mb-2" />
                        <span className="text-sm font-semibold">Nueva Orden</span>
                    </button>
                    <button
                        onClick={() => navigate('/reportes')}
                        className="flex flex-col items-center p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                        <FileText className="w-8 h-8 mb-2" />
                        <span className="text-sm font-semibold">Reportes</span>
                    </button>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Ventas de la Semana</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={ventasSemana}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="dia" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="ventas" stroke="#F6B800" strokeWidth={3} name="Ventas (S/)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Products Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Productos Más Vendidos</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={productosTop}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nombre" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="cantidad" fill="#30348C" name="Unidades Vendidas" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Sales Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Ventas Recientes</h3>
                    <button
                        onClick={() => navigate('/reportes')}
                        className="text-sm text-secondary hover:underline"
                    >
                        Ver todas
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(ventasRecientes) && ventasRecientes.map((venta) => (
                                <tr key={venta.idVenta}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{venta.idVenta}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(venta.fecha).toLocaleString('es-PE')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {venta.empleado?.nombres || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                        S/ {venta.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {venta.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {ventasRecientes.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No hay ventas recientes
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Row - Alerts and Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alert */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Inventario Bajo</h3>
                        <button
                            onClick={() => navigate('/inventario')}
                            className="text-sm text-secondary hover:underline"
                        >
                            Ver todo
                        </button>
                    </div>
                    {inventarioBajo.length > 0 ? (
                        <div className="space-y-3">
                            {inventarioBajo.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                                    <div className="flex items-center">
                                        <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.producto?.nombre || 'Producto'}</p>
                                            <p className="text-sm text-gray-500">SKU: {item.producto?.codigoBarras || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-red-600">{item.cantidad}</p>
                                        <p className="text-xs text-gray-500">unidades</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No hay productos con stock bajo</p>
                        </div>
                    )}
                </div>

                {/* Pending Orders */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Órdenes Pendientes</h3>
                        <span className="px-3 py-1 bg-primary text-gray-800 rounded-full text-sm font-semibold">
                            {stats.ordenesPendientes}
                        </span>
                    </div>
                    {stats.ordenesPendientes > 0 ? (
                        <div className="space-y-3">
                            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-primary">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">Órdenes de compra pendientes</p>
                                        <p className="text-sm text-gray-500">Requieren atención</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/ordenes')}
                                        className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-semibold"
                                    >
                                        Revisar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No hay órdenes pendientes</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
