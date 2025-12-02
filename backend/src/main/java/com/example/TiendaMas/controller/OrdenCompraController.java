package com.example.TiendaMas.controller;

import com.example.TiendaMas.dto.OrdenCompraRequest;
import com.example.TiendaMas.entity.OrdenCompra;
import com.example.TiendaMas.entity.Empleado;
import com.example.TiendaMas.entity.Proveedor;
import com.example.TiendaMas.service.OrdenCompraService;
import com.example.TiendaMas.repository.OrdenCompraRepository;
import com.example.TiendaMas.repository.EmpleadoRepository;
import com.example.TiendaMas.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ordenes")
@CrossOrigin(origins = "*")
public class OrdenCompraController {

    @Autowired
    private OrdenCompraService ordenCompraService;

    @Autowired
    private OrdenCompraRepository ordenCompraRepository;

    @GetMapping
    public List<OrdenCompra> getAllOrdenes() {
        return ordenCompraRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<OrdenCompra> crearOrden(@RequestBody OrdenCompraRequest request) {
        return ResponseEntity.ok(ordenCompraService.crearOrden(request));
    }

    @PutMapping("/{id}/aprobar")
    public ResponseEntity<String> aprobarOrden(@PathVariable Long id, @RequestParam Long adminId) {
        ordenCompraService.aprobarOrden(id);
        return ResponseEntity.ok("Orden aprobada");
    }

    @PutMapping("/{id}/recibir")
    public ResponseEntity<String> recibirOrden(@PathVariable Long id, @RequestParam Long sucursalId) {
        ordenCompraService.recibirOrden(id, sucursalId);
        return ResponseEntity.ok("Orden recibida");
    }
}
