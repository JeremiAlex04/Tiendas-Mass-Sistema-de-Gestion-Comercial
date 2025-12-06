package com.example.TiendaMas.service;

import com.example.TiendaMas.dto.DashboardStatsDTO;
import com.example.TiendaMas.dto.ProductoTopDTO;
import com.example.TiendaMas.dto.VentasDiaDTO;
import com.example.TiendaMas.entity.DetalleVenta;
import com.example.TiendaMas.entity.Venta;
import com.example.TiendaMas.entity.Inventario;
import com.example.TiendaMas.repository.VentaRepository;
import com.example.TiendaMas.repository.EmpleadoRepository;
import com.example.TiendaMas.repository.InventarioRepository;
import com.example.TiendaMas.repository.OrdenCompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReporteService {

        @Autowired
        private VentaRepository ventaRepository;

        @Autowired
        private InventarioRepository inventarioRepository;

        @Autowired
        private EmpleadoRepository empleadoRepository;

        @Autowired
        private OrdenCompraRepository ordenCompraRepository;

        public List<Venta> getVentasPorPeriodo(LocalDateTime inicio, LocalDateTime fin) {
                return ventaRepository.findByFechaBetweenWithDetalles(inicio, fin);
        }

        public List<Inventario> getReporteStock() {
                return inventarioRepository.findAll();
        }

        // ... existing code ...

        public DashboardStatsDTO getDashboardStats() {
                DashboardStatsDTO stats = new DashboardStatsDTO();

                // Ventas de hoy
                LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
                LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
                List<Venta> ventasHoy = ventaRepository.findByFechaBetween(startOfDay, endOfDay);

                Double totalHoy = ventasHoy.stream()
                                .mapToDouble(v -> v.getTotal().doubleValue())
                                .sum();
                stats.setVentasHoy(totalHoy);
                stats.setTransaccionesHoy(ventasHoy.size());

                // Ventas del mes
                LocalDateTime startOfMonth = LocalDateTime.of(LocalDate.now().withDayOfMonth(1), LocalTime.MIN);
                List<Venta> ventasMes = ventaRepository.findByFechaBetween(startOfMonth, endOfDay);
                Double totalMes = ventasMes.stream()
                                .mapToDouble(v -> v.getTotal().doubleValue())
                                .sum();
                stats.setVentasMes(totalMes);

                // Usuarios activos
                long usuariosActivos = empleadoRepository.findAll().stream()
                                .filter(e -> "ACTIVO".equals(e.getEstado()))
                                .count();
                stats.setUsuariosActivos((int) usuariosActivos);

                // Productos bajo stock (menos de 10 unidades)
                long productosBajoStock = inventarioRepository.findAll().stream()
                                .filter(inv -> inv.getCantidad() < 10)
                                .count();
                stats.setProductosBajoStock((int) productosBajoStock);

                // Órdenes pendientes
                long ordenesPendientes = ordenCompraRepository.findAll().stream()
                                .filter(orden -> "PENDIENTE".equalsIgnoreCase(orden.getEstado()))
                                .count();
                stats.setOrdenesPendientes((int) ordenesPendientes);

                return stats;
        }

        public List<ProductoTopDTO> getTopProductos(int limit) {
                // Obtener todas las ventas del mes actual
                LocalDateTime startOfMonth = LocalDateTime.of(LocalDate.now().withDayOfMonth(1), LocalTime.MIN);
                LocalDateTime now = LocalDateTime.now();
                List<Venta> ventasMes = ventaRepository.findByFechaBetween(startOfMonth, now);

                // Agrupar por producto y sumar cantidades
                Map<String, ProductoTopDTO> productosMap = new HashMap<>();

                for (Venta venta : ventasMes) {
                        if (venta.getDetalles() != null) {
                                for (DetalleVenta detalle : venta.getDetalles()) {
                                        String codigoBarras = detalle.getProducto().getCodigoBarras();
                                        String nombre = detalle.getProducto().getNombre();

                                        ProductoTopDTO dto = productosMap.getOrDefault(codigoBarras,
                                                        new ProductoTopDTO(nombre, codigoBarras, 0, 0.0));

                                        dto.setCantidadVendida(dto.getCantidadVendida() + detalle.getCantidad());
                                        dto.setTotalVentas(dto.getTotalVentas() + detalle.getSubtotal().doubleValue());

                                        productosMap.put(codigoBarras, dto);
                                }
                        }
                }

                // Ordenar por cantidad vendida y limitar
                return productosMap.values().stream()
                                .sorted((a, b) -> b.getCantidadVendida().compareTo(a.getCantidadVendida()))
                                .limit(limit)
                                .collect(Collectors.toList());
        }

        public List<Venta> getVentasRecientes(int limit) {
                return ventaRepository
                                .findTop10RecentWithDetalles(org.springframework.data.domain.PageRequest.of(0, limit));
        }

        public List<VentasDiaDTO> getVentasSemana() {
                List<VentasDiaDTO> ventasSemana = new ArrayList<>();
                LocalDate hoy = LocalDate.now();

                // Últimos 7 días
                for (int i = 6; i >= 0; i--) {
                        LocalDate fecha = hoy.minusDays(i);
                        LocalDateTime startOfDay = LocalDateTime.of(fecha, LocalTime.MIN);
                        LocalDateTime endOfDay = LocalDateTime.of(fecha, LocalTime.MAX);

                        List<Venta> ventasDia = ventaRepository.findByFechaBetween(startOfDay, endOfDay);

                        Double totalDia = ventasDia.stream()
                                        .mapToDouble(v -> v.getTotal().doubleValue())
                                        .sum();

                        String nombreDia = fecha.getDayOfWeek()
                                        .getDisplayName(TextStyle.SHORT, new Locale("es", "PE"));

                        ventasSemana.add(new VentasDiaDTO(
                                        nombreDia.substring(0, 1).toUpperCase() + nombreDia.substring(1),
                                        totalDia,
                                        ventasDia.size()));
                }

                return ventasSemana;
        }

        public DashboardStatsDTO getCajeroStats(Long usuarioId) {
                DashboardStatsDTO stats = new DashboardStatsDTO();
                LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
                LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

                // Sales for this specific employee today
                List<Venta> ventasHoy = ventaRepository.findByFechaBetween(startOfDay, endOfDay).stream()
                                .filter(v -> v.getEmpleado().getIdEmpleado().equals(usuarioId))
                                .collect(Collectors.toList());

                Double totalHoy = ventasHoy.stream()
                                .mapToDouble(v -> v.getTotal().doubleValue())
                                .sum();

                stats.setVentasHoy(totalHoy);
                stats.setTransaccionesHoy(ventasHoy.size());
                // Other fields can remain 0/null
                return stats;
        }
}
