package com.example.TiendaMas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenCompraRequest {
    private Long proveedorId;
    private Long usuarioId;
    private List<DetalleOrdenRequest> detalles;
}
