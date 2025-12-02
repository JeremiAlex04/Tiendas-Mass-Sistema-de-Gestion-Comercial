package com.example.TiendaMas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "proveedor")
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProveedor;

    @Column(nullable = false, length = 150)
    private String razonSocial;

    @Column(nullable = false, unique = true, length = 20)
    private String ruc;

    @Column(length = 20)
    private String telefono;

    @Column(length = 100)
    private String email;
}
