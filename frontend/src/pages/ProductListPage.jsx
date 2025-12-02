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
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        sku: '', nombre: '', descripcion: '', precioVenta: '', precioCosto: '', stockMinimo: '', categoriaId: '', proveedorId: ''
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
            setFormData({ sku: '', nombre: '', descripcion: '', precioVenta: '', precioCosto: '', stockMinimo: '', categoriaId: '', proveedorId: '' });
            fetchProducts();
        } catch (error) {
            console.error(error);
            addNotification('Error al crear producto', 'error');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center hover:bg-secondary-dark"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Producto
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                    <input
                        type="text"
                        className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Venta</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Min</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.idProducto}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">S/ {product.precioVenta}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stockMinimo}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button className="text-red-600 hover:text-red-900">
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
                    <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Nuevo Producto</h2>
                        <form onSubmit={handleSubmit}>
                            <input className="w-full mb-2 p-2 border rounded" placeholder="SKU" onChange={e => setFormData({ ...formData, sku: e.target.value })} required />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Nombre" onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                            <textarea className="w-full mb-2 p-2 border rounded" placeholder="Descripción" onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
                            <div className="flex gap-2 mb-2">
                                <input className="w-1/2 p-2 border rounded" placeholder="Precio Venta" type="number" step="0.01" onChange={e => setFormData({ ...formData, precioVenta: e.target.value })} required />
                                <input className="w-1/2 p-2 border rounded" placeholder="Precio Costo" type="number" step="0.01" onChange={e => setFormData({ ...formData, precioCosto: e.target.value })} required />
                            </div>
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Stock Mínimo" type="number" onChange={e => setFormData({ ...formData, stockMinimo: e.target.value })} required />

                            <select className="w-full mb-2 p-2 border rounded" onChange={e => setFormData({ ...formData, categoriaId: e.target.value })} required>
                                <option value="">Seleccionar Categoría</option>
                                {categories.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
                            </select>

                            <select className="w-full mb-4 p-2 border rounded" onChange={e => setFormData({ ...formData, proveedorId: e.target.value })} required>
                                <option value="">Seleccionar Proveedor</option>
                                {suppliers.map(s => <option key={s.idProveedor} value={s.idProveedor}>{s.razonSocial}</option>)}
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

export default ProductListPage;
