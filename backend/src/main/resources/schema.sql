-- Schema for Tienda Mass

-- Roles
CREATE TABLE IF NOT EXISTS rol (
    id_rol BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

-- Usuarios
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    estado VARCHAR(20) DEFAULT 'ACTIVO',
    rol_id BIGINT,
    FOREIGN KEY (rol_id) REFERENCES rol(id_rol)
);

-- Categorias
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

-- Proveedores
CREATE TABLE IF NOT EXISTS proveedor (
    id_proveedor BIGINT AUTO_INCREMENT PRIMARY KEY,
    razon_social VARCHAR(150) NOT NULL,
    ruc VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100)
);

-- Productos
CREATE TABLE IF NOT EXISTS producto (
    id_producto BIGINT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_venta DECIMAL(10, 2) NOT NULL,
    precio_costo DECIMAL(10, 2) NOT NULL,
    stock_minimo INT DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'ACTIVO',
    categoria_id BIGINT,
    proveedor_id BIGINT,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id_categoria),
    FOREIGN KEY (proveedor_id) REFERENCES proveedor(id_proveedor)
);

-- Sucursales
CREATE TABLE IF NOT EXISTS sucursal (
    id_sucursal BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    departamento VARCHAR(50),
    provincia VARCHAR(50)
);

-- Inventario
CREATE TABLE IF NOT EXISTS inventario (
    id_inventario BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT,
    sucursal_id BIGINT,
    stock_actual INT DEFAULT 0,
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto),
    FOREIGN KEY (sucursal_id) REFERENCES sucursal(id_sucursal),
    UNIQUE(producto_id, sucursal_id)
);

-- Ventas
CREATE TABLE IF NOT EXISTS venta (
    id_venta BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    sucursal_id BIGINT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'COMPLETADA',
    FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario),
    FOREIGN KEY (sucursal_id) REFERENCES sucursal(id_sucursal)
);

-- Detalle Venta
CREATE TABLE IF NOT EXISTS detalle_venta (
    id_detalle BIGINT AUTO_INCREMENT PRIMARY KEY,
    venta_id BIGINT,
    producto_id BIGINT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES venta(id_venta),
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto)
);

-- Comprobantes
CREATE TABLE IF NOT EXISTS comprobante (
    id_comprobante BIGINT AUTO_INCREMENT PRIMARY KEY,
    venta_id BIGINT UNIQUE,
    numero VARCHAR(50) NOT NULL,
    tipo_doc VARCHAR(20) NOT NULL, -- BOLETA, FACTURA
    xml TEXT,
    estado_sunat VARCHAR(20) DEFAULT 'PENDIENTE',
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES venta(id_venta)
);

-- Ordenes de Compra
CREATE TABLE IF NOT EXISTS orden_compra (
    id_orden BIGINT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id BIGINT,
    usuario_id BIGINT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion DATETIME,
    estado VARCHAR(20) DEFAULT 'GENERADA',
    FOREIGN KEY (proveedor_id) REFERENCES proveedor(id_proveedor),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario)
);

-- Detalle Orden Compra
CREATE TABLE IF NOT EXISTS detalle_orden_compra (
    id_detalle BIGINT AUTO_INCREMENT PRIMARY KEY,
    orden_id BIGINT,
    producto_id BIGINT,
    cantidad INT NOT NULL,
    precio_costo DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orden_id) REFERENCES orden_compra(id_orden),
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto)
);

-- Kardex
CREATE TABLE IF NOT EXISTS kardex (
    id_kardex BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT,
    sucursal_id BIGINT,
    tipo_movimiento VARCHAR(20) NOT NULL, -- ENTRADA, SALIDA, AJUSTE
    cantidad INT NOT NULL,
    stock_resultante INT NOT NULL,
    referencia VARCHAR(100), -- ID Venta o ID Orden
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto),
    FOREIGN KEY (sucursal_id) REFERENCES sucursal(id_sucursal)
);

-- Auditoria
CREATE TABLE IF NOT EXISTS log_auditoria (
    id_log BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    accion VARCHAR(100) NOT NULL,
    entidad_afectada VARCHAR(100),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_equipo VARCHAR(50),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario)
);

-- Insert Initial Roles
INSERT IGNORE INTO rol (id_rol, nombre, descripcion) VALUES (1, 'ADMIN', 'Administrador del sistema');
INSERT IGNORE INTO rol (id_rol, nombre, descripcion) VALUES (2, 'CAJERO', 'Encargado de caja y ventas');
INSERT IGNORE INTO rol (id_rol, nombre, descripcion) VALUES (3, 'ALMACENERO', 'Encargado de inventario y compras');

-- Insert Initial Admin User (password: admin123) - BCrypt hash needed in real app, here plain for example or pre-hashed
-- $2a$10$r.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1 -> Example hash
-- For now we will handle user creation via code or seed data properly.
