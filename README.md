# Sistema de Gestión Comercial Tienda Mass

Este documento proporciona una descripción detallada, técnica y funcional del sistema Tienda Mass. Está diseñado para servir como referencia completa para usuarios, administradores y desarrolladores.

## 1. Descripción del Sistema

El Sistema Comercial Tienda Mass es una solución web integral para la administración de ventas minoristas y control de inventarios. Su objetivo es digitalizar el flujo de caja, automatizar el descuento de stock y proveer métricas en tiempo real a la gerencia.

### Objetivos Clave
*   Eliminar desajustes de inventario mediante validación en tiempo real.
*   Agilizar el proceso de venta en caja (POS).
*   Proveer trazabilidad completa de cada producto desde su ingreso hasta su venta.

---

## 2. Módulos Funcionales

### A. Módulo de Autenticación y Seguridad
El sistema utiliza seguridad robusta basada en **JWT (Json Web Tokens)**.
*   **Inicio de Sesión:** Los usuarios acceden con credenciales únicas.
*   **Protección de Rutas:** El Frontend bloquea accesos no autorizados antes de cargar las vistas.
*   **Persistencia:** La sesión se mantiene activa de forma segura hasta que el usuario cierra sesión explícitamente o expira el token.

### B. Módulo de Inventario y Almacén
Controla el ciclo de vida de los productos.
*   **Gestión de Productos:** Registro de SKU, código de barras, precios de compra/venta y stock mínimo.
*   **Control Multi-Sucursal:** Cada producto tiene un registro de stock independiente por cada sucursal física.
*   **Lógica de Movimientos:**
    *   **Entradas:** Aumentan el stock (Compras, Devoluciones).
    *   **Salidas:** Disminuyen el stock (Ventas, Mermas, Vencimientos).
    *   **Ajustes:** Permite correcciones manuales auditadas por el almacenero.
*   **Alertas:** El sistema destaca visualmente productos con stock bajo o agotado.

### C. Módulo de Punto de Venta (POS)
Diseñado para velocidad y precisión en caja.
*   **Apertura y Cierre de Caja:** Obliga a declarar un monto inicial y final. El sistema calcula automáticamente la diferencia (Sobrante/Faltante) basándose en las ventas registradas.
*   **Carrito de Compras:** Permite escanear múltiples productos, editar cantidades o eliminar ítems.
*   **Validación de Stock:** Impide agregar al carrito productos con stock 0.
*   **Emisión de Comprobantes:** Genera tickets (Boletas) con correlativos únicos y series configurables.

### D. Módulo de Reportes y Business Intelligence
*   **Dashboard Gerencial:** Muestra tarjetas con Ventas Totales del Día, Número de Transacciones y Productos Críticos.
*   **Reporte de Ventas:** Listado histórico filtrable por fecha y empleado.
*   **Auditoría:** Registro invisible de acciones críticas (quién eliminó un usuario, quién ajustó stock).

---

## 3. Estructura de Datos (Esquema)

El sistema se sustenta en una base de datos relacional MySQL con las siguientes entidades principales:

1.  **Usuarios y Empleados:** Vincula las credenciales de acceso con los datos laborales (Sucursal asignada).
2.  **Productos:** Catálogo maestro de ítems vendibles.
3.  **Inventario:** Tabla intermedia que relaciona `Producto` + `Sucursal` + `Cantidad`. Soluciona el problema de tener el mismo producto en múltiples tiendas.
4.  **Ventas:** Cabecera de la transacción (Fecha, Total, Empleado, Cliente).
5.  **Detalle de Venta:** Renglones de la factura (Producto, Cantidad, Precio Unitario al momento de la venta).
6.  **Caja:** Registro de sesiones de turno (Apertura/Cierre).

---

## 4. Perfiles de Usuario (Roles)

El sistema implementa un control de acceso basado en roles (RBAC):

### 🛡️ ADMINISTRADOR
*   **Acceso:** Total.
*   **Responsabilidades:** Gestión de catálogo de productos, creación de usuarios, revisión de reportes financieros y supervisión general.

### 🛒 CAJERO
*   **Acceso:** Limitado a POS, Mis Ventas y Dashboard personal.
*   **Responsabilidades:** Atención al cliente, manejo de efectivo, apertura y cierre de su caja.

### 📦 ALMACENERO
*   **Acceso:** Inventario, Ajustes, Productos, Órdenes de Compra.
*   **Responsabilidades:** Recepción de mercadería, control de stock físico vs. lógico, reporte de mermas.

---

## 5. Especificaciones Técnicas

### Backend (Lado Servidor)
*   **Framework:** Spring Boot 3 (Java 17).
*   **Persistencia:** Spring Data JPA + Hibernate.
*   **API:** RESTful estándar.
*   **Validación:** Bean Validation (Jakarta Validation).

### Frontend (Lado Cliente)
*   **Framework:** React 18.
*   **Estado:** Zustand (Gestor de estado ligero y rápido).
*   **Estilos:** Tailwind CSS (Diseño responsive y moderno).
*   **Comunicación:** Axios para peticiones HTTP.

---

## 6. Guía de Instalación y Despliegue

### Requisitos
*   Java 17 JDK
*   Node.js 18+
*   MySQL 8.0

### Pasos de Instalación
1.  **Base de Datos:** Crear esquema `tiendamass` en MySQL.
2.  **Backend:**
    *   Navegar a carpeta `backend`.
    *   Ejecutar `.\mvnw spring-boot:run`.
3.  **Frontend:**
    *   Navegar a carpeta `frontend`.
    *   Ejecutar `npm install` y luego `npm run dev`.

### Ejecución de Pruebas Unitarias
El sistema cuenta con un set de pruebas automatizadas para garantizar la fiabilidad del cálculo de ventas y control de stock.
*   Comando: `.\mvnw test` (en carpeta backend).
*   Cobertura: Servicios de Ventas y Productos.

---

## 7. Credenciales de Acceso (Entorno Pruebas)

| Usuario | Contraseña | Rol Asignado |
| :--- | :--- | :--- |
| `admin` | `admin123` | Administrador Global |
| `cajero` | `cajero123` | Cajero de Sucursal |
| `almacen`| `almacen123`| Encargado de Almacén |

---
© 2025 Tienda Mass - Documentación Oficial
