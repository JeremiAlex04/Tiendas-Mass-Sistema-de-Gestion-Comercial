import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Check, Truck, FileText } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const PurchaseOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuthStore();
    const [formData, setFormData] = useState({
        proveedorId: '',
        detalles: [] // Simplified for now, just creating empty order or basic logic
    });
    // Mock products for selection in modal
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const { addNotification } = useNotificationStore();

    useEffect(() => {
        fetchOrders();
        fetchSuppliers();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/ordenes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        // Fetch suppliers logic
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/proveedores', { headers: { Authorization: `Bearer ${token}` } });
            setSuppliers(response.data);
        } catch (e) { console.error(e); }
    };

    const fetchProducts = async () => {
        // Fetch products logic
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/productos', { headers: { Authorization: `Bearer ${token}` } });
            setProducts(response.data);
        } catch (e) { console.error(e); }
    };

    const handleCreateOrder = async () => {
        if (!formData.proveedorId || !formData.productoId || !formData.cantidad || !formData.precioCosto) {
            addNotification('Por favor complete todos los campos', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const payload = {
                proveedorId: formData.proveedorId,
                usuarioId: user.idUsuario,
                detalles: [
                    {
                        productoId: formData.productoId,
                        cantidad: parseInt(formData.cantidad),
                        precioCosto: parseFloat(formData.precioCosto)
                    }
                ]
            };
            await axios.post('http://localhost:8080/ordenes', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addNotification('Orden creada correctamente', 'success');
            setShowModal(false);
            setFormData({ proveedorId: '', productoId: '', cantidad: '', precioCosto: '' });
            fetchOrders();
        } catch (error) {
            console.error(error);
            addNotification('Error al crear orden', 'error');
        }
    };

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/ordenes/${id}/aprobar`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addNotification('Orden aprobada', 'success');
            fetchOrders();
        } catch (error) {
            console.error(error);
            addNotification('Error al aprobar orden', 'error');
        }
    };

    const handleReceive = async (id) => {
        try {
            const token = localStorage.getItem('token');
            // Hardcoded sucursalId 1 for demo
            await axios.put(`http://localhost:8080/ordenes/${id}/recibir?sucursalId=1`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addNotification('Mercadería recibida e inventario actualizado', 'success');
            fetchOrders();
        } catch (error) {
            console.error(error);
            addNotification('Error al recibir mercadería', 'error');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Órdenes de Compra</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-gray-900 font-semibold px-4 py-2 rounded-lg flex items-center hover:bg-yellow-500 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Orden
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-secondary text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Proveedor</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.idOrden} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.idOrden}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.proveedor?.razonSocial}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.fechaEmision).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.estado === 'APROBADA' ? 'bg-green-100 text-green-800' :
                                        order.estado === 'RECIBIDA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {user.role === 'ADMINISTRADOR' && order.estado === 'GENERADA' && (
                                        <button onClick={() => handleApprove(order.idOrden)} className="text-green-600 hover:text-green-900 mr-4 transition-colors" title="Aprobar">
                                            <Check className="w-5 h-5" />
                                        </button>
                                    )}
                                    {user.role === 'ALMACENERO' && order.estado === 'APROBADA' && (
                                        <button onClick={() => handleReceive(order.idOrden)} className="text-secondary hover:text-blue-900 transition-colors" title="Recibir Mercadería">
                                            <Truck className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Simplificado */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Nueva Orden de Compra</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" onChange={e => setFormData({ ...formData, proveedorId: e.target.value })} required>
                                    <option value="">Seleccionar Proveedor</option>
                                    {suppliers.map(s => <option key={s.idProveedor} value={s.idProveedor}>{s.razonSocial}</option>)}
                                </select>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Detalle del Producto</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                                        <select
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                                            onChange={e => {
                                                const prod = products.find(p => p.idProducto === parseInt(e.target.value));
                                                setFormData({
                                                    ...formData,
                                                    productoId: e.target.value,
                                                    precioCosto: prod ? prod.precioCompra : ''
                                                });
                                            }}
                                        >
                                            <option value="">Seleccionar Producto</option>
                                            {products.map(p => <option key={p.idProducto} value={p.idProducto}>{p.nombre}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                                                placeholder="0"
                                                onChange={e => setFormData({ ...formData, cantidad: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Costo Unit.</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                                                placeholder="0.00"
                                                value={formData.precioCosto || ''}
                                                onChange={e => setFormData({ ...formData, precioCosto: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                                <button onClick={handleCreateOrder} className="px-4 py-2 bg-secondary text-white font-medium rounded-lg hover:bg-blue-800 transition-colors">Crear Orden</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseOrdersPage;
