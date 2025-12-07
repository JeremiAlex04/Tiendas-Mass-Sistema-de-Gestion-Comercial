import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const InventoryAdjustmentsPage = () => {
    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();

    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        productoId: '',
        sucursalId: user?.sucursalId || 1,
        tipoMovimiento: 'ENTRADA',
        cantidad: 0,
        motivo: ''
    });

    useEffect(() => {
        if (user?.sucursalId) {
            setFormData(prev => ({ ...prev, sucursalId: user.sucursalId }));
        }
    }, [user]);

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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Ajuste de Inventario</h1>

            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                            value={formData.productoId}
                            onChange={e => setFormData({ ...formData, productoId: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Producto</option>
                            {products.map(p => (
                                <option key={p.idProducto} value={p.idProducto}>
                                    {p.codigoBarras} - {p.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="hidden">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal ID</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                            value={formData.sucursalId}
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Movimiento</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                            value={formData.tipoMovimiento}
                            onChange={e => setFormData({ ...formData, tipoMovimiento: e.target.value })}
                        >
                            <option value="ENTRADA">ENTRADA (Agregar Stock)</option>
                            <option value="SALIDA">SALIDA (Reducir Stock)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                            value={formData.cantidad}
                            onChange={e => setFormData({ ...formData, cantidad: e.target.value })}
                            required
                            min="1"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                            value={formData.motivo}
                            onChange={e => setFormData({ ...formData, motivo: e.target.value })}
                            required
                            placeholder="Ej: Corrección de inventario, merma, etc."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center shadow-lg hover:shadow-xl transform active:scale-[0.98]"
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
