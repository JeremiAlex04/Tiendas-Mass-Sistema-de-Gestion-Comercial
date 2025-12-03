package com.example.TiendaMas.controller;

import com.example.TiendaMas.entity.Venta;
import com.example.TiendaMas.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @GetMapping("/ventas")
    public ResponseEntity<List<Venta>> getVentas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(reporteService.getVentasPorPeriodo(inicio, fin));
    }

    @GetMapping("/stock")
    public ResponseEntity<List<com.example.TiendaMas.entity.Inventario>> getStock() {
        return ResponseEntity.ok(reporteService.getReporteStock());
    }
}
