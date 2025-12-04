package com.example.TiendaMas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private Long idProducto;
    private String codigoBarras;
    private String nombre;
    private String descripcion;
    private BigDecimal precioVenta;
    private BigDecimal precioCompra;
    private Integer stockMinimo;
    private String estado;
    private Long categoriaId;
    private String categoriaNombre;
    private Long proveedorId;
    private String proveedorRazonSocial;
    private Integer stockActual;
}
