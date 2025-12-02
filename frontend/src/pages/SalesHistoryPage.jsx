import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, DollarSign, FileText } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const SalesHistoryPage = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const token = localStorage.getItem('token');
            // If Admin, maybe show all? But this page is specifically "My Sales" for Cajero usually.
            // Admin has Reports page.
            const response = await axios.get(`http://localhost:8080/ventas/mis-ventas?usuarioId=${user.idUsuario}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSales(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            addNotification('Error al cargar historial de ventas', 'error');
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Ventas</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Venta</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método Pago</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sales.map((sale) => (
                            <tr key={sale.idVenta}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{sale.idVenta}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                    {new Date(sale.fecha).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                    S/ {sale.total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.metodoPago}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sale.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {sale.estado}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesHistoryPage;
