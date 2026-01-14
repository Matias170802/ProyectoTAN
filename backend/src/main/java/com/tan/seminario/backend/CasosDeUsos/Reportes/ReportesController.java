package com.tan.seminario.backend.CasosDeUsos.Reportes;

import com.tan.seminario.backend.CasosDeUsos.Reportes.DTOs.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/reportes")
public class ReportesController {

    private final ExpertoReportes expertoReportes;

    public ReportesController(ExpertoReportes expertoReportes) {
        this.expertoReportes = expertoReportes;
    }

    //get de roles del usuario loggeado
    @GetMapping("/roles")
    public ResponseEntity<List<DTORoles>> obtenerRoles(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(expertoReportes.obtenerRoles(username));
    }
    //reportes de gerencia

    @GetMapping("/inmuebles")
    public ResponseEntity<List<DTOInmueblesFiltro>> obtenerInmueblesFiltro() {
        return ResponseEntity.ok(expertoReportes.obtenerInmueblesFiltro());
    }

    @GetMapping("/estadisticasGerencia/reservas")
    public ResponseEntity<DTOEstadisticasGerenciaReservas> obtenerEstadisticasGerenciaReservas(@RequestParam String anio, @RequestParam String mes) {
        return ResponseEntity.ok(expertoReportes.obtenerEstadisticasGerenciaReservas(anio, mes));
    }

    @GetMapping("/estadisticasGerencia/inmuebles")
    public ResponseEntity<DTOEstadisticasGerenciaInmuebles> obtenerEstadisticasGerenciaInmuebles(@RequestParam String anio, @RequestParam String mes, @RequestParam String inmueble) {
        return ResponseEntity.ok(expertoReportes.obtenerEstadisticasGerenciaInmuebles(anio, mes, inmueble));
    }

    //reportes de gerencia

    //reportes de finanzas

    @GetMapping("/estadisticasFinancieras")
    public ResponseEntity<DTOReportesFinanzas> obtenerEstadisticasFinancieras(@RequestParam String anio, @RequestParam String mes) {
        return ResponseEntity.ok(expertoReportes.obtenerEstadisticasFinancieras(anio, mes));
    }
    //reportes de finanzas


}
