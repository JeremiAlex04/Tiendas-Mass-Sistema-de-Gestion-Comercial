package com.example.TiendaMas.repository;

import com.example.TiendaMas.entity.Devolucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Query;

@Repository
public interface DevolucionRepository extends JpaRepository<Devolucion, Long> {
    List<Devolucion> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Devolucion> findByVenta(com.example.TiendaMas.entity.Venta venta);

    @Query("SELECT d FROM Devolucion d JOIN FETCH d.venta")
    List<Devolucion> findAllWithVenta();
}
