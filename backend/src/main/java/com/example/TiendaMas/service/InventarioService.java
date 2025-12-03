package com.example.TiendaMas.service;

import com.example.TiendaMas.entity.Inventario;
import com.example.TiendaMas.entity.Kardex;
import com.example.TiendaMas.entity.Producto;
import com.example.TiendaMas.entity.Sucursal;
import com.example.TiendaMas.repository.InventarioRepository;
import com.example.TiendaMas.repository.KardexRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class InventarioService {

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private KardexRepository kardexRepository;

    public Optional<Inventario> findByProductoAndSucursal(Producto producto, Sucursal sucursal) {
        return inventarioRepository.findByProductoAndSucursal(producto, sucursal);
    }

    @Autowired
    private com.example.TiendaMas.repository.EmpleadoRepository empleadoRepository;

    @Autowired
    private AuditoriaService auditoriaService;

    @Transactional
    public void ajustarStock(Producto producto, Sucursal sucursal, int cantidad, String tipoMovimiento,
            String referencia) {
        ajustarStock(producto, sucursal, cantidad, tipoMovimiento, referencia, null);
    }

    @Transactional
    public void ajustarStock(Producto producto, Sucursal sucursal, int cantidad, String tipoMovimiento,
            String referencia, com.example.TiendaMas.entity.Empleado empleado) {
        Inventario inventario = inventarioRepository.findByProductoAndSucursal(producto, sucursal)
                .orElseGet(() -> {
                    Inventario inv = new Inventario();
                    inv.setProducto(producto);
                    inv.setSucursal(sucursal);
                    inv.setCantidad(0);
                    return inv;
                });

        int stockAnterior = inventario.getCantidad();
        int nuevoStock = stockAnterior;

        if ("ENTRADA".equals(tipoMovimiento)) {
            nuevoStock += cantidad;
        } else if ("SALIDA".equals(tipoMovimiento)) {
            nuevoStock -= cantidad;
        } else if ("AJUSTE".equals(tipoMovimiento)) {
            nuevoStock = cantidad;
        }

        if (nuevoStock < 0) {
            throw new RuntimeException("Stock no puede ser negativo");
        }

        inventario.setCantidad(nuevoStock);
        inventarioRepository.save(inventario);

        // Registrar Kardex
        Kardex kardex = new Kardex();
        kardex.setProducto(producto);
        kardex.setSucursal(sucursal);
        kardex.setTipoMovimiento(tipoMovimiento);
        kardex.setCantidad(cantidad);
        if ("AJUSTE".equals(tipoMovimiento)) {
            kardex.setCantidad(nuevoStock - stockAnterior);
        }
        kardex.setStockResultante(nuevoStock);
        kardex.setReferencia(referencia);
        kardexRepository.save(kardex);

        // Registrar Auditoria
        if (empleado != null) {
            auditoriaService.registrarAccion("AJUSTE_STOCK", "PRODUCTO-" + producto.getIdProducto(), empleado,
                    "INVENTARIO");
        }
    }

    @Transactional
    public void registrarMovimiento(Long productoId, Long sucursalId, String tipoMovimiento, int cantidad,
            String motivo, Long usuarioId) {
        Producto producto = new Producto();
        producto.setIdProducto(productoId);

        Sucursal sucursal = new Sucursal();
        sucursal.setIdSucursal(sucursalId);

        com.example.TiendaMas.entity.Empleado empleado = null;
        if (usuarioId != null) {
            empleado = empleadoRepository.findById(usuarioId).orElse(null);
        }

        ajustarStock(producto, sucursal, cantidad, tipoMovimiento, motivo, empleado);
    }

    // Keep old method for compatibility if needed, or just update callers
    @Transactional
    public void registrarMovimiento(Long productoId, Long sucursalId, String tipoMovimiento, int cantidad,
            String motivo) {
        registrarMovimiento(productoId, sucursalId, tipoMovimiento, cantidad, motivo, null);
    }
}
