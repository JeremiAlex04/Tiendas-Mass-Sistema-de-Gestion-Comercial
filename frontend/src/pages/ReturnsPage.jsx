import React, { useState } from 'react';
import axios from 'axios';
import { Search, RotateCcw, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const ReturnsPage = () => {
    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();

    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    React.useEffect(() => {
        if (showHistory) {
            fetchHistory();
        }
    }, [showHistory]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/devoluciones', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(response.data);
        } catch (error) {
            console.error(error);
            addNotification('Error al cargar historial', 'error');
        }
    };

    const [searchId, setSearchId] = useState('');
    const [venta, setVenta] = useState(null);
    const [selectedItems, setSelectedItems] = useState({});
    const [motivo, setMotivo] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSearch = async () => {
        if (!searchId) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/ventas/${searchId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVenta(response.data);
            setSelectedItems({});
        } catch (error) {
            console.error(error);
            addNotification('Venta no encontrada', 'error');
            setVenta(null);
        }
    };

    const handleQuantityChange = (productoId, max, val) => {
        const qty = parseInt(val) || 0;
        if (qty < 0) return;
        if (qty > max) {
            addNotification('No puede devolver más de lo comprado', 'warning');
            return;
        }

        setSelectedItems(prev => {
            const copy = { ...prev };
            if (qty === 0) delete copy[productoId];
            else copy[productoId] = qty;
            return copy;
        });
    };

    const handleSubmit = async () => {
        if (Object.keys(selectedItems).length === 0) {
            addNotification('Seleccione al menos un producto para devolver', 'warning');
            return;
        }
        if (!motivo) {
            addNotification('Debe ingresar un motivo', 'warning');
            return;
        }

        setProcessing(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ventaId: venta.idVenta,
                empleadoId: user.idUsuario,
                motivo: motivo,
                detalles: Object.entries(selectedItems).map(([pid, qty]) => ({
                    productoId: parseInt(pid),
                    cantidad: qty
                }))
            };

            await axios.post('http://localhost:8080/devoluciones', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            addNotification('Devolución procesada exitosamente', 'success');
            setVenta(null);
            setSearchId('');
            setMotivo('');
            setSelectedItems({});
        } catch (error) {
            console.error(error);
            addNotification('Error al procesar devolución', 'error');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Package className="mr-3 h-8 w-8 text-secondary" />
                    Devoluciones y Reembolsos
                </h1>
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-secondary font-medium hover:underline"
                >
                    {showHistory ? 'Nueva Devolución' : 'Ver Historial'}
                </button>
            </div>

            {showHistory ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venta Original</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Reembolsado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {history.map((dev) => (
                                <tr key={dev.idDevolucion}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{dev.idDevolucion}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Venta #{dev.idVenta}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(dev.fecha).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{dev.motivo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">S/ {dev.totalReembolsado.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <>
                    {/* Buscador */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Venta por ID</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="number"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                                    placeholder="Ej: 1001"
                                    value={searchId}
                                    onChange={e => setSearchId(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-secondary text-white px-6 py-2.5 rounded-lg hover:bg-blue-800 transition-colors font-medium"
                        >
                            Buscar
                        </button>
                    </div>

                    {/* Resultados y Formulario */}
                    {venta && (
                        <div className="bg-white p-6 rounded-lg shadow-md flex-1 overflow-auto">
                            <div className="flex justify-between items-start mb-6 border-b pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Venta #{venta.idVenta}</h2>
                                    <p className="text-gray-500 text-sm">Fecha: {new Date(venta.fecha).toLocaleString()}</p>
                                    <p className="text-gray-500 text-sm">Cliente: {venta.idCliente || 'Genérico'}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${venta.estado === 'COMPLETADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {venta.estado}
                                    </span>
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-700 mb-3">Seleccione productos a devolver:</h3>
                            <div className="border rounded-lg overflow-hidden mb-6">
                                <table className="w-full text-left bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Cant. Vendida</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Precio Unit.</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Cant. a Devolver</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {venta.detalles.map((det) => (
                                            <tr key={det.producto.idProducto}>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                    {det.producto.nombre}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 text-right">
                                                    {det.cantidad}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 text-right">
                                                    S/ {det.precioUnitario.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={det.cantidad}
                                                        className="w-20 text-center border rounded p-1 focus:ring-secondary focus:outline-none"
                                                        value={selectedItems[det.producto.idProducto] || 0}
                                                        onChange={(e) => handleQuantityChange(det.producto.idProducto, det.cantidad, e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de la Devolución</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none h-24"
                                    placeholder="Ej: Producto dañado, Vencido, Cambio de opinión..."
                                    value={motivo}
                                    onChange={e => setMotivo(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <button
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className={`flex items-center px-6 py-3 rounded-lg font-bold text-white transition-colors ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    <AlertTriangle className="mr-2 h-5 w-5" />
                                    {processing ? 'Procesando...' : 'Confirmar Devolución'}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ReturnsPage;
