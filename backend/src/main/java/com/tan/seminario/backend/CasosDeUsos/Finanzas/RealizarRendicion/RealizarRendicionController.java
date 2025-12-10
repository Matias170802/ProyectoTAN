package com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion.DTOs.DTOBalanceADevolver;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion.DTOs.DTOEmpleados;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RealizarRendicion.DTOs.DTOInmuebles;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/finanzas/realizarRendicion")
public class RealizarRendicionController {

    private final ExpertoRealizarRendicion expertoRealizarRendicion;

    public RealizarRendicionController(ExpertoRealizarRendicion expertoRealizarRendicion) {
        this.expertoRealizarRendicion = expertoRealizarRendicion;
    }

    @GetMapping("/empleados")
    public ResponseEntity<List<DTOEmpleados>> buscarEmpleados() {
        return ResponseEntity.ok(expertoRealizarRendicion.buscarEmpleados());
    }

    @GetMapping("/inmuebles")
    public ResponseEntity<List<DTOInmuebles>> buscarInmuebles() {
        return ResponseEntity.ok(expertoRealizarRendicion.buscarInmuebles());
    }

    @GetMapping("/balance/{identificador}")
    public ResponseEntity<DTOBalanceADevolver> buscarBalance(@PathVariable String identificador) {
        return ResponseEntity.ok(expertoRealizarRendicion.buscarBalance(identificador));
    }
}
