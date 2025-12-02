package com.example.TiendaMas.repository;

import com.example.TiendaMas.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    Optional<Proveedor> findByRuc(String ruc);
}
