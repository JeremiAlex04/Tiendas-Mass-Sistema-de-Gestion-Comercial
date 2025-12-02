import React from 'react';
import useAuthStore from '../store/authStore';

const Header = () => {
    const { user } = useAuthStore();

    return (
        <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Bienvenido, {user?.username}
                </h2>
                <div className="flex items-center">
                    <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                        {user?.role}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;
