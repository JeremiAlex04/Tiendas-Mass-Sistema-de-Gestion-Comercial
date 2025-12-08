package com.example.TiendaMas.dto;

import lombok.Data;
import java.util.List;

@Data
public class DevolucionRequest {
    private Long ventaId;
    private Long empleadoId;
    private String motivo;
    private List<DetalleDevolucionRequest> detalles;
}
