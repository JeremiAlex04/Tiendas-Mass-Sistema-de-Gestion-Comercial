package com.example.TiendaMas.dto;

import lombok.Data;

@Data
public class DetalleDevolucionRequest {
    private Long productoId;
    private Integer cantidad;
}
