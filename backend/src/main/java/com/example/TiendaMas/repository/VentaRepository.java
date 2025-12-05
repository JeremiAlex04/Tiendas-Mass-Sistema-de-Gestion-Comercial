package com.example.TiendaMas.repository;

import com.example.TiendaMas.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByFechaBetween(LocalDateTime start, LocalDateTime end);

    List<Venta> findByEmpleado_IdEmpleado(Long empleadoId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM venta ORDER BY fecha DESC LIMIT :limit", nativeQuery = true)
    List<Venta> findRecentSales(@org.springframework.data.repository.query.Param("limit") int limit);
}
