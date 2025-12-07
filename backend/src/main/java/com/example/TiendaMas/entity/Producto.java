package com.example.TiendaMas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;

    @Column(name = "codigo_barras", nullable = false, unique = true, length = 50)
    private String codigoBarras;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "precio_venta", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioVenta;

    @Column(name = "precio_compra", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioCompra;

    @Column(columnDefinition = "int default 0")
    private Integer stockMinimo;

    @Column(length = 20)
    private String estado; // ACTIVO, INACTIVO

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "proveedor_id")
    private Proveedor proveedor;

    // Legacy field mapping to satisfy existing database schema
    @Column(name = "sku", length = 50)
    private String sku;

    @Column(name = "precio_costo", precision = 10, scale = 2)
    private BigDecimal precioCosto;

    @PrePersist
    @PreUpdate
    public void syncLegacyFields() {
        if (this.sku == null || !this.sku.equals(this.codigoBarras)) {
            this.sku = this.codigoBarras;
        }
        if (this.precioCosto == null || this.precioCosto.compareTo(this.precioCompra) != 0) {
            this.precioCosto = this.precioCompra;
        }
        if (this.descripcion == null || this.descripcion.isEmpty()) {
            this.descripcion = "Sin descripción";
        }
    }
}
