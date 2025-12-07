package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/inmuebles")
public class InmuebleController {
    @Autowired
    private ExpertoInmueble experto;

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
