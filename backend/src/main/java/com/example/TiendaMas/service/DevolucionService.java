package com.example.TiendaMas.service;

import com.example.TiendaMas.dto.DetalleDevolucionRequest;
import com.example.TiendaMas.dto.DevolucionRequest;
import com.example.TiendaMas.entity.*;
import com.example.TiendaMas.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class DevolucionService {

        @Autowired
        private DevolucionRepository devolucionRepository;

        @Autowired
        private VentaRepository ventaRepository;

        @Autowired
        private ProductoRepository productoRepository;

        @Autowired
        private EmpleadoRepository empleadoRepository;

        @Autowired
        private InventarioService inventarioService;

        @Autowired
        private AuditoriaService auditoriaService;

        @Transactional
        public Devolucion procesarDevolucion(DevolucionRequest request) {
                Venta venta = ventaRepository.findById(request.getVentaId())
                                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

                Empleado empleado = empleadoRepository.findById(request.getEmpleadoId())
                                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

                Devolucion devolucion = new Devolucion();
                devolucion.setVenta(venta);
                devolucion.setEmpleado(empleado);
                devolucion.setMotivo(request.getMotivo());

                List<DetalleDevolucion> detalles = new ArrayList<>();
                BigDecimal totalReembolsado = BigDecimal.ZERO;

                for (DetalleDevolucionRequest item : request.getDetalles()) {
                        Producto producto = productoRepository.findById(item.getProductoId())
                                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

                        // Validar que el producto estaba en la venta original
                        DetalleVenta detalleOriginal = venta.getDetalles().stream()
                                        .filter(d -> d.getProducto().getIdProducto().equals(producto.getIdProducto()))
                                        .findFirst()
                                        .orElseThrow(() -> new RuntimeException(
                                                        "El producto " + producto.getNombre()
                                                                        + " no pertenece a esta venta"));

                        // CALCULAR CANTIDAD YA DEVUELTA ANTERIORMENTE
                        long cantidadYaDevuelta = devolucionRepository.findByVenta(venta).stream()
                                        .flatMap(d -> d.getDetalles().stream())
                                        .filter(d -> d.getProducto().getIdProducto().equals(producto.getIdProducto()))
                                        .mapToLong(DetalleDevolucion::getCantidad)
                                        .sum();

                        if (item.getCantidad() + cantidadYaDevuelta > detalleOriginal.getCantidad()) {
                                throw new RuntimeException(
                                                "No puede devolver " + item.getCantidad() + " unidades de "
                                                                + producto.getNombre() + ". Vendidas: "
                                                                + detalleOriginal.getCantidad()
                                                                + ", Ya devueltas: " + cantidadYaDevuelta);
                        }

                        // Calcular reembolso (usando el precio original de venta)
                        BigDecimal subtotal = detalleOriginal.getPrecioUnitario()
                                        .multiply(new BigDecimal(item.getCantidad()));
                        totalReembolsado = totalReembolsado.add(subtotal);

                        // Crear detalle
                        DetalleDevolucion detalle = new DetalleDevolucion();
                        detalle.setDevolucion(devolucion);
                        detalle.setProducto(producto);
                        detalle.setCantidad(item.getCantidad());
                        detalle.setMontoUnitario(detalleOriginal.getPrecioUnitario());
                        detalle.setSubtotal(subtotal);
                        detalles.add(detalle);

                        // RESTAURAR STOCK
                        // Usamos "ENTRADA" para que sume al stock
                        inventarioService.ajustarStock(producto, venta.getSucursal(), item.getCantidad(), "ENTRADA",
                                        "DEVOLUCION-VENTA-" + venta.getIdVenta(), empleado);
                }

                devolucion.setDetalles(detalles);
                devolucion.setTotalReembolsado(totalReembolsado);

                Devolucion saved = devolucionRepository.save(devolucion);

                auditoriaService.registrarAccion("DEVOLUCION_VENTA", "VENTA-" + venta.getIdVenta(), empleado, "POS");

                return saved;
        }

        public List<com.example.TiendaMas.dto.DevolucionDTO> listarTodas() {
                return devolucionRepository.findAll().stream().map(d -> {
                        com.example.TiendaMas.dto.DevolucionDTO dto = new com.example.TiendaMas.dto.DevolucionDTO();
                        dto.setIdDevolucion(d.getIdDevolucion());
                        dto.setIdVenta(d.getVenta().getIdVenta());
                        dto.setNombreEmpleado(d.getEmpleado() != null ? d.getEmpleado().getNombres() : "Desconocido");
                        dto.setFecha(d.getFecha());
                        dto.setMotivo(d.getMotivo());
                        dto.setTotalReembolsado(d.getTotalReembolsado());
                        return dto;
                }).collect(java.util.stream.Collectors.toList());
        }
}
