package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuario;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuario.DTOs.DTORegistrarUsuarioRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuario.DTOs.DTORegistrarUsuarioResponse;
import com.tan.seminario.backend.Entity.Usuario;
import com.tan.seminario.backend.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExpertoABMUsuario {

    @Autowired
    private final UsuarioRepository usuarioRepository;

    public ExpertoABMUsuario(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // ALTA USUARIO
    public DTORegistrarUsuarioResponse registrarUsuario(DTORegistrarUsuarioRequest request) {
        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setPassword(encriptar(request.getPassword()));

        usuarioRepository.save(usuario);

        return new DTORegistrarUsuarioResponse(usuario.getId(), usuario.getUsername());
    }

    // BAJA USUARIO


    // MODIFICAR USUARIO - Contraseña
}
