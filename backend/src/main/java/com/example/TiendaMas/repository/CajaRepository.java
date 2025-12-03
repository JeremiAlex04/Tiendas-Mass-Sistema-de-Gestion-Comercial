package com.example.TiendaMas.repository;

import com.example.TiendaMas.entity.Caja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CajaRepository extends JpaRepository<Caja, Long> {
    Optional<Caja> findByEmpleado_IdEmpleadoAndEstado(Long idEmpleado, String estado);

    List<Caja> findBySucursal_IdSucursal(Long idSucursal);
}
