package com.example.TiendaMas.service;

import com.example.TiendaMas.entity.Venta;
import com.example.TiendaMas.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReporteService {

    @Autowired
    private VentaRepository ventaRepository;

    public List<Venta> getVentasPorPeriodo(LocalDateTime inicio, LocalDateTime fin) {
        return ventaRepository.findByFechaBetween(inicio, fin);
    }

    // More report methods can be added here
}
