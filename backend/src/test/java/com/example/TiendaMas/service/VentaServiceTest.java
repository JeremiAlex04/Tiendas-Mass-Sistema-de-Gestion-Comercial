package com.example.TiendaMas.service;

import com.example.TiendaMas.dto.DetalleVentaRequest;
import com.example.TiendaMas.dto.VentaRequest;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VentaServiceTest {

    @Mock
    private VentaRepository ventaRepository;

    @Mock
    private DetalleVentaRepository detalleVentaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private EmpleadoRepository empleadoRepository;

    @Mock
    private SucursalRepository sucursalRepository;

    @Mock
    private ComprobanteRepository comprobanteRepository;

    @Mock
    private InventarioService inventarioService;

    @Mock
    private AuditoriaService auditoriaService;

    @InjectMocks
    private VentaService ventaService;

    private VentaRequest ventaRequest;
    private Empleado empleado;
    private Sucursal sucursal;
    private Producto producto;

    @BeforeEach
    void setUp() {
        // Prepare Data
        sucursal = new Sucursal();
        sucursal.setIdSucursal(1L);
        sucursal.setNombre("Sucursal Test");

        empleado = new Empleado();
        empleado.setIdEmpleado(1L);
        empleado.setSucursal(sucursal);

        producto = new Producto();
        producto.setIdProducto(100L);
        producto.setNombre("Coca Cola 3L");
        producto.setPrecioVenta(new BigDecimal("12.50"));

        DetalleVentaRequest detalle = new DetalleVentaRequest();
        detalle.setProductoId(100L);
        detalle.setCantidad(2);

        ventaRequest = new VentaRequest();
        ventaRequest.setUsuarioId(1L);
        ventaRequest.setSucursalId(1L);
        ventaRequest.setMetodoPago("EFECTIVO");
        ventaRequest.setTipoComprobante("BOLETA");
        ventaRequest.setDetalles(Collections.singletonList(detalle));
    }

    @Test
    void registrarVenta_Exitoso() {
        // Arrange
        when(empleadoRepository.findById(1L)).thenReturn(Optional.of(empleado));
        when(sucursalRepository.findById(1L)).thenReturn(Optional.of(sucursal));
        when(productoRepository.findById(100L)).thenReturn(Optional.of(producto));
        when(ventaRepository.save(any(Venta.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Venta resultado = ventaService.registrarVenta(ventaRequest);

        // Assert
        assertNotNull(resultado);
        assertEquals(new BigDecimal("25.00"), resultado.getTotal()); // 12.50 * 2
        assertEquals("COMPLETADA", resultado.getEstado());

        // Verify Interactions
        verify(inventarioService, times(1)).ajustarStock(eq(producto), eq(sucursal), eq(2), eq("SALIDA"), anyString());
        verify(comprobanteRepository, times(1)).save(any());
        verify(auditoriaService, times(1)).registrarAccion(eq("REGISTRO_VENTA"), anyString(), eq(empleado),
                anyString());
    }

    @Test
    void registrarVenta_Falla_EmpleadoNoEncontrado() {
        // Arrange
        when(empleadoRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            ventaService.registrarVenta(ventaRequest);
        });

        assertEquals("Empleado no encontrado", exception.getMessage());
        verifyNoInteractions(ventaRepository);
        verifyNoInteractions(inventarioService);
    }

    @Test
    void registrarVenta_Falla_ProductoNoEncontrado() {
        // Arrange
        when(empleadoRepository.findById(1L)).thenReturn(Optional.of(empleado));
        when(sucursalRepository.findById(1L)).thenReturn(Optional.of(sucursal));
        when(ventaRepository.save(any(Venta.class))).thenReturn(new Venta()); // First save
        when(productoRepository.findById(100L)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            ventaService.registrarVenta(ventaRequest);
        });

        assertEquals("Producto no encontrado", exception.getMessage());
    }
}
