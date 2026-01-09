package com.tan.seminario.backend.CasosDeUsos.Finanzas.PagoSueldos;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.PagoSueldos.DTOs.DTOEmpleadosASeleccionar;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/finanzas/pagarSueldos")
public class PagoSueldosController {

    private final ExpertoPagoSueldos expertoPagoSueldos;

    public PagoSueldosController(ExpertoPagoSueldos expertoPagoSueldos) {
        this.expertoPagoSueldos = expertoPagoSueldos;
    }

    @GetMapping
    public ResponseEntity<List<DTOEmpleadosASeleccionar>> buscarEmpleados() {
        return ResponseEntity.ok(expertoPagoSueldos.buscarEmpleadosASeleccionar());
    }

    @PostMapping("/{dniEmpleado}")
    public ResponseEntity pagarSueldo(@PathVariable String dniEmpleado) {

        expertoPagoSueldos.pagarSueldo(dniEmpleado);
        return ResponseEntity.ok("EXITO");
    }
}
