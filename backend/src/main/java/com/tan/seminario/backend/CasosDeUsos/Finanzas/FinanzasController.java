package com.tan.seminario.backend.CasosDeUsos.Finanzas;

import com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas.DTOBalance;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas.DTOCajas;
import com.tan.seminario.backend.CasosDeUsos.Finanzas.DTOFinanzas.DTOMovimientos;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @GetMapping("/movimientos")
    public ResponseEntity<List<DTOMovimientos>> buscarMovimientos(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(expertoFinanzas.buscarMovimientos(username));
    }

    @GetMapping("/balance")
    public ResponseEntity<DTOBalance> buscarBalance(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(expertoFinanzas.buscarBalance(username));
    }

}
