package com.example.TiendaMas.repository;

import com.example.TiendaMas.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    Optional<Empleado> findByUsuario(String usuario);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Query("UPDATE Empleado e SET e.estado = 'ACTIVO' WHERE e.estado IS NULL")
    void updateNullEstados();
}
