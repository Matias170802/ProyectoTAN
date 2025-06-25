package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuario;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuario.DTOs.DTORegistrarUsuarioRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuario.DTOs.DTORegistrarUsuarioResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/seguridad/abmUsuario")
public class ABMUsuarioController {

    @Autowired
    private final ExpertoABMUsuario experto;

    public ABMUsuarioController (ExpertoABMUsuario experto) {
        this.experto = experto;
    }

    @PostMapping
    public ResponseEntity<DTORegistrarUsuarioResponse> registrarUsuario(@RequestBody DTORegistrarUsuarioRequest request) {
        DTORegistrarUsuarioResponse usuarioCreado = experto.registrarUsuario(request);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(usuarioCreado.getId())
                .toUri();

        return ResponseEntity.created(location).body(usuarioCreado);
    }

}
