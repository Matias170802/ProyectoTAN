package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda.DTO.DTOCambioMoneda;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda.DTO.DTOCotizacionMonedaHoy;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO.DTOTipoTransaccion;
import com.tan.seminario.backend.Entity.CajaMadre;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finanzas/registrarCambioMoneda")
public class RegistrarCambioMonedaController {
    private final ExpertoRegistrarCambioMoneda expertoRegistrarCambioMoneda;

    public RegistrarCambioMonedaController(ExpertoRegistrarCambioMoneda expertoRegistrarCambioMoneda) {
        this.expertoRegistrarCambioMoneda = expertoRegistrarCambioMoneda;
    }

    @GetMapping("/cotizacionMonedaHoy")
    public ResponseEntity<DTOCotizacionMonedaHoy> buscarCotizacionMonedaHoy(@RequestParam("tipoCambio") String tipoCambio) {
        return ResponseEntity.ok(expertoRegistrarCambioMoneda.buscarCotizacionMonedaHoy(tipoCambio));
    }

    @PostMapping
    public ResponseEntity<List<CajaMadre>> registrarCambioMoneda(@RequestBody DTOCambioMoneda cambioMoneda) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expertoRegistrarCambioMoneda.registrarCambioMoneda(cambioMoneda));
    }

}
