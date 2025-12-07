package com.example.TiendaMas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "inventario", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "producto_id", "sucursal_id" })
})
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInventario;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "sucursal_id")
    private Sucursal sucursal;

    @Column(name = "cantidad", columnDefinition = "int default 0")
    private Integer cantidad;

    @Column(length = 100)
    private String ubicacion;

    @PrePersist
    protected void onCreate() {
        if (this.ubicacion == null || this.ubicacion.isEmpty()) {
            this.ubicacion = "Almacén General";
        }
    }
}
