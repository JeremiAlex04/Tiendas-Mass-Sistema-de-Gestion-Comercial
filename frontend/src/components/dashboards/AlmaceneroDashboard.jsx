import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ClipboardList, AlertTriangle } from 'lucide-react';

const AlmaceneroDashboard = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Almacén</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link to="/inventario" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <Package className="w-8 h-8 text-secondary mr-4" />
                        <div>
                            <h3 className="font-bold text-gray-800">Inventario</h3>
                            <p className="text-sm text-gray-500">Ver stock actual</p>
                        </div>
                    </div>
                </Link>

                <Link to="/ordenes" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
                    <div className="flex items-center">
                        <Truck className="w-8 h-8 text-green-600 mr-4" />
                        <div>
                            <h3 className="font-bold text-gray-800">Órdenes Compra</h3>
                            <p className="text-sm text-gray-500">Gestionar pedidos</p>
                        </div>
                    </div>
                </Link>

                <Link to="/ajustes" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-500">
                    <div className="flex items-center">
                        <ClipboardList className="w-8 h-8 text-orange-600 mr-4" />
                        <div>
                            <h3 className="font-bold text-gray-800">Ajustes</h3>
                            <p className="text-sm text-gray-500">Entradas/Salidas</p>
                        </div>
                    </div>
                </Link>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                    <div className="flex items-center">
                        <AlertTriangle className="w-8 h-8 text-red-600 mr-4" />
                        <div>
                            <h3 className="font-bold text-gray-800">Alertas</h3>
                            <p className="text-sm text-gray-500">0 Productos bajos</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Órdenes Pendientes de Recepción</h3>
                    <p className="text-gray-500">No hay órdenes pendientes.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Movimientos Recientes</h3>
                    <p className="text-gray-500">No hay movimientos recientes.</p>
                </div>
            </div>
        </div>
    );
};

export default AlmaceneroDashboard;
