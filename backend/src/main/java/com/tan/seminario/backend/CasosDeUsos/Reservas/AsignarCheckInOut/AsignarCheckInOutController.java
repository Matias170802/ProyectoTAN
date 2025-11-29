package com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut;
import com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut.DTOsAsignarCheckInOut.DTOTarea;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reserva")
public class AsignarCheckInOutController {

    @Autowired
    ExpertoAsignarCheckInOut experto;

    @PostMapping("/asignarCheckIn")
    public ResponseEntity<?> asignarCheckInOut(@RequestBody DTOTarea dtoTarea){
        try{
            String respuesta = experto.;
            return ResponseEntity.ok(respuesta);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }
    }
    }
}
