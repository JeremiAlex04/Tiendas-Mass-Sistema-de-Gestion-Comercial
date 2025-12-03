package com.example.TiendaMas.service;

import com.example.TiendaMas.entity.Empleado;
import com.example.TiendaMas.entity.LogAuditoria;
import com.example.TiendaMas.repository.LogAuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditoriaService {

    @Autowired
    private LogAuditoriaRepository logAuditoriaRepository;

    public void registrarAccion(String accion, String entidadAfectada, Empleado empleado, String ipEquipo) {
        LogAuditoria log = new LogAuditoria();
        log.setAccion(accion);
        log.setEntidadAfectada(entidadAfectada);
        log.setEmpleado(empleado);
        log.setIpEquipo(ipEquipo != null ? ipEquipo : "UNKNOWN");

        logAuditoriaRepository.save(log);
    }
}
