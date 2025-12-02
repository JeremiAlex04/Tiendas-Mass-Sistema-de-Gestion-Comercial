package com.example.TiendaMas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleVentaRequest {
    private Long productoId;
    private Integer cantidad;
}
