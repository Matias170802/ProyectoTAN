package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios;

import com.tan.seminario.backend.Entity.Usuario;
import com.tan.seminario.backend.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
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
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token no proporcionado"));
        }

        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractUsername(token);
            List<String> roles = jwtService.extractRoles(token);

            // Buscar el usuario en la base de datos
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Determinar el tipo de usuario
            String tipoUsuario;
            String nombre;
            String codigo;

            if (usuario.getEmpleado() != null) {
                tipoUsuario = "EMPLEADO";
                nombre = usuario.getEmpleado().getNombreEmpleado();
                codigo = usuario.getEmpleado().getCodEmpleado();
            } else if (usuario.getCliente() != null) {
                tipoUsuario = "CLIENTE";
                nombre = usuario.getCliente().getNombreCliente();
                codigo = usuario.getCliente().getCodCliente();
            } else {
                throw new RuntimeException("Usuario sin tipo definido");
            }

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("email", email);
            userInfo.put("nombre", nombre);
            userInfo.put("codigo", codigo);
            userInfo.put("tipoUsuario", tipoUsuario);
            userInfo.put("roles", roles);

            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token inválido"));
        }
    }
}