import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const InventoryAdjustmentsPage = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        productoId: '',
        sucursalId: 1, // Default to main branch for now
        tipoMovimiento: 'ENTRADA',
        cantidad: 0,
        motivo: ''
    });

    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/productos', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(response.data);
            } catch (error) {
                console.error(error);
                addNotification('Error al cargar productos', 'error');
            }
        };
        fetchProducts();
    }, [addNotification]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8080/inventario/ajuste`, null, {
                params: { ...formData, usuarioId: user.idUsuario },
                headers: { Authorization: `Bearer ${token}` }
            });
            addNotification('Ajuste realizado con éxito', 'success');
            setFormData({ ...formData, cantidad: 0, motivo: '' });
        } catch (error) {
            console.error(error);
            addNotification('Error al realizar ajuste', 'error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Ajuste de Inventario</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Producto</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={formData.productoId}
                            onChange={e => setFormData({ ...formData, productoId: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Producto</option>
                            {products.map(p => (
                                <option key={p.idProducto} value={p.idProducto}>
                                    {p.sku} - {p.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sucursal ID hidden or read-only if single branch */}
                    <div className="mb-4 hidden">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Sucursal ID</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded bg-gray-100"
                            value={formData.sucursalId}
                            readOnly
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tipo Movimiento</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={formData.tipoMovimiento}
                            onChange={e => setFormData({ ...formData, tipoMovimiento: e.target.value })}
                        >
                            <option value="ENTRADA">ENTRADA</option>
                            <option value="SALIDA">SALIDA</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Cantidad</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded"
                            value={formData.cantidad}
                            onChange={e => setFormData({ ...formData, cantidad: e.target.value })}
                            required
                            min="1"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Motivo</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={formData.motivo}
                            onChange={e => setFormData({ ...formData, motivo: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-secondary text-white py-2 px-4 rounded hover:bg-secondary-dark flex items-center justify-center"
                    >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Registrar Ajuste
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InventoryAdjustmentsPage;
