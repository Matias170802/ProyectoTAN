package com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja.DTO.DTOTransaccionARegistrar;
import com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea.DTOs.DTOTareaFinalizadaARegistrar;
import com.tan.seminario.backend.CasosDeUsos.Reservas.FinalizarTarea.DTOs.DTOTareasARealizar;
import com.tan.seminario.backend.Entity.Movimiento;
import com.tan.seminario.backend.Entity.Tarea;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas/finalizarTarea")
public class FinalizarTareaController {

    private final ExpertoFinalizarTarea expertoFinalizarTarea;

    public FinalizarTareaController(ExpertoFinalizarTarea expertoFinalizarTarea) {
        this.expertoFinalizarTarea = expertoFinalizarTarea;
    }

    @GetMapping
    public ResponseEntity<List<DTOTareasARealizar>> buscarTareasARealizar() {
        return ResponseEntity.ok(expertoFinalizarTarea.buscarTareasARealizar());
    }

    @PostMapping
    public ResponseEntity<Tarea> finalizarTarea(@RequestBody DTOTareaFinalizadaARegistrar tareaFinalizadaARegistrar) {
        Tarea nuevaTarea = expertoFinalizarTarea.finalizarTarea(tareaFinalizadaARegistrar);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTarea);
    }
}
