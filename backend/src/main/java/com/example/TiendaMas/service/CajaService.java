package com.example.TiendaMas.service;

import com.example.TiendaMas.entity.Caja;
import com.example.TiendaMas.entity.Empleado;
import com.example.TiendaMas.entity.Sucursal;
import com.example.TiendaMas.entity.Venta;
import com.example.TiendaMas.repository.CajaRepository;
import com.example.TiendaMas.repository.EmpleadoRepository;
import com.example.TiendaMas.repository.SucursalRepository;
import com.example.TiendaMas.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CajaService {

    @Autowired
    private CajaRepository cajaRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @Autowired
    private VentaRepository ventaRepository;

    @Transactional
    public Caja abrirCaja(Long empleadoId, Long sucursalId, BigDecimal montoInicial) {
        Optional<Caja> cajaAbierta = cajaRepository.findByEmpleado_IdEmpleadoAndEstado(empleadoId, "ABIERTA");
        if (cajaAbierta.isPresent()) {
            throw new RuntimeException("El empleado ya tiene una caja abierta.");
        }

        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
        Sucursal sucursal = sucursalRepository.findById(sucursalId)
                .orElseThrow(() -> new RuntimeException("Sucursal no encontrada"));

        Caja caja = new Caja();
        caja.setEmpleado(empleado);
        caja.setSucursal(sucursal);
        caja.setMontoInicial(montoInicial);
        caja.setEstado("ABIERTA");

        return cajaRepository.save(caja);
    }

    @Transactional
    public Caja cerrarCaja(Long empleadoId, BigDecimal montoFinal) {
        Caja caja = cajaRepository.findByEmpleado_IdEmpleadoAndEstado(empleadoId, "ABIERTA")
                .orElseThrow(() -> new RuntimeException("No hay una caja abierta para este empleado."));

        // Calcular ventas del día para este empleado desde la apertura
        List<Venta> ventas = ventaRepository.findByEmpleado_IdEmpleado(empleadoId);

        // Filtrar ventas realizadas DESPUÉS de la apertura de caja
        BigDecimal totalVentas = ventas.stream()
                .filter(v -> v.getFecha().isAfter(caja.getFechaApertura()))
                .map(Venta::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal montoSistema = caja.getMontoInicial().add(totalVentas);
        BigDecimal diferencia = montoFinal.subtract(montoSistema);

        caja.setFechaCierre(LocalDateTime.now());
        caja.setMontoFinal(montoFinal);
        caja.setMontoSistema(montoSistema);
        caja.setDiferencia(diferencia);
        caja.setEstado("CERRADA");

        return cajaRepository.save(caja);
    }

    public Optional<Caja> obtenerCajaAbierta(Long empleadoId) {
        return cajaRepository.findByEmpleado_IdEmpleadoAndEstado(empleadoId, "ABIERTA");
    }
}
