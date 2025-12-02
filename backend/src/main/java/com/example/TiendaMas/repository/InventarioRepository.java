package com.example.TiendaMas.repository;

import com.example.TiendaMas.entity.Inventario;
import com.example.TiendaMas.entity.Producto;
import com.example.TiendaMas.entity.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {
    Optional<Inventario> findByProductoAndSucursal(Producto producto, Sucursal sucursal);

    List<Inventario> findBySucursal(Sucursal sucursal);

    List<Inventario> findBySucursal_IdSucursal(Long sucursalId);
}
