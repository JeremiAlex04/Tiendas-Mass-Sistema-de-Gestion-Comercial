package com.example.TiendaMas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comprobante")
public class Comprobante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idComprobante;

    @OneToOne
    @JoinColumn(name = "venta_id", unique = true)
    private Venta venta;

    @Column(name = "numero_serie", nullable = false, length = 50)
    private String numeroSerie;

    @Column(nullable = false, length = 20)
    private String numero;

    @Column(nullable = false, length = 20)
    private String tipo; // BOLETA, FACTURA

    @Column(name = "tipo_doc", nullable = false, length = 20)
    private String tipoDoc; // DNI, RUC

    @Column(columnDefinition = "TEXT")
    private String xml;

    @Column(length = 20)
    private String estadoSunat; // PENDIENTE, ACEPTADO, RECHAZADO

    private LocalDateTime fechaEmision;

    @PrePersist
    protected void onCreate() {
        fechaEmision = LocalDateTime.now();
        if (this.xml == null) {
            this.xml = "SIMULACION_SUNAT_XML";
        }
    }
}
