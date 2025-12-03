package com.example.TiendaMas.controller;

import com.example.TiendaMas.entity.Empleado;
import com.example.TiendaMas.repository.EmpleadoRepository;
import com.example.TiendaMas.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empleados")
@CrossOrigin(origins = "*")
public class EmpleadoController {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private EmpleadoService empleadoService;

    @GetMapping
    public List<Empleado> getAllEmpleados() {
        return empleadoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Empleado getEmpleadoById(@PathVariable Long id) {
        return empleadoRepository.findById(id).orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
    }

    @PostMapping
    public ResponseEntity<Empleado> registrarEmpleado(@RequestBody Empleado nuevoEmpleado, @RequestParam Long adminId) {
        Empleado admin = empleadoRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        return ResponseEntity.ok(empleadoService.registrarEmpleado(nuevoEmpleado, admin));
    }

    @PutMapping("/{id}")
    public Empleado updateEmpleado(@PathVariable Long id, @RequestBody Empleado empleadoDetails) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        empleado.setUsuario(empleadoDetails.getUsuario());
        empleado.setRol(empleadoDetails.getRol());
        empleado.setSucursal(empleadoDetails.getSucursal());
        // Password update logic should be handled carefully (hashing)

        return empleadoRepository.save(empleado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmpleado(@PathVariable Long id) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        empleado.setEstado("INACTIVO");
        empleadoRepository.save(empleado);

        return ResponseEntity.ok().build();
    }
}
