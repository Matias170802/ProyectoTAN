package com.tan.seminario.backend.CasosDeUsos.Finanzas;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas.DTOCajas;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/finanzas")
public class FinanzasController {

    private final ExpertoFinanzas expertoFinanzas;

    public FinanzasController (ExpertoFinanzas expertoFinanzas) {
        this.expertoFinanzas = expertoFinanzas;
    }

    @GetMapping
    public ResponseEntity<List<DTOCajas>> buscarCajas() {
        return ResponseEntity.ok(expertoFinanzas.buscarCajas());
    }

}
