package com.example.TiendaMas.service;

import com.example.TiendaMas.dto.AuthResponse;
import com.example.TiendaMas.dto.LoginRequest;
import com.example.TiendaMas.entity.Empleado;
import com.example.TiendaMas.repository.EmpleadoRepository;
import com.example.TiendaMas.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private AuditoriaService auditoriaService;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        Empleado empleado = empleadoRepository.findByUsuario(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        auditoriaService.registrarAccion("LOGIN", "SISTEMA", empleado, "LOCALHOST");

        return new AuthResponse(jwt, userDetails.getUsername(), role, empleado.getIdEmpleado(),
                empleado.getSucursal().getIdSucursal());
    }
}
