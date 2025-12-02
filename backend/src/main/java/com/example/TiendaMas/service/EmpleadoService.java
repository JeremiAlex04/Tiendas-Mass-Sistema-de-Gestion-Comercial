package com.example.TiendaMas.service;

import com.example.TiendaMas.entity.Empleado;
import com.example.TiendaMas.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Empleado registrarEmpleado(Empleado nuevoEmpleado, Empleado admin) {
        if (!"ADMIN".equals(admin.getRol())) {
            throw new RuntimeException("Solo administradores pueden registrar empleados");
        }

        if (empleadoRepository.findByUsuario(nuevoEmpleado.getUsuario()).isPresent()) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }

        nuevoEmpleado.setPassword(passwordEncoder.encode(nuevoEmpleado.getPassword()));
        return empleadoRepository.save(nuevoEmpleado);
    }
}
