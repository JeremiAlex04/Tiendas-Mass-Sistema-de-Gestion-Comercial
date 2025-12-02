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
@Table(name = "orden_compra")
public class OrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOrden;

    @ManyToOne
    @JoinColumn(name = "proveedor_id")
    private Proveedor proveedor;

    @ManyToOne
    @JoinColumn(name = "id_empleado")
    private Empleado empleado;

    @Column(name = "fecha_emision")
    private LocalDateTime fechaEmision;

    private LocalDateTime fechaAprobacion;

    @Column(length = 20)
    private String estado; // Pendiente, Aprobada, Recibida

    @PrePersist
    protected void onCreate() {
        fechaEmision = LocalDateTime.now();
    }
}
