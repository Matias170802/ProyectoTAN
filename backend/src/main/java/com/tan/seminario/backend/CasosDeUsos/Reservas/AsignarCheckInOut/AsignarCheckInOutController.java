package com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut;
import com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut.DTOsAsignarCheckInOut.DTOEmpleadosAsignados;
import com.tan.seminario.backend.CasosDeUsos.Reservas.AsignarCheckInOut.DTOsAsignarCheckInOut.DTOTarea;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reserva")
public class AsignarCheckInOutController {

    @Autowired
    ExpertoAsignarCheckInOut experto;

    @GetMapping("/asignarCheckInOut/{codReserva}")
    public ResponseEntity<DTOEmpleadosAsignados> obtenerEmpleadosYaAsignados(@PathVariable("codReserva") String codReserva){
        DTOEmpleadosAsignados dto = experto.obtenerEmpleadosYaAsignados(codReserva);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/asignarCheckInOut")
    public ResponseEntity<?> asignarCheckInOut(@RequestBody DTOTarea dtoTarea){
        try{
            String respuesta = experto.asignarCheckInOut(dtoTarea);
            return ResponseEntity.ok(respuesta);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }
    }
}
