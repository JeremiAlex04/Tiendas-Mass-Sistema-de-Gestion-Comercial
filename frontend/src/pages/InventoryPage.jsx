import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/inventario/sucursal/1', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInventory(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const filteredInventory = inventory.filter(item =>
        item.producto?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.producto?.codigoBarras.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Inventario por Sucursal</h1>
                <div className="text-sm text-gray-500">
                    Total productos: {filteredInventory.length}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <div className="p-4 border-b bg-gray-50">
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                            placeholder="Buscar por producto o código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-secondary text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Código</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Sucursal</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Stock Actual</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInventory.map((item) => (
                                <tr key={item.idInventario} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.producto?.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.producto?.codigoBarras}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sucursal?.nombre}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${item.cantidad < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                                        {item.cantidad}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {item.cantidad < 10 ? (
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
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
                            {filteredInventory.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron productos en inventario.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;
