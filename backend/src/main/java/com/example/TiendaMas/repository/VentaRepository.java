package com.example.TiendaMas.repository;

import com.example.TiendaMas.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

import org.springframework.data.repository.query.Param;
import  java.util.Optional;

public interface VentaRepository extends JpaRepository<Venta, Long> {
        List<Venta> findByFechaBetween(LocalDateTime start, LocalDateTime end);

        List<Venta> findByEmpleado_IdEmpleado(Long empleadoId);

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT v FROM Venta v LEFT JOIN FETCH v.detalles WHERE v.empleado.idEmpleado = :empleadoId")
        List<Venta> findVentasPorEmpleadoWithDetalles(@Param("empleadoId") Long empleadoId);

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT v FROM Venta v LEFT JOIN FETCH v.detalles ORDER BY v.fecha DESC")
        List<Venta> findTop10RecentWithDetalles(org.springframework.data.domain.Pageable pageable);

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT v FROM Venta v LEFT JOIN FETCH v.detalles WHERE v.fecha BETWEEN :start AND :end")
        List<Venta> findByFechaBetweenWithDetalles(@Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end);

        @org.springframework.data.jpa.repository.Query("SELECT v FROM Venta v LEFT JOIN FETCH v.detalles WHERE v.idVenta = :id")
        Optional<Venta> findByIdWithDetalles(@Param("id") Long id);
}
