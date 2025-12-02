package com.example.TiendaMas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "empleado")
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmpleado;

    @ManyToOne
    @JoinColumn(name = "id_sucursal", nullable = false)
    private Sucursal sucursal;

    @Column(nullable = false, length = 20)
    private String rol; // 'Cajero', 'Almacenero', 'Administrador'

    @Column(nullable = false, unique = true, length = 50)
    private String usuario;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private LocalDate fechaIngreso;
}
