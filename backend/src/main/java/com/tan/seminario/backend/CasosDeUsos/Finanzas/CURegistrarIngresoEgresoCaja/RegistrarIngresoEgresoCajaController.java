package com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja.DTO.DTOCategoriaMovimiento;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja.DTO.DTOMoneda;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja.DTO.DTOTipoTransaccion;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja.DTO.DTOTransaccionARegistrar;
import com.tan.seminario.backend.Entity.Movimiento;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finanzas/registrarIngresoEgresoCaja")
public class RegistrarIngresoEgresoCajaController {

    private final ExpertoRegistrarIngresoEgresoCaja expertoRegistrarIngresoEgresoCaja;

    public RegistrarIngresoEgresoCajaController(ExpertoRegistrarIngresoEgresoCaja expertoRegistrarIngresoEgresoCaja) {
        this.expertoRegistrarIngresoEgresoCaja = expertoRegistrarIngresoEgresoCaja;
    }

    @PostMapping
    public ResponseEntity<Movimiento> registrarIngresoEgresoCaja(@RequestBody DTOTransaccionARegistrar transaccionARegistrar){
        Movimiento nuevoMovimiento = expertoRegistrarIngresoEgresoCaja.registrarMovimiento(transaccionARegistrar);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoMovimiento);
    }

    @GetMapping("/tiposTransaccion")
    public ResponseEntity<List<DTOTipoTransaccion>> buscarTiposTransaccion() {
        return ResponseEntity.ok(expertoRegistrarIngresoEgresoCaja.buscarTiposTransaccion());
    }

    @GetMapping("/tiposMoneda")
    public ResponseEntity<List<DTOMoneda>> buscarTiposMoneda () {
        return ResponseEntity.ok(expertoRegistrarIngresoEgresoCaja.buscarTiposMoneda());
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<DTOCategoriaMovimiento>> buscarCategoriasMovimiento () {
        return ResponseEntity.ok(expertoRegistrarIngresoEgresoCaja.buscarCategoriasMovimiento());
    }
}
