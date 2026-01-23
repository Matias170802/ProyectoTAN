package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.DTOUserInfo;
import com.tan.seminario.backend.Entity.Usuario;
import com.tan.seminario.backend.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserInfoController {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    /**
     * Endpoint para obtener información del usuario actual desde el token
     */
    @GetMapping("/me")
    public ResponseEntity<DTOUserInfo> getCurrentUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }

        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractUsername(token);
            List<String> roles = jwtService.extractRoles(token);

            // Buscar el usuario en la base de datos
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Determinar el tipo de usuario
            DTOUserInfo.TipoUsuario tipoUsuario;
            String nombre;
            String codigo;
            boolean esEmpleado = false;
            boolean esCliente = false;

            if (usuario.getEmpleado() != null) {
                tipoUsuario = DTOUserInfo.TipoUsuario.EMPLEADO;
                nombre = usuario.getEmpleado().getNombreEmpleado();
                codigo = usuario.getEmpleado().getCodEmpleado();
                esEmpleado = true;
            } else if (usuario.getCliente() != null) {
                tipoUsuario = DTOUserInfo.TipoUsuario.CLIENTE;
                nombre = usuario.getCliente().getNombreCliente();
                codigo = usuario.getCliente().getCodCliente();
                esCliente = true;
            } else {
                throw new RuntimeException("Usuario sin tipo definido");
            }

            DTOUserInfo userInfo = DTOUserInfo.builder()
                    .email(email)
                    .nombre(nombre)
                    .codigo(codigo)
                    .tipoUsuario(tipoUsuario)
                    .roles(roles)
                    .esEmpleado(esEmpleado)
                    .esCliente(esCliente)
                    .build();

            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}