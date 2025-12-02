import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import { Lock, User } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useAuthStore((state) => state.login);
    const addNotification = useNotificationStore((state) => state.addNotification);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            addNotification('Inicio de sesión exitoso', 'success');
            navigate('/dashboard');
        } else {
            addNotification('Credenciales incorrectas', 'error');
        }
    };

    return (
        <div className="p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary">Tienda Mass</h1>
                <p className="text-gray-500 mt-2">Sistema de Gestión Comercial</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Usuario</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese su usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-secondary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
