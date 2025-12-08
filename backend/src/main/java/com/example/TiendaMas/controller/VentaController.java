package com.example.TiendaMas.controller;

import com.example.TiendaMas.dto.VentaRequest;
import com.example.TiendaMas.dto.DetalleVentaRequest;
import com.example.TiendaMas.entity.*;
import com.example.TiendaMas.service.VentaService;
import com.example.TiendaMas.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @Autowired
    private VentaRepository ventaRepository;

    @PostMapping
    public ResponseEntity<Venta> registrarVenta(@RequestBody VentaRequest request) {
        return ResponseEntity.ok(ventaService.registrarVenta(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> getVentaById(@PathVariable Long id) {
        System.out.println("Buscando venta con ID: " + id);
        return ventaRepository.findByIdWithDetalles(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/mis-ventas")
    public ResponseEntity<?> getMisVentas(org.springframework.security.core.Authentication authentication) {
        try {
            String username = authentication.getName();
            return ResponseEntity.ok(ventaService.getVentasPorEmpleado(username));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
