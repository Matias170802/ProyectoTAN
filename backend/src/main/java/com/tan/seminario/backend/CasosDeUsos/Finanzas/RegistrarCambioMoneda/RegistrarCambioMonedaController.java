package com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarCambioMoneda.DTO.DTOCotizacionMonedaHoy;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.RegistrarIngresoEgresoCaja.DTO.DTOTipoTransaccion;
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

}
