package com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarCotizacionMoneda.DTO.DTOCotizacionMoneda;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarIngresoEgresoCaja.DTO.DTOTipoTransaccion;
import com.tan.seminario.backend.Entity.CotizacionMonedaHoy;
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

    /*@PostMapping
    public ResponseEntity<CotizacionMonedaHoy> registrarIngresoEgresoCaja(@RequestBody DTOCotizacionMoneda cotizacion){
        CotizacionMonedaHoy nuevaCotizacion = expertoRegistrarCotizacionMoneda.registrarCotizacionMoneda(cotizacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCotizacion);
    }*/

    @GetMapping("/tiposTransaccion")
    public ResponseEntity<List<DTOTipoTransaccion>> buscarTiposTransaccion() {
        return ResponseEntity.ok(expertoRegistrarIngresoEgresoCaja.buscarTiposTransaccion());
    }
}
