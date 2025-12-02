package com.example.TiendaMas.repository;

import com.example.TiendaMas.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    Optional<Producto> findByCodigoBarras(String codigoBarras);

    List<Producto> findByEstado(String estado);
}
