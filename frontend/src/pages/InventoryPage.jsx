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
        item.producto?.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventario por Sucursal</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                    <input
                        type="text"
                        className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Buscar por producto o SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sucursal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredInventory.map((item) => (
                            <tr key={item.idInventario}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.producto?.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.producto?.sku}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sucursal?.nombre}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${item.stockActual < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                                    {item.stockActual}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.stockActual < 10 ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 flex items-center w-fit">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            Bajo Stock
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Normal
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredInventory.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No se encontraron productos en inventario.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryPage;
