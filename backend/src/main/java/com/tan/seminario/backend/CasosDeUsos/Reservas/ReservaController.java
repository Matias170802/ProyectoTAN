package com.tan.seminario.backend.CasosDeUsos.Reservas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ExpertoReserva experto;

    @GetMapping("/reservas")
    public ResponseEntity<List<DTOReserva>> obtenerReservas(@RequestParam String anio,@RequestParam String mes){
        try{
            List<DTOReserva> reservas = experto.obtenerReservas(anio, mes);
            return ResponseEntity.ok(reservas);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(List.of());
        }
    }
    @GetMapping("/estados")
    public ResponseEntity<List<DTOEstadoReserva>> obtenerEstados() {
        try {
            List<DTOEstadoReserva> estados = experto.obtenerEstados();
            return ResponseEntity.ok(estados);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }
    }

    @GetMapping("/tipotarea")
    public ResponseEntity<?> obtenerTipoTarea(){
        try {
            List<DTOEstadoReserva> estados = experto.obtenerTipoTarea();
            return ResponseEntity.ok(estados);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }
    }

    @GetMapping("/inmuebles")
    public ResponseEntity<List<DTOInmueble>> obtenerInmuebles() {
        try {
            List<DTOInmueble> inmuebles = experto.obtenerInmuebles();
            return ResponseEntity.ok(inmuebles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }
    }
}

