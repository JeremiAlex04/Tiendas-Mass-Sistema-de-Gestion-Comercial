package com.example.TiendaMas.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DevolucionDTO {
    private Long idDevolucion;
    private Long idVenta; // Just the ID
    private String nombreEmpleado; // Just the name
    private LocalDateTime fecha;
    private String motivo;
    private BigDecimal totalReembolsado;
    // We can add details here if needed, but for the table list we likely don't
    // need full details
}
