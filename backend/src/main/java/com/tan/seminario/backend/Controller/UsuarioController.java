package com.tan.seminario.backend.Controller;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.DTOs.LoginDTO;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.DTOs.RegistroDTO;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registro")
    public ResponseEntity<String> registrarUsuario(@RequestBody RegistroDTO dto) {
        return ResponseEntity.ok(usuarioService.registrarUsuario(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO dto) {
        return ResponseEntity.ok(usuarioService.login(dto));
    }
}