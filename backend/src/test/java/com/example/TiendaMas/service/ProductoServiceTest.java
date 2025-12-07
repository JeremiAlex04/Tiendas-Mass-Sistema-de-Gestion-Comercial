package com.example.TiendaMas.service;

import com.example.TiendaMas.entity.Producto;
import com.example.TiendaMas.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoService productoService;

    private Producto producto;

    @BeforeEach
    void setUp() {
        producto = new Producto();
        producto.setIdProducto(1L);
        producto.setNombre("Producto Test");
        producto.setPrecioVenta(new BigDecimal("10.00"));
        producto.setStockMinimo(5);
        producto.setEstado("ACTIVO");
    }

    @Test
    void save_Exitoso() {
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);

        Producto guardado = productoService.save(producto);

        assertNotNull(guardado);
        assertEquals("Producto Test", guardado.getNombre());
        verify(productoRepository, times(1)).save(producto);
    }

    @Test
    void findById_Encontrado() {
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        Optional<Producto> resultado = productoService.findById(1L);

        assertTrue(resultado.isPresent());
        assertEquals("Producto Test", resultado.get().getNombre());
    }

    @Test
    void findAll_Lista() {
        when(productoRepository.findAll()).thenReturn(Arrays.asList(producto, new Producto()));

        List<Producto> lista = productoService.findAll();

        assertEquals(2, lista.size());
    }
}
