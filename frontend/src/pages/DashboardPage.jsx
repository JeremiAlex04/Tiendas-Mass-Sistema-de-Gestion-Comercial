import React from 'react';
import useAuthStore from '../store/authStore';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import CajeroDashboard from '../components/dashboards/CajeroDashboard';
import AlmaceneroDashboard from '../components/dashboards/AlmaceneroDashboard';

const DashboardPage = () => {
    const { user } = useAuthStore();

    if (!user) return <div>Cargando...</div>;

    return (
        <div>
            {user.role === 'ADMINISTRADOR' && <AdminDashboard />}
            {user.role === 'CAJERO' && <CajeroDashboard />}
            {user.role === 'ALMACENERO' && <AlmaceneroDashboard />}

            {!['ADMINISTRADOR', 'CAJERO', 'ALMACENERO'].includes(user.role) && (
                <div className="text-center py-10">
                    <h2 className="text-xl font-bold text-gray-700">Bienvenido, {user.username}</h2>
                    <p className="text-gray-500">Su rol ({user.role}) no tiene un panel configurado.</p>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
