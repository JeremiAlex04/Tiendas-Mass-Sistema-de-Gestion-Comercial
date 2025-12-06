package com.example.TiendaMas.repository;

import com.example.TiendaMas.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByFechaBetween(LocalDateTime start, LocalDateTime end);

    List<Venta> findByEmpleado_IdEmpleado(Long empleadoId);

}
