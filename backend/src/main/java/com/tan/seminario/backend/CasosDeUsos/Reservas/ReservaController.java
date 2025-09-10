package com.tan.seminario.backend.CasosDeUsos.Reservas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ExpertoReserva experto;

    @GetMapping("/reservas")
    public ResponseEntity<List<DTOReserva>> obtenerReservas(){
        try{
            List<DTOReserva> reservas = experto.obtenerReservas();
            return ResponseEntity.ok(reservas);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(List.of());
        }
    return null;
    }

}
