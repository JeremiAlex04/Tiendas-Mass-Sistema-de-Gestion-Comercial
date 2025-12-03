package com.example.TiendaMas.service;

import com.example.TiendaMas.dto.DetalleVentaRequest;
import com.example.TiendaMas.dto.VentaRequest;
import com.example.TiendaMas.entity.Comprobante;
import com.example.TiendaMas.entity.DetalleVenta;
import com.example.TiendaMas.entity.Empleado;
import com.example.TiendaMas.entity.Producto;
import com.example.TiendaMas.entity.Sucursal;
import com.example.TiendaMas.entity.Venta;
import com.example.TiendaMas.repository.ComprobanteRepository;
import com.example.TiendaMas.repository.DetalleVentaRepository;
import com.example.TiendaMas.repository.EmpleadoRepository;
import com.example.TiendaMas.repository.ProductoRepository;
import com.example.TiendaMas.repository.SucursalRepository;
import com.example.TiendaMas.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class VentaService {

        @Autowired
        private VentaRepository ventaRepository;

        @Autowired
        private DetalleVentaRepository detalleVentaRepository;

        @Autowired
        private ProductoRepository productoRepository;

        @Autowired
        private EmpleadoRepository empleadoRepository;

        @Autowired
        private SucursalRepository sucursalRepository;

        @Autowired
        private ComprobanteRepository comprobanteRepository;

        @Autowired
        private InventarioService inventarioService;

        @Autowired
        private AuditoriaService auditoriaService;

        @Transactional
        public Venta registrarVenta(VentaRequest request) {
                Empleado empleado = empleadoRepository.findById(request.getUsuarioId())
                                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
                Sucursal sucursal = sucursalRepository.findById(request.getSucursalId())
                                .orElseThrow(() -> new RuntimeException("Sucursal no encontrada"));

                Venta venta = new Venta();
                venta.setEmpleado(empleado);
                venta.setSucursal(sucursal);
                venta.setMetodoPago(request.getMetodoPago());
                venta.setEstado("COMPLETADA");
                venta.setTotal(BigDecimal.ZERO); // Will calculate

                venta = ventaRepository.save(venta);

                BigDecimal totalVenta = BigDecimal.ZERO;

                for (DetalleVentaRequest det : request.getDetalles()) {
                        Producto producto = productoRepository.findById(det.getProductoId())
                                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

                        // Check and Update Stock
                        inventarioService.ajustarStock(producto, sucursal, det.getCantidad(), "SALIDA",
                                        "VENTA-" + venta.getIdVenta());

                        DetalleVenta detalle = new DetalleVenta();
                        detalle.setVenta(venta);
                        detalle.setProducto(producto);
                        detalle.setCantidad(det.getCantidad());
                        detalle.setPrecioUnitario(producto.getPrecioVenta());
                        detalle.setSubtotal(producto.getPrecioVenta().multiply(new BigDecimal(det.getCantidad())));

                        detalleVentaRepository.save(detalle);

                        totalVenta = totalVenta.add(detalle.getSubtotal());
                }

                venta.setTotal(totalVenta);
                ventaRepository.save(venta);

                // Generar Comprobante
                Comprobante comprobante = new Comprobante();
                comprobante.setVenta(venta);
                comprobante.setTipo(request.getTipoComprobante());
                comprobante.setNumeroSerie(UUID.randomUUID().toString().substring(0, 8).toUpperCase()); // Mock number
                comprobante.setEstadoSunat("PENDIENTE");
                comprobanteRepository.save(comprobante);

                auditoriaService.registrarAccion("REGISTRO_VENTA", "VENTA-" + venta.getIdVenta(), empleado,
                                "POS-TERMINAL");

                return venta;
        }
}
