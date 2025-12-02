package com.example.TiendaMas.security;

import com.example.TiendaMas.entity.Empleado;
import com.example.TiendaMas.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Empleado empleado = empleadoRepository.findByUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("Empleado no encontrado: " + username));

        return new User(empleado.getUsuario(), empleado.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + empleado.getRol().toUpperCase())));
    }
}
