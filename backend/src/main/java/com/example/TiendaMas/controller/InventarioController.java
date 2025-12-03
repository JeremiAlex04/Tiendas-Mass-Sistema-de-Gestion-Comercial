package com.example.TiendaMas.controller;

import com.example.TiendaMas.entity.Inventario;
import com.example.TiendaMas.entity.Producto;
import com.example.TiendaMas.entity.Sucursal;
import com.example.TiendaMas.service.InventarioService;
import com.example.TiendaMas.repository.InventarioRepository;
import com.example.TiendaMas.repository.ProductoRepository;
import com.example.TiendaMas.repository.SucursalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @GetMapping
    public List<Inventario> getAllInventario() {
        return inventarioRepository.findAll();
    }

    @GetMapping("/sucursal/{sucursalId}")
    public List<Inventario> getInventarioBySucursal(@PathVariable Long sucursalId) {
        return inventarioRepository.findBySucursal_IdSucursal(sucursalId);
    }

    @PostMapping("/ajuste")
    public ResponseEntity<String> realizarAjuste(
            @RequestParam Long productoId,
            @RequestParam Long sucursalId,
            @RequestParam int cantidad,
            @RequestParam String tipoMovimiento, // ENTRADA, SALIDA
            @RequestParam String motivo,
            @RequestParam Long usuarioId) {

        inventarioService.registrarMovimiento(productoId, sucursalId, tipoMovimiento, cantidad, motivo, usuarioId);
        return ResponseEntity.ok("Ajuste realizado correctamente");
    }
}
