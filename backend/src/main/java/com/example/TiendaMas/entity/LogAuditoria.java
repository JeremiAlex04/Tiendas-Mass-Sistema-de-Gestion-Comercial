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
@Table(name = "log_auditoria")
public class LogAuditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLog;

    @ManyToOne
    @JoinColumn(name = "id_empleado")
    private Empleado empleado;

    @Column(nullable = false, length = 100)
    private String accion;

    @Column(length = 100)
    private String entidadAfectada;

    private LocalDateTime fecha;

    @Column(length = 50)
    private String ipEquipo;

    @PrePersist
    protected void onCreate() {
        fecha = LocalDateTime.now();
    }
}
