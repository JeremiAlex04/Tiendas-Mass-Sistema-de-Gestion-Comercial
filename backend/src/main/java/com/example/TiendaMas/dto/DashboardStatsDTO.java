package com.example.TiendaMas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private Double ventasHoy;
    private Double ventasMes;
    private Integer transaccionesHoy;
    private Integer usuariosActivos;
    private Integer productosBajoStock;
    private Integer ordenesPendientes;
}
