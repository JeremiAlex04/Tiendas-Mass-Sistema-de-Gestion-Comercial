package com.example.TiendaMas.controller;

import com.example.TiendaMas.entity.Caja;
import com.example.TiendaMas.service.CajaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/caja")
@CrossOrigin(origins = "*")
public class CajaController {

    @Autowired
    private CajaService cajaService;

    @PostMapping("/abrir")
    public ResponseEntity<?> abrirCaja(@RequestBody Map<String, Object> request) {
        try {
            Long empleadoId = Long.valueOf(request.get("empleadoId").toString());
            Long sucursalId = Long.valueOf(request.get("sucursalId").toString());
            BigDecimal montoInicial = new BigDecimal(request.get("montoInicial").toString());

            Caja caja = cajaService.abrirCaja(empleadoId, sucursalId, montoInicial);
            return ResponseEntity.ok(caja);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/cerrar")
    public ResponseEntity<?> cerrarCaja(@RequestBody Map<String, Object> request) {
        try {
            Long empleadoId = Long.valueOf(request.get("empleadoId").toString());
            BigDecimal montoFinal = new BigDecimal(request.get("montoFinal").toString());

            Caja caja = cajaService.cerrarCaja(empleadoId, montoFinal);
            return ResponseEntity.ok(caja);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/estado")
    public ResponseEntity<?> obtenerEstadoCaja(@RequestParam Long empleadoId) {
        Optional<Caja> caja = cajaService.obtenerCajaAbierta(empleadoId);
        if (caja.isPresent()) {
            Caja c = caja.get();
            BigDecimal ventas = cajaService.calcularVentasTurno(c);
            BigDecimal totalEsperado = c.getMontoInicial().add(ventas);

            return ResponseEntity.ok(Map.of(
                    "estado", "ABIERTA",
                    "fechaApertura", c.getFechaApertura(),
                    "montoInicial", c.getMontoInicial(),
                    "ventasActuales", ventas,
                    "totalEsperado", totalEsperado));
        } else {
            return ResponseEntity.ok(Map.of("estado", "CERRADA"));
        }
    }
}
