import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, RotateCcw, FileText } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

const CajeroDashboard = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({ ventasHoy: 0, transaccionesHoy: 0 });

    useEffect(() => {
        if (user && user.idUsuario) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/reportes/dashboard/cajero?usuarioId=${user.idUsuario}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching cashier stats:", error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Caja</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Quick Action: New Sale */}
                <Link to="/pos" className="bg-primary hover:bg-primary-dark text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-colors">
                    <ShoppingCart className="w-12 h-12 mb-4" />
                    <span className="text-xl font-bold">Nueva Venta (POS)</span>
                </Link>

                {/* Quick Action: My Sales */}
                <Link to="/mis-ventas" className="bg-white hover:bg-gray-50 text-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-200 transition-colors">
                    <FileText className="w-12 h-12 mb-4 text-secondary" />
                    <span className="text-xl font-bold">Mis Ventas</span>
                </Link>

                {/* Quick Action: Returns (Placeholder) */}
                <div className="bg-white text-gray-400 p-6 rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-200 cursor-not-allowed">
                    <RotateCcw className="w-12 h-12 mb-4" />
                    <span className="text-xl font-bold">Devoluciones (Pronto)</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen de Hoy ({user?.username})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-500">Ventas Realizadas</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.transaccionesHoy}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-500">Total Recaudado</p>
                        <p className="text-2xl font-bold text-green-600">S/ {(stats.ventasHoy || 0).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CajeroDashboard;
