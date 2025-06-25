package com.tan.seminario.backend.SecurityBackend;

import com.tan.seminario.backend.Entity.EmpleadoRol;
import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Entity.Usuario;
import com.tan.seminario.backend.Entity.UsuarioDetails;
import com.tan.seminario.backend.Repository.EmpleadoRolRepositorioParaBorrarEnMain;
import com.tan.seminario.backend.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmpleadoRolRepositorioParaBorrarEnMain empleadoRolRepository;

    public UserDetailsServiceImpl(UsuarioRepository usuarioRepository,
                                  EmpleadoRolRepositorioParaBorrarEnMain empleadoRolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.empleadoRolRepository = empleadoRolRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        List<Rol> roles = new ArrayList<>();

        if (usuario.getCliente() != null && usuario.getCliente().getRolCliente() != null) {
            roles.add(usuario.getCliente().getRolCliente());
        } else if (usuario.getEmpleado() != null) {
            List<EmpleadoRol> rolesVigentes = empleadoRolRepository.findRolesVigentesByEmpleado(usuario.getEmpleado());
            for (EmpleadoRol er : rolesVigentes) {
                roles.add(er.getRol());
            }
        }

        return new UsuarioDetails(usuario, roles);
    }
}

