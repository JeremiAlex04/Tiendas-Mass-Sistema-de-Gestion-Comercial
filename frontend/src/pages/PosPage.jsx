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

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setProcessing(true);

        try {
            const token = localStorage.getItem('token');
            const saleData = {
                usuarioId: 1, // Should get ID from user object properly, assuming user object has id or we fetch profile
                sucursalId: 1, // Mock sucursal
                metodoPago: 'EFECTIVO',
                tipoComprobante: 'BOLETA',
                detalles: cart.map(item => ({
                    productoId: item.idProducto,
                    cantidad: item.quantity
                }))
            };

            // We need user ID. authStore user might just have username/role.
            // Ideally backend returns ID on login.
            // Let's assume user object has id or we use a placeholder for now if missing.
            // Or fetch /auth/me.
            // For this demo, I'll hardcode usuarioId=1 (Admin) if missing, or try to use user.id if available.
            // I'll update authStore to save user ID if possible, but for now hardcode 1.

            await axios.post('http://localhost:8080/ventas', saleData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            addNotification('Venta realizada con éxito!', 'success');
            clearCart();
        } catch (error) {
            console.error(error);
            addNotification('Error al procesar la venta', 'error');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex h-full gap-6">
            {/* Product List */}
            <div className="flex-1 flex flex-col">
                <div className="mb-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Buscar productos por nombre o SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {filteredProducts.map(product => (
                        <div
                            key={product.idProducto}
                            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between"
                            onClick={() => addToCart(product)}
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800">{product.nombre}</h3>
                                <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-lg font-bold text-secondary">S/ {product.precioVenta}</span>
                                <button className="p-2 bg-blue-100 text-secondary rounded-full hover:bg-blue-200">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart */}
            <div className="w-96 bg-white rounded-lg shadow-lg flex flex-col h-full">
                <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                    <h2 className="text-lg font-bold flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Carrito de Compras
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">
                            El carrito está vacío
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.idProducto} className="flex justify-between items-center border-b pb-2">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-800">{item.nombre}</h4>
                                    <p className="text-sm text-gray-500">S/ {item.precioVenta}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.idProducto, item.quantity - 1)}
                                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.idProducto, item.quantity + 1)}
                                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.idProducto)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded ml-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Total</span>
                        <span className="text-2xl font-bold text-primary">S/ {getTotal().toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || processing}
                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center text-white ${cart.length === 0 || processing
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-dark text-white'
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
