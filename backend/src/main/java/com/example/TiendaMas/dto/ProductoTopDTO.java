package com.example.TiendaMas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoTopDTO {
    private String nombre;
    private String codigoBarras;
    private Integer cantidadVendida;
    private Double totalVentas;
}
