package com.example.TiendaMas.service;

import com.example.TiendaMas.dto.DetalleOrdenRequest;
import com.example.TiendaMas.dto.OrdenCompraRequest;
import com.example.TiendaMas.entity.*;
import com.example.TiendaMas.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrdenCompraService {

        @Autowired
        private OrdenCompraRepository ordenCompraRepository;

        @Autowired
        private DetalleOrdenCompraRepository detalleOrdenCompraRepository;

        @Autowired
        private ProductoRepository productoRepository;

        @Autowired
        private ProveedorRepository proveedorRepository;

        @Autowired
        private EmpleadoRepository empleadoRepository;

        @Autowired
        private InventarioService inventarioService;

        @Autowired
        private SucursalRepository sucursalRepository;

        @Transactional
        public OrdenCompra crearOrden(OrdenCompraRequest request) {
                Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
                                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
                Empleado empleado = empleadoRepository.findById(request.getUsuarioId())
                                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

                OrdenCompra orden = new OrdenCompra();
                orden.setProveedor(proveedor);
                orden.setEmpleado(empleado);
                orden.setEstado("GENERADA");

                orden = ordenCompraRepository.save(orden);

                for (DetalleOrdenRequest det : request.getDetalles()) {
                        Producto producto = productoRepository.findById(det.getProductoId())
                                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

                        DetalleOrdenCompra detalle = new DetalleOrdenCompra();
                        detalle.setOrdenCompra(orden);
                        detalle.setProducto(producto);
                        detalle.setCantidad(det.getCantidad());
                        detalle.setPrecioCosto(det.getPrecioCosto());

                        detalleOrdenCompraRepository.save(detalle);
                }

                return orden;
        }

        public OrdenCompra aprobarOrden(Long id) {
                OrdenCompra orden = ordenCompraRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
                orden.setEstado("APROBADA");
                orden.setFechaAprobacion(LocalDateTime.now());
                return ordenCompraRepository.save(orden);
        }

        @Transactional
        public OrdenCompra recibirOrden(Long id, Long sucursalId) {
                OrdenCompra orden = ordenCompraRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

                if (!"APROBADA".equals(orden.getEstado())) {
                        throw new RuntimeException("La orden debe estar APROBADA para ser recibida");
                }

                Sucursal sucursal = sucursalRepository.findById(sucursalId)
                                .orElseThrow(() -> new RuntimeException("Sucursal no encontrada"));

                DetalleOrdenCompra probe = new DetalleOrdenCompra();
                probe.setOrdenCompra(orden);
                List<DetalleOrdenCompra> detalles = detalleOrdenCompraRepository
                                .findAll(org.springframework.data.domain.Example.of(probe));

                for (DetalleOrdenCompra det : detalles) {
                        inventarioService.ajustarStock(det.getProducto(), sucursal, det.getCantidad(), "ENTRADA",
                                        "ORDEN-" + orden.getIdOrden());
                }

                orden.setEstado("RECIBIDA");
                return ordenCompraRepository.save(orden);
        }
}
