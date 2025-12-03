import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useProductStore from '../store/productStore';
import useNotificationStore from '../store/notificationStore';
import { Edit, Trash2, Plus } from 'lucide-react';

const ProductListPage = () => {
    const { products, fetchProducts, loading } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = products.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigoBarras.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        codigoBarras: '', nombre: '', descripcion: '', precioVenta: '', precioCosto: '', stockMinimo: '', categoriaId: '', proveedorId: ''
    });
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const { addNotification } = useNotificationStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [catRes, supRes] = await Promise.all([
                    axios.get('http://localhost:8080/categorias', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/proveedores', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setCategories(catRes.data);
                setSuppliers(supRes.data);
            } catch (e) { console.error(e); }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                categoria: { idCategoria: formData.categoriaId },
                proveedor: { idProveedor: formData.proveedorId },
                estado: 'ACTIVO'
            };
            await axios.post('http://localhost:8080/productos', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addNotification('Producto creado correctamente', 'success');
            setShowModal(false);
            setFormData({ codigoBarras: '', nombre: '', descripcion: '', precioVenta: '', precioCosto: '', stockMinimo: '', categoriaId: '', proveedorId: '' });
            fetchProducts();
        } catch (error) {
            console.error(error);
            addNotification('Error al crear producto', 'error');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-gray-900 font-semibold px-4 py-2 rounded-lg flex items-center hover:bg-yellow-500 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Producto
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <div className="p-4 border-b bg-gray-50">
                    <input
                        type="text"
                        className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Buscar productos por nombre o código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-secondary text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Precio Venta</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Stock Min</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.idProducto} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.codigoBarras}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">S/ {product.precioVenta.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stockMinimo}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-secondary hover:text-blue-900 mr-4 transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button className="text-red-600 hover:text-red-900 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Nuevo Producto */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Producto</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="EAN-13" onChange={e => setFormData({ ...formData, codigoBarras: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="Nombre del producto" onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="Detalles..." onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta</label>
                                    <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="0.00" type="number" step="0.01" onChange={e => setFormData({ ...formData, precioVenta: e.target.value })} required />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio Costo</label>
                                    <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="0.00" type="number" step="0.01" onChange={e => setFormData({ ...formData, precioCosto: e.target.value })} required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="10" type="number" onChange={e => setFormData({ ...formData, stockMinimo: e.target.value })} required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" onChange={e => setFormData({ ...formData, categoriaId: e.target.value })} required>
                                    <option value="">Seleccionar Categoría</option>
                                    {categories.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none" onChange={e => setFormData({ ...formData, proveedorId: e.target.value })} required>
                                    <option value="">Seleccionar Proveedor</option>
                                    {suppliers.map(s => <option key={s.idProveedor} value={s.idProveedor}>{s.razonSocial}</option>)}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-secondary text-white font-medium rounded-lg hover:bg-blue-800 transition-colors">Guardar Producto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductListPage;
