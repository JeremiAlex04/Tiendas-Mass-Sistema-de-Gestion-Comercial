package com.example.TiendaMas.controller;

import com.example.TiendaMas.entity.Producto;
import com.example.TiendaMas.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.TiendaMas.dto.ProductoDTO;
import com.example.TiendaMas.service.InventarioService;
import com.example.TiendaMas.repository.SucursalRepository;
import com.example.TiendaMas.entity.Sucursal;
import com.example.TiendaMas.entity.Inventario;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private com.example.TiendaMas.service.InventarioService inventarioService;

    @Autowired
    private com.example.TiendaMas.repository.SucursalRepository sucursalRepository;

    @GetMapping
    public List<com.example.TiendaMas.dto.ProductoDTO> getAll() {
        // Assuming Sucursal ID 1 for now, or sum all
        com.example.TiendaMas.entity.Sucursal sucursal = sucursalRepository.findById(1L).orElse(null);

        return productoService.findAll().stream().map(p -> {
            com.example.TiendaMas.dto.ProductoDTO dto = new com.example.TiendaMas.dto.ProductoDTO();
            dto.setIdProducto(p.getIdProducto());
            dto.setCodigoBarras(p.getCodigoBarras());
            dto.setNombre(p.getNombre());
            dto.setDescripcion(p.getDescripcion());
            dto.setPrecioVenta(p.getPrecioVenta());
            dto.setPrecioCompra(p.getPrecioCompra());
            dto.setStockMinimo(p.getStockMinimo());
            dto.setEstado(p.getEstado());
            if (p.getCategoria() != null) {
                dto.setCategoriaId(p.getCategoria().getIdCategoria());
                dto.setCategoriaNombre(p.getCategoria().getNombre());
            }
            if (p.getProveedor() != null) {
                dto.setProveedorId(p.getProveedor().getIdProveedor());
                dto.setProveedorRazonSocial(p.getProveedor().getRazonSocial());
            }

            if (sucursal != null) {
                dto.setStockActual(inventarioService.findByProductoAndSucursal(p, sucursal)
                        .map(com.example.TiendaMas.entity.Inventario::getCantidad)
                        .orElse(0));
            } else {
                dto.setStockActual(0);
            }
            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getById(@PathVariable Long id) {
        return productoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Producto create(@RequestBody Producto producto) {
        return productoService.save(producto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(@PathVariable Long id, @RequestBody Producto producto) {
        return productoService.findById(id)
                .map(existing -> {
                    producto.setIdProducto(id);
                    return ResponseEntity.ok(productoService.save(producto));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (productoService.findById(id).isPresent()) {
            productoService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
