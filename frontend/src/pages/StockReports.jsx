import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, AlertTriangle, CheckCircle, Download } from 'lucide-react';

const StockReports = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/reportes/stock', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInventory(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Reporte de Stock</h1>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex justify-between items-center">
                <div className="flex gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg flex items-center border border-blue-100">
                        <Package className="w-8 h-8 text-secondary mr-3" />
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Productos</p>
                            <p className="text-2xl font-bold text-gray-800">{inventory.length}</p>
                        </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg flex items-center border border-red-100">
                        <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Bajo Stock</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {inventory.filter(item => item.cantidad <= item.producto.stockMinimo).length}
                            </p>
                        </div>
                    </div>
                </div>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-sm">
                    <Download className="w-5 h-5 mr-2" />
                    Exportar Excel
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-secondary text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Sucursal</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Stock Actual</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.map((item) => (
                            <tr key={item.idInventario} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{item.producto.nombre}</div>
                                    <div className="text-sm text-gray-500">Código: {item.producto.codigoBarras}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.sucursal.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-sm font-bold ${item.cantidad <= item.producto.stockMinimo ? 'text-red-600' : 'text-gray-900'}`}>
                                        {item.cantidad}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.cantidad <= item.producto.stockMinimo ? (
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                            Bajo Stock
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Normal
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockReports;
