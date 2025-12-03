package com.example.TiendaMas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "caja")
public class Caja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCaja;

    @ManyToOne
    @JoinColumn(name = "id_empleado", nullable = false)
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "id_sucursal", nullable = false)
    private Sucursal sucursal;

    @Column(nullable = false)
    private LocalDateTime fechaApertura;

    private LocalDateTime fechaCierre;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montoInicial;

    @Column(precision = 10, scale = 2)
    private BigDecimal montoFinal; // El dinero real contado por el cajero

    @Column(precision = 10, scale = 2)
    private BigDecimal montoSistema; // El dinero que el sistema calcula que debería haber

    @Column(precision = 10, scale = 2)
    private BigDecimal diferencia; // montoFinal - montoSistema

    @Column(length = 20, nullable = false)
    private String estado; // ABIERTA, CERRADA

    @PrePersist
    protected void onCreate() {
        fechaApertura = LocalDateTime.now();
        estado = "ABIERTA";
    }
}
