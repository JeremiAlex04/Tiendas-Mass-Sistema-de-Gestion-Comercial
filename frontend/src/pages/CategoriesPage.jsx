import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Tag } from 'lucide-react';
import useNotificationStore from '../store/notificationStore';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
    const [editingId, setEditingId] = useState(null);

    const { addNotification } = useNotificationStore();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/categorias', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            addNotification('Error al cargar categorías', 'error');
            setLoading(false);
        }
    };

    const handleEdit = (category) => {
        setFormData({
            nombre: category.nombre,
            descripcion: category.descripcion || ''
        });
        setEditingId(category.idCategoria);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar esta categoría?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/categorias/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addNotification('Categoría eliminada correctamente', 'success');
            fetchCategories();
        } catch (error) {
            console.error(error);
            addNotification('Error al eliminar categoría', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingId) {
                await axios.put(`http://localhost:8080/categorias/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                addNotification('Categoría actualizada correctamente', 'success');
            } else {
                await axios.post('http://localhost:8080/categorias', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                addNotification('Categoría creada correctamente', 'success');
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ nombre: '', descripcion: '' });
            fetchCategories();
        } catch (error) {
            console.error(error);
            addNotification('Error al guardar categoría', 'error');
        }
    };

    const openNewModal = () => {
        setFormData({ nombre: '', descripcion: '' });
        setEditingId(null);
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Categorías</h1>
                <button
                    onClick={openNewModal}
                    className="bg-primary text-gray-900 font-semibold px-4 py-2 rounded-lg flex items-center hover:bg-yellow-500 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Categoría
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-secondary text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Descripción</th>
                            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.idCategoria} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                                    <Tag className="w-4 h-4 mr-2 text-secondary" />
                                    {category.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {category.descripcion}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(category)} className="text-secondary hover:text-blue-900 mr-4 transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(category.idCategoria)} className="text-red-600 hover:text-red-900 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                                    placeholder="Nombre de la categoría"
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                                    placeholder="Descripción opcional"
                                    value={formData.descripcion}
                                    onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-secondary text-white font-medium rounded-lg hover:bg-blue-800 transition-colors">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
