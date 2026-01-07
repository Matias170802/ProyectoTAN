package com.tan.seminario.backend.CasosDeUsos.Reportes;

import com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs.DTOInmueblesFiltro;
import com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs.DTOReportesFinanzas;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/reportes")
public class ReportesController {

    private final ExpertoReportes expertoReportes;

    public ReportesController(ExpertoReportes expertoReportes) {
        this.expertoReportes = expertoReportes;
    }

    //reportes de gerencia

    @GetMapping("/inmuebles")
    public ResponseEntity<List<DTOInmueblesFiltro>> obtenerInmueblesFiltro() {
        return ResponseEntity.ok(expertoReportes.obtenerInmueblesFiltro());
    }

    //reportes de gerencia

    //reportes de finanzas

    @GetMapping("/estadisticasFinancieras")
    public ResponseEntity<DTOReportesFinanzas> obtenerEstadisticasFinancieras(String anio, String mes) {
        return ResponseEntity.ok(expertoReportes.obtenerEstadisticasFinancieras(anio, mes));
    }
    //reportes de finanzas


}
