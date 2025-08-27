package com.tan.seminario.backend.CasosDeUsos.Seguridad;
/*
import com.tan.seminario.backend.CasosDeUsos.Seguridad.DTOs.LoginDTO;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.DTOs.RegistroDTO;
import com.tan.seminario.backend.Entity.Usuario;
import com.tan.seminario.backend.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // REGISTRAR USUARIO
    public String registrarUsuario(RegistroDTO dto) {

        if (usuarioRepository.findByUsername(dto.getUsername()).isPresent()) {
            return "El usuario ya existe";
        }
        Usuario u = new Usuario();
        u.setUsername(dto.getUsername());
        // Encriptar la contraseña antes de guardarla
        u.setPassword(passwordEncoder.encode(dto.getPassword()));
        // Guardar el usuario en la base de datos
        usuarioRepository.save(u);
        return "Usuario registrado";
    }

    // LOGIN - INCIAR SESION
    public String login(LoginDTO dto) {
        Optional<Usuario> userOpt = usuarioRepository.findByUsername(dto.getUsername());
        if (userOpt.isPresent()) {
            Usuario u = userOpt.get();
            if (passwordEncoder.matches(dto.getPassword(), u.getPassword())) {
                return "Login exitoso";
            }
        }
        return "Credenciales inválidas";
    }

}*/
