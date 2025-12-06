package com.example.TiendaMas.repository;

import com.example.TiendaMas.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByFechaBetween(LocalDateTime start, LocalDateTime end);

    List<Venta> findByEmpleado_IdEmpleado(Long empleadoId);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT v FROM Venta v LEFT JOIN FETCH v.detalles WHERE v.empleado.idEmpleado = :empleadoId")
    List<Venta> findVentasPorEmpleadoWithDetalles(
            @org.springframework.web.bind.annotation.RequestParam("empleadoId") Long empleadoId);
}
