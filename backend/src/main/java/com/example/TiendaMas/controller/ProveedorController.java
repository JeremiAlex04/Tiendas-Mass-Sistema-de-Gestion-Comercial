package com.example.TiendaMas.controller;

import com.example.TiendaMas.entity.Proveedor;
import com.example.TiendaMas.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proveedores")
@CrossOrigin(origins = "*")
public class ProveedorController {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @GetMapping
    public List<Proveedor> getAllProveedores() {
        return proveedorRepository.findAll();
    }

    @GetMapping("/{id}")
    public Proveedor getProveedorById(@PathVariable Long id) {
        return proveedorRepository.findById(id).orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
    }

    @PostMapping
    public Proveedor createProveedor(@RequestBody Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    @PutMapping("/{id}")
    public Proveedor updateProveedor(@PathVariable Long id, @RequestBody Proveedor proveedorDetails) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        proveedor.setRazonSocial(proveedorDetails.getRazonSocial());
        proveedor.setRuc(proveedorDetails.getRuc());
        proveedor.setTelefono(proveedorDetails.getTelefono());
        proveedor.setEmail(proveedorDetails.getEmail());

        return proveedorRepository.save(proveedor);
    }

    @DeleteMapping("/{id}")
    public void deleteProveedor(@PathVariable Long id) {
        proveedorRepository.deleteById(id);
    }
}
