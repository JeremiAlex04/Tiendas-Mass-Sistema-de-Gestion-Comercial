import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, User } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nombres: '', apellidos: '', email: '', username: '', passwordHash: '', role: 'CAJERO', estado: 'ACTIVO'
    });

    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/empleados', {
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
            nombres: user.nombres || '',
            apellidos: user.apellidos || '',
            email: user.email || '',
            username: user.usuario,
            passwordHash: '', // Keep empty to not change
            role: user.rol || 'CAJERO',
            estado: 'ACTIVO' // Not in entity
        });
        setEditingId(user.idEmpleado);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/empleados/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addNotification('Usuario eliminado correctamente', 'success');
            fetchUsers();
        } catch (error) {
            console.error(error);
            addNotification('Error al eliminar usuario: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                usuario: formData.username,
                password: formData.passwordHash,
                nombres: formData.nombres,
                apellidos: formData.apellidos,
                email: formData.email,
                rol: formData.role,
                sucursal: { idSucursal: user.sucursalId || 1 },
                fechaIngreso: new Date().toISOString().split('T')[0]
            };

            if (editingId) {
                await axios.put(`http://localhost:8080/empleados/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                addNotification('Usuario actualizado correctamente', 'success');
            } else {
                await axios.post('http://localhost:8080/empleados', payload, {
                    params: { adminId: user.idUsuario },
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
            addNotification('Error al guardar usuario: ' + (error.response?.data?.message || error.message), 'error');
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
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
                <button
                    onClick={openNewModal}
                    className="bg-primary text-gray-900 font-semibold px-4 py-2 rounded-lg flex items-center hover:bg-yellow-500 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Usuario
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-secondary text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Nombre Completo</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.idEmpleado} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                                    <User className="w-4 h-4 mr-2 text-gray-400" />
                                    {user.usuario}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.nombres} {user.apellidos}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${user.rol === 'ADMINISTRADOR' ? 'bg-purple-100 text-purple-800' :
                                            user.rol === 'ALMACENERO' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {user.rol}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(user)} className="text-secondary hover:text-blue-900 mr-4 transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(user.idEmpleado)} className="text-red-600 hover:text-red-900 transition-colors">
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" placeholder={editingId ? "Dejar vacío para mantener" : "Contraseña"} type="password" value={formData.passwordHash} onChange={e => setFormData({ ...formData, passwordHash: e.target.value })} required={!editingId} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="Nombres" value={formData.nombres} onChange={e => setFormData({ ...formData, nombres: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="Apellidos" value={formData.apellidos} onChange={e => setFormData({ ...formData, apellidos: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="CAJERO">Cajero</option>
                                    <option value="ALMACENERO">Almacenero</option>
                                    <option value="ADMINISTRADOR">Administrador</option>
                                </select>
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

export default UsersPage;
