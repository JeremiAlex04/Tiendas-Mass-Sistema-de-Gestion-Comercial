package com.example.TiendaMas.repository;

import com.example.TiendaMas.entity.Comprobante;
import com.example.TiendaMas.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ComprobanteRepository extends JpaRepository<Comprobante, Long> {
    Optional<Comprobante> findByVenta(Venta venta);
}
