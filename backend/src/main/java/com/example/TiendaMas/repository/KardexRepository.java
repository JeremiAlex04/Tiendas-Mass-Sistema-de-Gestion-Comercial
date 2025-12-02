package com.example.TiendaMas.repository;

import com.example.TiendaMas.entity.Kardex;
import com.example.TiendaMas.entity.Producto;
import com.example.TiendaMas.entity.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KardexRepository extends JpaRepository<Kardex, Long> {
    List<Kardex> findByProductoAndSucursal(Producto producto, Sucursal sucursal);
}
