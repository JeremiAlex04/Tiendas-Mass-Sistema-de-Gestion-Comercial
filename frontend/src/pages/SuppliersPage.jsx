import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Truck } from 'lucide-react';
import useNotificationStore from '../store/notificationStore';

const SuppliersPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        razonSocial: '', ruc: '', telefono: '', email: ''
    });

    const { addNotification } = useNotificationStore();

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/proveedores', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuppliers(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            addNotification('Error al cargar proveedores', 'error');
            setLoading(false);
        }
    };

    const [editingId, setEditingId] = useState(null);

    const handleEdit = (supplier) => {
        setFormData({
            razonSocial: supplier.razonSocial,
            ruc: supplier.ruc,
            telefono: supplier.telefono,
            email: supplier.email
        });
        setEditingId(supplier.idProveedor);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este proveedor?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/proveedores/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addNotification('Proveedor eliminado correctamente', 'success');
            fetchSuppliers();
        } catch (error) {
            console.error(error);
            addNotification('Error al eliminar proveedor', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingId) {
                await axios.put(`http://localhost:8080/proveedores/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                addNotification('Proveedor actualizado correctamente', 'success');
            } else {
                await axios.post('http://localhost:8080/proveedores', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                addNotification('Proveedor creado correctamente', 'success');
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ razonSocial: '', ruc: '', telefono: '', email: '' });
            fetchSuppliers();
        } catch (error) {
            console.error(error);
            addNotification('Error al guardar proveedor', 'error');
        }
    };

    const openNewModal = () => {
        setFormData({ razonSocial: '', ruc: '', telefono: '', email: '' });
        setEditingId(null);
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Proveedores</h1>
                <button
                    onClick={openNewModal}
                    className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center hover:bg-secondary-dark"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Proveedor
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razón Social</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUC</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {suppliers.map((supplier) => (
                            <tr key={supplier.idProveedor}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                                    <Truck className="w-4 h-4 mr-2 text-gray-400" />
                                    {supplier.razonSocial}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.ruc}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.telefono}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(supplier)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(supplier.idProveedor)} className="text-red-600 hover:text-red-900">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Simplificado */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Razón Social" value={formData.razonSocial} onChange={e => setFormData({ ...formData, razonSocial: e.target.value })} required />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="RUC" value={formData.ruc} onChange={e => setFormData({ ...formData, ruc: e.target.value })} required />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Teléfono" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuppliersPage;
