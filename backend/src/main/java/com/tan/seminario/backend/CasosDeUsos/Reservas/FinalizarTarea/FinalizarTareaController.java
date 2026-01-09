package com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea;

import com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea.DTOs.DTOTareaFinalizadaARegistrar;
import com.tan.seminario.backend.Entity.Tarea;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservas/finalizarTarea")
public class FinalizarTareaController {

    private final ExpertoFinalizarTarea expertoFinalizarTarea;

    public FinalizarTareaController(ExpertoFinalizarTarea expertoFinalizarTarea) {
        this.expertoFinalizarTarea = expertoFinalizarTarea;
    }

    @PostMapping
    public ResponseEntity<Tarea> finalizarTarea(@RequestBody DTOTareaFinalizadaARegistrar tareaFinalizadaARegistrar, Authentication authentication) {

        String username = authentication.getName();
        Tarea nuevaTarea = expertoFinalizarTarea.finalizarTarea(tareaFinalizadaARegistrar, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTarea);
    }
}
