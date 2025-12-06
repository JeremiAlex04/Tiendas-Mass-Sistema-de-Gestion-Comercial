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
        System.out.println("DEBUG: Requesting report from " + inicio + " to " + fin);
        List<Venta> resultados = reporteService.getVentasPorPeriodo(inicio, fin);
        System.out.println("DEBUG: Found " + resultados.size() + " sales.");
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/stock")
    public ResponseEntity<List<com.example.TiendaMas.entity.Inventario>> getStock() {
        return ResponseEntity.ok(reporteService.getReporteStock());
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<com.example.TiendaMas.dto.DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(reporteService.getDashboardStats());
    }

    @GetMapping("/dashboard/top-productos")
    public ResponseEntity<List<com.example.TiendaMas.dto.ProductoTopDTO>> getTopProductos(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(reporteService.getTopProductos(limit));
    }

    @GetMapping("/dashboard/ventas-semana")
    public ResponseEntity<List<com.example.TiendaMas.dto.VentasDiaDTO>> getVentasSemana() {
        return ResponseEntity.ok(reporteService.getVentasSemana());
    }

    @GetMapping("/dashboard/ventas-recientes")
    public ResponseEntity<?> getVentasRecientes(@RequestParam(defaultValue = "5") int limit) {
        try {
            return ResponseEntity.ok(reporteService.getVentasRecientes(limit));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/dashboard/cajero")
    public ResponseEntity<?> getCajeroStats(@RequestParam Long usuarioId) {
        try {
            return ResponseEntity.ok(reporteService.getCajeroStats(usuarioId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
