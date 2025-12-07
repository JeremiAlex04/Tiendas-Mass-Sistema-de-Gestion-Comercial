package com.example.TiendaMas;

import com.example.TiendaMas.entity.Empleado;
import com.example.TiendaMas.entity.Sucursal;
import com.example.TiendaMas.entity.Categoria;
import com.example.TiendaMas.entity.Proveedor;
import com.example.TiendaMas.repository.EmpleadoRepository;
import com.example.TiendaMas.repository.SucursalRepository;
import com.example.TiendaMas.repository.CategoriaRepository;
import com.example.TiendaMas.repository.ProveedorRepository;
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
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Fix existing null states for users created before the 'estado' field was
        // added
        try {
            empleadoRepository.updateNullEstados();
        } catch (Exception e) {
            System.out.println(
                    "No se pudieron actualizar estados nulos (puede ser la primera ejecución): " + e.getMessage());
        }

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
            admin.setRol("ADMINISTRADOR");
            admin.setUsuario("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFechaIngreso(LocalDate.now());
            admin.setEstado("ACTIVO");
            admin.setNombres("Administrador");
            admin.setApellidos("Sistema");
            admin.setEmail("admin@tiendamass.com");
            empleadoRepository.save(admin);
            System.out.println("Empleado ADMIN creado: admin / admin123");
        }

        // Create Cajero Empleado
        if (empleadoRepository.findByUsuario("cajero").isEmpty()) {
            Empleado cajero = new Empleado();
            cajero.setSucursal(sucursal);
            cajero.setRol("CAJERO");
            cajero.setUsuario("cajero");
            cajero.setPassword(passwordEncoder.encode("cajero123"));
            cajero.setFechaIngreso(LocalDate.now());
            cajero.setEstado("ACTIVO");
            cajero.setNombres("Cajero");
            cajero.setApellidos("Principal");
            cajero.setEmail("cajero@tiendamass.com");
            empleadoRepository.save(cajero);
            System.out.println("Empleado CAJERO creado: cajero / cajero123");
        }

        // Create Almacenero Empleado
        if (empleadoRepository.findByUsuario("almacen").isEmpty()) {
            Empleado almacen = new Empleado();
            almacen.setSucursal(sucursal);
            almacen.setRol("ALMACENERO");
            almacen.setUsuario("almacen");
            almacen.setPassword(passwordEncoder.encode("almacen123"));
            almacen.setFechaIngreso(LocalDate.now());
            almacen.setEstado("ACTIVO");
            almacen.setNombres("Almacenero");
            almacen.setApellidos("Principal");
            almacen.setEmail("almacen@tiendamass.com");
            empleadoRepository.save(almacen);
            System.out.println("Empleado ALMACENERO creado: almacen / almacen123");
        }

        // Initialize Default Category
        if (categoriaRepository.count() == 0) {
            Categoria cat = new Categoria();
            cat.setNombre("General");
            cat.setDescripcion("Categoría General");
            categoriaRepository.save(cat);
            System.out.println("Categoría General creada");
        }

        // Initialize Default Provider
        if (proveedorRepository.count() == 0) {
            Proveedor prov = new Proveedor();
            prov.setRazonSocial("Proveedor General S.A.C.");
            prov.setRuc("20100000001");
            prov.setTelefono("999888777");
            prov.setEmail("contacto@proveedor.com");
            proveedorRepository.save(prov);
            System.out.println("Proveedor General creado");
        }
    }
}
