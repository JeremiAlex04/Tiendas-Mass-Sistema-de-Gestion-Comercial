import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import SuppliersPage from './pages/SuppliersPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import InventoryAdjustmentsPage from './pages/InventoryAdjustmentsPage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationToast from './components/ui/NotificationToast';

// Placeholder pages
import PosPage from './pages/PosPage';
import ProductListPage from './pages/ProductListPage';
import CategoriesPage from './pages/CategoriesPage';
import InventoryPage from './pages/InventoryPage';
import ReportsPage from './pages/SalesReports';
import StockReports from './pages/StockReports';
import ReturnsPage from './pages/ReturnsPage';



function App() {
  return (
    <Router>
      <NotificationToast />
      <Routes>
        {/* Public Routes */}
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthLayout />}>

        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route element={<ProtectedRoute allowedRoles={['ADMINISTRADOR', 'CAJERO']} />}>
              <Route path="/pos" element={<PosPage />} />
              <Route path="/mis-ventas" element={<SalesHistoryPage />} />
              <Route path="/devoluciones" element={<ReturnsPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ADMINISTRADOR', 'ALMACENERO']} />}>
              <Route path="/productos" element={<ProductListPage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/inventario" element={<InventoryPage />} />
              <Route path="/reportes-stock" element={<StockReports />} />

              <Route path="/ordenes" element={<PurchaseOrdersPage />} />
              <Route path="/ajustes" element={<InventoryAdjustmentsPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ADMINISTRADOR']} />}>
              <Route path="/usuarios" element={<UsersPage />} />
              <Route path="/reportes" element={<ReportsPage />} />
              <Route path="/proveedores" element={<SuppliersPage />} />

            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
