package com.example.TiendaMas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VentaRequest {
    private Long usuarioId; // ID del Empleado (Cajero)
    private Long idCliente;
    private Long sucursalId;
    private String metodoPago;
    private String tipoComprobante; // BOLETA, FACTURA
    private List<DetalleVentaRequest> detalles;
}
