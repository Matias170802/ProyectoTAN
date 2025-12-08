package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble;

import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.AltaInmueble.DTOAltaInmuebleRequest;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.AltaInmueble.DTOAltaInmuebleResponse;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.BajaInmueble.DTOBajaInmuebleResponse;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.Listados.DTOInmuebleListado;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.ModificarInmueble.DTOModificarInmuebleRequest;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.ModificarInmueble.DTOModificarInmuebleResponse;
import com.tan.seminario.backend.config.security.RequireRoles;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inmuebles")
@RequireRoles("ROL002")
@RequiredArgsConstructor
public class InmuebleController {
    @Autowired
    private ExpertoInmueble expertoABMInmueble;

    // ============================================================
    // ALTA INMUEBLE
    // ============================================================
    @PostMapping("/alta")
    public ResponseEntity<DTOAltaInmuebleResponse> altaInmueble(
            @Valid @RequestBody DTOAltaInmuebleRequest request
    ) {
        DTOAltaInmuebleResponse inmuebleResponse = expertoABMInmueble.altaInmueble(request);
        return ResponseEntity.ok(inmuebleResponse);
    }

    // ============================================================
    // BAJA INMUEBLE
    // ============================================================
    @DeleteMapping("/baja/{id}")
    public ResponseEntity<DTOBajaInmuebleResponse> bajaInmueble(
            @PathVariable("id") Long id
    ) {
        DTOBajaInmuebleResponse response = expertoABMInmueble.bajaInmueble(id);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // MODIFICAR INMUEBLE
    // ============================================================
    @PatchMapping("/modificar/{id}")
    public ResponseEntity<DTOModificarInmuebleResponse> modificarInmueble(
            @PathVariable("id") Long id,
            @Valid @RequestBody DTOModificarInmuebleRequest request
    ) {
        DTOModificarInmuebleResponse response = expertoABMInmueble.modificarInmueble(id, request);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // LISTAR TODOS LOS INMUEBLES
    // ============================================================
    @GetMapping("/listar")
    public ResponseEntity<List<DTOInmuebleListado>> listarTodosLosInmuebles() {
        List<DTOInmuebleListado> inmuebles = expertoABMInmueble.listarTodosLosInmuebles();
        return ResponseEntity.ok(inmuebles);
    }

    // ============================================================
    // LISTAR UN ÚNICO INMUEBLE POR ID
    // ============================================================
    @GetMapping("/listar/{id}")
    public ResponseEntity<DTOInmuebleListado> listarInmueblePorId(
            @PathVariable("id") Long id
    ) {
        DTOInmuebleListado inmueble = expertoABMInmueble.listarInmueblePorId(id);
        return ResponseEntity.ok(inmueble);
    }

    // Este metodo no se que hace pero lo dejo pq el mati lo usa
    @GetMapping("/inmuebles")
    public ResponseEntity<List<DTOInmueble>> obtenerInmuebles() {
        try {
            List<DTOInmueble> inmuebles = expertoABMInmueble.obtenerInmuebles();
            return ResponseEntity.ok(inmuebles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of());
        }
    }
}
