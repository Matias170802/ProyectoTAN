package com.tan.seminario.backend.CasosDeUsos.Reservas.AMReserva;

import com.tan.seminario.backend.CasosDeUsos.Reservas.AMReserva.DTOsAMReserva.DTOModificarReserva;
import com.tan.seminario.backend.CasosDeUsos.Reservas.DTOReserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reserva")
public class AMReservaController {
    @Autowired
    ExpertoAMReserva experto;

    @PostMapping("/altaReserva")
    public ResponseEntity<?> altaReserva(@RequestBody DTOReserva reserva){
        try{
            String respuesta = experto.altaReserva(reserva);
            return ResponseEntity.ok(respuesta);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }
    }


    @PatchMapping("/reservas/{codReserva}")
    public ResponseEntity<?> modificarReserva(@PathVariable("codReserva") String codReserva,@RequestBody DTOModificarReserva dtoModificarReserva){
        try{
            String respuesta = experto.modificarReservas(codReserva,dtoModificarReserva);
            return ResponseEntity.ok(respuesta);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }
    }
}