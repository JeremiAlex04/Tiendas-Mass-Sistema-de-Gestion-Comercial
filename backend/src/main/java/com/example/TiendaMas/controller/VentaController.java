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

    @GetMapping("/mis-ventas")
    public List<Venta> getMisVentas(@RequestParam Long usuarioId) {
        return ventaRepository.findByEmpleado_IdEmpleado(usuarioId);
    }
}
