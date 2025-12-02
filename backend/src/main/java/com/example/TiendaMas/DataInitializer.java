package com.example.TiendaMas;

import com.example.TiendaMas.entity.Empleado;
import com.example.TiendaMas.entity.Sucursal;
import com.example.TiendaMas.repository.EmpleadoRepository;
import com.example.TiendaMas.repository.SucursalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create Default Sucursal
        Sucursal sucursal = sucursalRepository.findById(1L).orElse(null);
        if (sucursal == null) {
            sucursal = new Sucursal();
            sucursal.setNombre("Sucursal Central");
            sucursal.setDireccion("Av. Principal 123");
            sucursal.setResponsable("Gerente General");
            sucursal = sucursalRepository.save(sucursal);
        }

        // Create Admin Empleado
        if (empleadoRepository.findByUsuario("admin").isEmpty()) {
            Empleado admin = new Empleado();
            admin.setSucursal(sucursal);
            admin.setRol("Administrador");
            admin.setUsuario("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFechaIngreso(LocalDate.now());
            empleadoRepository.save(admin);
            System.out.println("Empleado ADMIN creado: admin / admin123");
        }

        // Create Cajero Empleado
        if (empleadoRepository.findByUsuario("cajero").isEmpty()) {
            Empleado cajero = new Empleado();
            cajero.setSucursal(sucursal);
            cajero.setRol("Cajero");
            cajero.setUsuario("cajero");
            cajero.setPassword(passwordEncoder.encode("cajero123"));
            cajero.setFechaIngreso(LocalDate.now());
            empleadoRepository.save(cajero);
            System.out.println("Empleado CAJERO creado: cajero / cajero123");
        }

        // Create Almacenero Empleado
        if (empleadoRepository.findByUsuario("almacen").isEmpty()) {
            Empleado almacen = new Empleado();
            almacen.setSucursal(sucursal);
            almacen.setRol("Almacenero");
            almacen.setUsuario("almacen");
            almacen.setPassword(passwordEncoder.encode("almacen123"));
            almacen.setFechaIngreso(LocalDate.now());
            empleadoRepository.save(almacen);
            System.out.println("Empleado ALMACENERO creado: almacen / almacen123");
        }
    }
}
