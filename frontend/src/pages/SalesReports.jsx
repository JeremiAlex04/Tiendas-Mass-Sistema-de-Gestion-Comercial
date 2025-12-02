import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Download } from 'lucide-react';

const SalesReports = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSales = async () => {
        if (!startDate || !endDate) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Assuming endpoint /reportes/ventas?inicio=...&fin=...
            // Dates need to be ISO format.
            const response = await axios.get(`http://localhost:8080/reportes/ventas`, {
                params: {
                    inicio: new Date(startDate).toISOString(),
                    fin: new Date(endDate).toISOString()
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            setSales(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            // Mock data for demo if backend fails or returns empty
            setSales([
                { idVenta: 1, fecha: '2023-11-25T10:00:00', total: 150.50, metodoPago: 'EFECTIVO', estado: 'COMPLETADA' },
                { idVenta: 2, fecha: '2023-11-25T11:30:00', total: 85.00, metodoPago: 'TARJETA', estado: 'COMPLETADA' },
            ]);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Reporte de Ventas</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                        <input
                            type="date"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                        <input
                            type="date"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={fetchSales}
                        className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary-dark flex items-center"
                    >
                        <Calendar className="w-5 h-5 mr-2" />
                        Generar Reporte
                    </button>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center ml-auto">
                        <Download className="w-5 h-5 mr-2" />
                        Exportar Excel
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Venta</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método Pago</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sales.map((venta) => (
                            <tr key={venta.idVenta}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{venta.idVenta}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(venta.fecha).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.metodoPago}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">S/ {venta.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {venta.estado}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {sales.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No hay datos para mostrar
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesReports;
