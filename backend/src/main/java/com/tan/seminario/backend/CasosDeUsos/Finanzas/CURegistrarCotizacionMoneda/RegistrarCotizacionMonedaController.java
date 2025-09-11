package com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarCotizacionMoneda;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarCotizacionMoneda.DTO.DTOCotizacionMoneda;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.CURegistrarCotizacionMoneda.DTO.DTOMonedas;
import com.tan.seminario.backend.Entity.CotizacionMonedaHoy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finanzas/registrarCotizacionMoneda")
public class RegistrarCotizacionMonedaController {

    private final ExpertoRegistrarCotizacionMoneda expertoRegistrarCotizacionMoneda;

    public RegistrarCotizacionMonedaController(ExpertoRegistrarCotizacionMoneda expertoRegistrarCotizacionMoneda1) {
        this.expertoRegistrarCotizacionMoneda = expertoRegistrarCotizacionMoneda1;
    }

    @PostMapping
    public ResponseEntity<CotizacionMonedaHoy> registrarCotizacionMoneda(@RequestBody DTOCotizacionMoneda cotizacion){
        CotizacionMonedaHoy nuevaCotizacion = expertoRegistrarCotizacionMoneda.registrarCotizacionMoneda(cotizacion);

        if (nuevaCotizacion == null) {
            throw new RuntimeException("Error al registrar cotizacion");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCotizacion);
    }

    @GetMapping
    public ResponseEntity<List<DTOMonedas>> buscarMonedas() {
        return ResponseEntity.ok(expertoRegistrarCotizacionMoneda.buscarMonedas());
    }
}
