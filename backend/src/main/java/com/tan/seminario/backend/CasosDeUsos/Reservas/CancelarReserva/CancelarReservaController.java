package com.tan.seminario.backend.CasosDeUsos.Reservas.CancelarReserva;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/reserva")
public class CancelarReservaController {
    @Autowired
    private ExpertoCancelarReserva experto;

    @PatchMapping("/cancelarReserva/{codReserva}")
    public ResponseEntity<?> cancelarReserva(@PathVariable("codReserva") String codReserva){
        String reservaCancelada = experto.cancelarReserva(codReserva);
        return ResponseEntity.status(HttpStatus.CREATED).body(reservaCancelada);
    }
}
