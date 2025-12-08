package com.example.TiendaMas.controller;

import com.example.TiendaMas.dto.DevolucionRequest;
import com.example.TiendaMas.entity.Devolucion;
import com.example.TiendaMas.service.DevolucionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/devoluciones")
@CrossOrigin(origins = "*")
public class DevolucionController {

    @Autowired
    private DevolucionService devolucionService;

    @PostMapping
    public ResponseEntity<Devolucion> crearDevolucion(@RequestBody DevolucionRequest request) {
        return ResponseEntity.ok(devolucionService.procesarDevolucion(request));
    }

    @GetMapping
    public ResponseEntity<List<com.example.TiendaMas.dto.DevolucionDTO>> listarDevoluciones() {
        return ResponseEntity.ok(devolucionService.listarTodas());
    }
}
