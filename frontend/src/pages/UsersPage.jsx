import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, User } from 'lucide-react';
import useNotificationStore from '../store/notificationStore';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nombres: '', apellidos: '', email: '', username: '', passwordHash: '', role: 'CAJERO'
    });

    const { addNotification } = useNotificationStore();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/usuarios', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            addNotification('Error al cargar usuarios', 'error');
            setLoading(false);
        }
    };

    const [editingId, setEditingId] = useState(null);

    const handleEdit = (user) => {
        setFormData({
            nombres: user.nombres,
            apellidos: user.apellidos,
            email: user.email,
            username: user.username,
            passwordHash: '', // Keep empty to not change
            role: user.rol?.nombre || 'CAJERO',
            estado: user.estado || 'ACTIVO'
        });
        setEditingId(user.idUsuario);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/usuarios/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addNotification('Usuario eliminado correctamente', 'success');
            fetchUsers();
        } catch (error) {
            console.error(error);
            addNotification('Error al eliminar usuario', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let roleId = 2; // CAJERO
            if (formData.role === 'ADMIN') roleId = 1;
            if (formData.role === 'ALMACENERO') roleId = 3;

            const payload = {
                ...formData,
                rol: { idRol: roleId }
            };

            if (editingId) {
                await axios.put(`http://localhost:8080/usuarios/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                addNotification('Usuario actualizado correctamente', 'success');
            } else {
                await axios.post('http://localhost:8080/usuarios', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                addNotification('Usuario creado correctamente', 'success');
            }

            setShowModal(false);
            setEditingId(null);
            setFormData({ nombres: '', apellidos: '', email: '', username: '', passwordHash: '', role: 'CAJERO', estado: 'ACTIVO' });
            fetchUsers();
        } catch (error) {
            console.error(error);
            addNotification('Error al guardar usuario', 'error');
        }
    };

    const openNewModal = () => {
        setFormData({ nombres: '', apellidos: '', email: '', username: '', passwordHash: '', role: 'CAJERO', estado: 'ACTIVO' });
        setEditingId(null);
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
                <button
                    onClick={openNewModal}
                    className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center hover:bg-secondary-dark"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Usuario
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.idUsuario}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                                    <User className="w-4 h-4 mr-2 text-gray-400" />
                                    {user.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.nombres} {user.apellidos}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.rol?.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(user.idUsuario)} className="text-red-600 hover:text-red-900">
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
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Password (dejar vacío si no cambia)" type="password" value={formData.passwordHash} onChange={e => setFormData({ ...formData, passwordHash: e.target.value })} />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Nombres" value={formData.nombres} onChange={e => setFormData({ ...formData, nombres: e.target.value })} required />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Apellidos" value={formData.apellidos} onChange={e => setFormData({ ...formData, apellidos: e.target.value })} required />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            <select className="w-full mb-2 p-2 border rounded" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option value="CAJERO">Cajero</option>
                                <option value="ALMACENERO">Almacenero</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                            <select className="w-full mb-4 p-2 border rounded" value={formData.estado} onChange={e => setFormData({ ...formData, estado: e.target.value })}>
                                <option value="ACTIVO">Activo</option>
                                <option value="INACTIVO">Inactivo</option>
                            </select>
                            <div className="flex justify-end gap-2">
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

export default UsersPage;
