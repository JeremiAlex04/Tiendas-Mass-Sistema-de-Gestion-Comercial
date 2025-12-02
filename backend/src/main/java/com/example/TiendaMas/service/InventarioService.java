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

    @Transactional
    public void ajustarStock(Producto producto, Sucursal sucursal, int cantidad, String tipoMovimiento,
            String referencia) {
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
        kardex.setCantidad(cantidad); // For AJUSTE this might be misleading if it's absolute.
        // If AJUSTE is absolute, the 'movement' quantity is nuevoStock - stockAnterior.
        if ("AJUSTE".equals(tipoMovimiento)) {
            kardex.setCantidad(nuevoStock - stockAnterior);
        }
        kardex.setStockResultante(nuevoStock);
        kardex.setReferencia(referencia);
        kardexRepository.save(kardex);
    }

    @Transactional
    public void registrarMovimiento(Long productoId, Long sucursalId, String tipoMovimiento, int cantidad,
            String motivo) {
        Producto producto = new Producto();
        producto.setIdProducto(productoId);

        Sucursal sucursal = new Sucursal();
        sucursal.setIdSucursal(sucursalId);

        ajustarStock(producto, sucursal, cantidad, tipoMovimiento, motivo);
    }
}
