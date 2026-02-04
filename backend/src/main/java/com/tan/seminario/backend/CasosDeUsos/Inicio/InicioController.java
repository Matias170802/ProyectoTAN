package com.tan.seminario.backend.CasosDeUsos.Inicio;

import com.tan.seminario.backend.CasosDeUsos.Inicio.DTOInicio.DTOTarea;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/inicio")
public class InicioController {

    private final ExpertoInicio expertoInicio;

    public InicioController(ExpertoInicio expertoInicio) {
        this.expertoInicio = expertoInicio;
    }

    @GetMapping("/tareas")
    public ResponseEntity<List<DTOTarea>> buscarTareas(Authentication authentication) {

        String username = authentication.getName();
        return ResponseEntity.ok(expertoInicio.buscarTareas(username));
    }
}
