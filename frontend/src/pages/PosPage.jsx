import React, { useEffect, useState } from 'react';
import useProductStore from '../store/productStore';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import axios from 'axios';

const PosPage = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal } = useCartStore();
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [processing, setProcessing] = useState(false);
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = products.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [showReceipt, setShowReceipt] = useState(false);
    const [lastSale, setLastSale] = useState(null);

    // Cash Management State
    const [cajaAbierta, setCajaAbierta] = useState(false);
    const [showOpenCaja, setShowOpenCaja] = useState(false);
    const [showCloseCaja, setShowCloseCaja] = useState(false);
    const [montoInicial, setMontoInicial] = useState('');
    const [montoFinal, setMontoFinal] = useState('');
    const [cajaDetails, setCajaDetails] = useState(null);

    useEffect(() => {
        checkCajaStatus();
    }, [user]);

    const checkCajaStatus = async () => {
        if (!user?.idUsuario) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/caja/estado?empleadoId=${user.idUsuario}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.estado === 'ABIERTA') {
                setCajaAbierta(true);
                setCajaDetails(response.data);
            } else {
                setCajaAbierta(false);
                setShowOpenCaja(true); // Prompt to open if closed
            }
        } catch (error) {
            console.error('Error checking caja status:', error);
        }
    };

    const handleOpenCaja = async () => {
        if (!montoInicial) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/caja/abrir', {
                empleadoId: user.idUsuario,
                sucursalId: 1,
                montoInicial: parseFloat(montoInicial)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            addNotification('Caja abierta correctamente', 'success');
            setCajaAbierta(true);
            setShowOpenCaja(false);
            checkCajaStatus();
        } catch (error) {
            console.error(error);
            addNotification('Error al abrir la caja', 'error');
        }
    };

    const handleCloseCaja = async () => {
        if (!montoFinal) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/caja/cerrar', {
                empleadoId: user.idUsuario,
                montoFinal: parseFloat(montoFinal)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const cierre = response.data;
            addNotification(`Caja cerrada. Diferencia: S/ ${cierre.diferencia}`, cierre.diferencia === 0 ? 'success' : 'warning');
            setCajaAbierta(false);
            setShowCloseCaja(false);
            setCajaDetails(null);
            // Optionally redirect or show summary
        } catch (error) {
            console.error(error);
            addNotification('Error al cerrar la caja', 'error');
        }
    };

    const handleCheckout = async () => {
        if (!cajaAbierta) {
            addNotification('Debe abrir la caja antes de realizar ventas', 'error');
            setShowOpenCaja(true);
            return;
        }
        if (cart.length === 0) return;
        setProcessing(true);

        try {
            const token = localStorage.getItem('token');
            const saleData = {
                usuarioId: user?.idUsuario,
                sucursalId: 1, // Mock sucursal - ideally should come from user profile too
                metodoPago: 'EFECTIVO',
                tipoComprobante: 'BOLETA',
                detalles: cart.map(item => ({
                    productoId: item.idProducto,
                    cantidad: item.quantity
                }))
            };

            const response = await axios.post('http://localhost:8080/ventas', saleData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setLastSale({
                ...response.data,
                items: [...cart], // Keep cart items for the receipt
                total: getTotal()
            });
            setShowReceipt(true);
            addNotification('Venta realizada con éxito!', 'success');
            // Don't clear cart yet, wait for receipt close
        } catch (error) {
            console.error(error);
            addNotification('Error al procesar la venta', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const closeReceipt = () => {
        setShowReceipt(false);
        setLastSale(null);
        clearCart();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex h-full gap-6 relative">
            {/* Open Caja Modal */}
            {showOpenCaja && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Apertura de Caja</h2>
                        <p className="text-gray-600 mb-4">Ingrese el monto inicial en efectivo para comenzar el turno.</p>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monto Inicial (S/)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                value={montoInicial}
                                onChange={(e) => setMontoInicial(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <button
                            onClick={handleOpenCaja}
                            className="w-full bg-primary text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors"
                        >
                            Abrir Caja
                        </button>
                    </div>
                </div>
            )}

            {/* Close Caja Modal */}
            {showCloseCaja && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cierre de Caja</h2>
                        <p className="text-gray-600 mb-4">Cuente el dinero en efectivo e ingrese el total.</p>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monto Final (S/)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                value={montoFinal}
                                onChange={(e) => setMontoFinal(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCloseCaja(false)}
                                className="flex-1 bg-gray-200 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCloseCaja}
                                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Cerrar Caja
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {showReceipt && lastSale && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:bg-white print:inset-0 print:absolute print:items-start print:justify-start">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto print:shadow-none print:w-full print:h-auto print:overflow-visible">
                        <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">TIENDA MASS</h2>
                            <p className="text-sm text-gray-500">RUC: 20123456789</p>
                            <p className="text-sm text-gray-500">Av. Principal 123, Lima</p>
                            <p className="text-sm text-gray-500 mt-2">Ticket de Venta: #{lastSale.idVenta}</p>
                            <p className="text-xs text-gray-400">{new Date().toLocaleString('es-PE')}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            {lastSale.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <div>
                                        <p className="font-medium text-gray-800">{item.nombre}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} x S/ {item.precioVenta.toFixed(2)}</p>
                                    </div>
                                    <p className="font-medium text-gray-800">S/ {(item.quantity * item.precioVenta).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4 mb-6">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>TOTAL</span>
                                <span>S/ {lastSale.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                                <span>Método de Pago</span>
                                <span>EFECTIVO</span>
                            </div>
                        </div>

                        <div className="text-center text-xs text-gray-400 mb-6">
                            <p>¡Gracias por su compra!</p>
                            <p>Conserve este ticket para reclamos.</p>
                        </div>

                        <div className="flex gap-3 print:hidden">
                            <button
                                onClick={handlePrint}
                                className="flex-1 bg-secondary text-white py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium"
                            >
                                Imprimir
                            </button>
                            <button
                                onClick={closeReceipt}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product List */}
            <div className="flex-1 flex flex-col">
                <div className="mb-4 flex justify-between items-center">
                    <div className="relative flex-1 mr-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="Buscar productos por nombre o código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {cajaAbierta && (
                        <button
                            onClick={() => setShowCloseCaja(true)}
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold whitespace-nowrap"
                        >
                            Cerrar Caja
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {filteredProducts.map(product => (
                        <div
                            key={product.idProducto}
                            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between border-l-4 border-transparent hover:border-secondary"
                            onClick={() => addToCart(product)}
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800">{product.nombre}</h3>
                                <p className="text-sm text-gray-500 mb-2">Código: {product.codigoBarras}</p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-lg font-bold text-secondary">S/ {product.precioVenta.toFixed(2)}</span>
                                <button className="p-2 bg-blue-50 text-secondary rounded-full hover:bg-blue-100 transition-colors">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart */}
            <div className="w-96 bg-white rounded-lg shadow-lg flex flex-col h-full border border-gray-100">
                <div className="p-4 border-b bg-secondary text-white rounded-t-lg">
                    <h2 className="text-lg font-bold flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Carrito de Compras
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
                            <p>El carrito está vacío</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.idProducto} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-800">{item.nombre}</h4>
                                    <p className="text-sm text-gray-500">S/ {item.precioVenta.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.idProducto, item.quantity - 1)}
                                        className="p-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-600"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center font-medium text-gray-800">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.idProducto, item.quantity + 1)}
                                        className="p-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-600"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.idProducto)}
                                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded ml-1 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t bg-gray-50 rounded-b-lg">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-600 font-medium">Total a Pagar</span>
                        <span className="text-3xl font-bold text-secondary">S/ {getTotal().toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || processing}
                        className={`w-full py-4 rounded-lg font-bold flex items-center justify-center transition-all transform active:scale-[0.98] ${cart.length === 0 || processing
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary hover:bg-yellow-500 text-gray-900 shadow-lg hover:shadow-xl'
                            }`}
                    >
                        <CreditCard className="w-5 h-5 mr-2" />
                        {processing ? 'Procesando...' : 'Completar Venta'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PosPage;
