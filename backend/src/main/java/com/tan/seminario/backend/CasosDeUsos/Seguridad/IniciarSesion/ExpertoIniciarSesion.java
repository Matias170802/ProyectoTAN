package com.tan.seminario.backend.CasosDeUsos.Seguridad.IniciarSesion;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.IniciarSesion.DTOs.DTOLoginRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.IniciarSesion.DTOs.DTOLoginResponse;
import com.tan.seminario.backend.Entity.*;
import com.tan.seminario.backend.Repository.EmpleadoRolRepositorioParaBorrarEnMain;
import com.tan.seminario.backend.SecurityBackend.JWT.JwtService;
import com.tan.seminario.backend.Repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpertoIniciarSesion {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmpleadoRolRepositorioParaBorrarEnMain empleadoRolRepositorioParaBorrarEnMain;

    public ExpertoIniciarSesion(UsuarioRepository usuarioRepository, JwtService jwtService, AuthenticationManager authenticationManager, EmpleadoRolRepositorioParaBorrarEnMain empleadoRolRepositorioParaBorrarEnMain) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.empleadoRolRepositorioParaBorrarEnMain = empleadoRolRepositorioParaBorrarEnMain;
    }

    // CU: INICIAR SESION
    public DTOLoginResponse login(DTOLoginRequest request) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new Exception("El usuario o la contraseña son incorrectos");
        }

        Usuario usuario = usuarioRepository.findByNombreUsuario(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // Extraer los Roles del Usario para poder enviarlos
        List<Rol> roles = new ArrayList<>();

        if (usuario.getCliente() != null) {
            roles.add(usuario.getCliente().getRolCliente());
        } else if (usuario.getEmpleado() != null) {
            // Buscar la instancia de EmpleadoRol relacionada a Emplaedo del usuario
            Empleado empleadoUser = usuario.getEmpleado();
            List<EmpleadoRol> empleadoRoles = empleadoRolRepositorioParaBorrarEnMain.findRolesVigentesByEmpleado(empleadoUser);
            for (EmpleadoRol rol : empleadoRoles) {
                roles.add(rol.getRol());
            }
        }
        // Acá está el cambio: usamos UsuarioDetails
        UsuarioDetails userDetails = new UsuarioDetails(usuario, roles);

        String token = jwtService.getToken(userDetails);

        return DTOLoginResponse.builder()
                .token(token)
                .nombre(usuario.getUsername())
                .roles(roles)
                .build();
    }
}

