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
    public Producto create(@RequestBody com.example.TiendaMas.dto.ProductoDTO productoDTO) {
        Producto producto = new Producto();
        producto.setCodigoBarras(productoDTO.getCodigoBarras());
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecioVenta(productoDTO.getPrecioVenta());
        producto.setPrecioCompra(productoDTO.getPrecioCompra());
        producto.setStockMinimo(productoDTO.getStockMinimo());
        producto.setEstado(productoDTO.getEstado());

        if (productoDTO.getCategoriaId() != null) {
            com.example.TiendaMas.entity.Categoria cat = new com.example.TiendaMas.entity.Categoria();
            cat.setIdCategoria(productoDTO.getCategoriaId());
            producto.setCategoria(cat);
        }
        if (productoDTO.getProveedorId() != null) {
            com.example.TiendaMas.entity.Proveedor prov = new com.example.TiendaMas.entity.Proveedor();
            prov.setIdProveedor(productoDTO.getProveedorId());
            producto.setProveedor(prov);
        }

        Producto saved = productoService.save(producto);

        // Initialize inventory if stock provided
        if (productoDTO.getStockActual() != null && productoDTO.getStockActual() > 0) {
            com.example.TiendaMas.entity.Sucursal sucursal = sucursalRepository.findById(1L).orElse(null);
            if (sucursal != null) {
                com.example.TiendaMas.entity.Inventario inv = new com.example.TiendaMas.entity.Inventario();
                inv.setProducto(saved);
                inv.setSucursal(sucursal);
                inv.setCantidad(productoDTO.getStockActual());
                inventarioService.save(inv);
                System.out.println("Inventory created for product " + saved.getIdProducto() + " with stock "
                        + productoDTO.getStockActual());
            } else {
                System.err.println("Sucursal 1 not found! Inventory not created.");
            }
        } else {
            System.out.println("No initial stock provided or stock is 0");
        }

        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(@PathVariable Long id,
            @RequestBody com.example.TiendaMas.dto.ProductoDTO productoDTO) {
        return productoService.findById(id)
                .map(existing -> {
                    existing.setCodigoBarras(productoDTO.getCodigoBarras());
                    existing.setNombre(productoDTO.getNombre());
                    existing.setDescripcion(productoDTO.getDescripcion());
                    existing.setPrecioVenta(productoDTO.getPrecioVenta());
                    existing.setPrecioCompra(productoDTO.getPrecioCompra());
                    existing.setStockMinimo(productoDTO.getStockMinimo());
                    existing.setEstado(productoDTO.getEstado());

                    if (productoDTO.getCategoriaId() != null) {
                        com.example.TiendaMas.entity.Categoria cat = new com.example.TiendaMas.entity.Categoria();
                        cat.setIdCategoria(productoDTO.getCategoriaId());
                        existing.setCategoria(cat);
                    }
                    if (productoDTO.getProveedorId() != null) {
                        com.example.TiendaMas.entity.Proveedor prov = new com.example.TiendaMas.entity.Proveedor();
                        prov.setIdProveedor(productoDTO.getProveedorId());
                        existing.setProveedor(prov);
                    }

                    return ResponseEntity.ok(productoService.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return productoService.findById(id)
                .map(producto -> {
                    producto.setEstado("INACTIVO");
                    productoService.save(producto);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
