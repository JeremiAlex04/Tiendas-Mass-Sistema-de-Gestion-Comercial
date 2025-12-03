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
            // Adjust dates to cover full days
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            const response = await axios.get(`http://localhost:8080/reportes/ventas`, {
                params: {
                    inicio: start.toISOString(),
                    fin: end.toISOString()
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            setSales(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            // Removed mock data to ensure real data usage
            setSales([]);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Reporte de Ventas</h1>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                        <input
                            type="date"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                        <input
                            type="date"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={fetchSales}
                        className="bg-primary text-gray-900 font-semibold px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center shadow-sm"
                    >
                        <Calendar className="w-5 h-5 mr-2" />
                        Generar Reporte
                    </button>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center ml-auto shadow-sm">
                        <Download className="w-5 h-5 mr-2" />
                        Exportar Excel
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-secondary text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">ID Venta</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Método Pago</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sales.map((venta) => (
                            <tr key={venta.idVenta} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{venta.idVenta}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(venta.fecha).toLocaleString('es-PE')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.metodoPago}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">S/ {venta.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${venta.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {venta.estado}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {sales.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    Selecciona un rango de fechas para generar el reporte.
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
