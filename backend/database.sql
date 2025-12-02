-- Script DDL para TiendaMass (Modelo Estricto)
-- Base de datos: MySQL

DROP DATABASE IF EXISTS tiendamass_db;
CREATE DATABASE tiendamass_db;
USE tiendamass_db;

-- 1. Entidad: SUCURSAL
-- Cardinalidad: (1:N) Empleados, (1:N) Inventarios
CREATE TABLE SUCURSAL (
    id_sucursal INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    responsable VARCHAR(100) NOT NULL
);

-- 2. Entidad: EMPLEADO
-- Cardinalidad: Registra (1:N) Ventas, Gestiona (1:N) Ordenes
CREATE TABLE EMPLEADO (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    id_sucursal INT NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('Cajero', 'Almacenero', 'Administrador')),
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    FOREIGN KEY (id_sucursal) REFERENCES SUCURSAL(id_sucursal)
);

-- Entidad Auxiliar: CLIENTE (Necesaria para la relación en VENTA)
CREATE TABLE CLIENTE (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE
);

-- Entidad Auxiliar: CATEGORIA (Necesaria para PRODUCTO)
CREATE TABLE CATEGORIA (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- 3. Entidad: PRODUCTO
-- Cardinalidad: (0:N) Detalle_Venta, (0:N) Detalle_Orden
CREATE TABLE PRODUCTO (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    codigo_barras VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    precio_compra DECIMAL(10, 2) NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    stock_minimo INT DEFAULT 0,
    FOREIGN KEY (id_categoria) REFERENCES CATEGORIA(id_categoria)
);

-- 4. Entidad: INVENTARIO
-- Cardinalidad: Relación directa con Producto
CREATE TABLE INVENTARIO (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_sucursal INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 0, -- Stock Físico Real
    ubicacion VARCHAR(100),
    FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto),
    FOREIGN KEY (id_sucursal) REFERENCES SUCURSAL(id_sucursal),
    UNIQUE(id_producto, id_sucursal)
);

-- 5. Entidad: VENTA
-- Cardinalidad: (1:N) Detalle_Venta, (1:1) Comprobante
CREATE TABLE VENTA (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    id_cliente INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto_total DECIMAL(10, 2) NOT NULL,
    medio_pago VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'COMPLETADA',
    FOREIGN KEY (id_empleado) REFERENCES EMPLEADO(id_empleado),
    FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente)
);

-- 6. Entidad: DETALLE_VENTA
CREATE TABLE DETALLE_VENTA (
    id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES VENTA(id_venta),
    FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto)
);

-- 7. Entidad: COMPROBANTE (1:1 con Venta)
CREATE TABLE COMPROBANTE (
    id_comprobante INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL UNIQUE,
    numero_serie VARCHAR(50) NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- BOLETA, FACTURA
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_venta) REFERENCES VENTA(id_venta)
);

-- 8. Entidad: PROVEEDOR
-- Cardinalidad: Suministra (1:N) Ordenes
CREATE TABLE PROVEEDOR (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    ruc VARCHAR(20) NOT NULL UNIQUE,
    razon_social VARCHAR(150) NOT NULL
);

-- 9. Entidad: ORDEN_COMPRA
CREATE TABLE ORDEN_COMPRA (
    id_orden_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_proveedor INT NOT NULL,
    id_empleado INT NOT NULL, -- Quien aprueba
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobada', 'Recibida')),
    FOREIGN KEY (id_proveedor) REFERENCES PROVEEDOR(id_proveedor),
    FOREIGN KEY (id_empleado) REFERENCES EMPLEADO(id_empleado)
);

-- Detalle Orden Compra (Implícito en la relación Producto-Orden, aunque no detallado en requisitos principales, es necesario)
CREATE TABLE DETALLE_ORDEN (
    id_detalle_orden INT AUTO_INCREMENT PRIMARY KEY,
    id_orden_compra INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_orden_compra) REFERENCES ORDEN_COMPRA(id_orden_compra),
    FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto)
);
