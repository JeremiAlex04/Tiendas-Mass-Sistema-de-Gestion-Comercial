package com.example.TiendaMas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleOrdenRequest {
    private Long productoId;
    private Integer cantidad;
    private BigDecimal precioCosto;
}
