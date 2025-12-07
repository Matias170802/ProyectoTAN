package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoResponse;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.BajaEmpleado.BajaEmpleadoResponse;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.Listados.DTOEmpleadoListado;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.ModificarEmpleado.DTOModificarEmpleado;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.ModificarEmpleado.DTOModificarEmpleadoResponse;
import com.tan.seminario.backend.config.security.RequireRoles;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empleado")
@RequireRoles("ROL002")
@RequiredArgsConstructor
public class ABMEmpleadoController {

    @Autowired
    private final ExpertoABMEmpleado service;

    // ============================================================
    // ALTA EMPLEADO
    // ============================================================
    @PostMapping("/alta")
    public ResponseEntity<AltaEmpleadoResponse> altaEmpleado(@Valid @RequestBody final AltaEmpleadoRequest request) {
        final AltaEmpleadoResponse empleadoResponse = service.altaEmpleado(request);
        return ResponseEntity.ok(empleadoResponse);
    }

    // ============================================================
    // BAJA EMPLEADO
    // ============================================================
    @DeleteMapping("/baja/{id}")
    public ResponseEntity<BajaEmpleadoResponse> bajaEmpleado(
            @PathVariable("id") final Long id
    ) {
        final BajaEmpleadoResponse response = service.bajaEmpleado(id);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // MODIFICACION EMPLEADO
    // ============================================================
    @PatchMapping("/modificar/{id}")
    public ResponseEntity<DTOModificarEmpleadoResponse> modificarEmpleado(
            @PathVariable("id") final Long id,
            @Valid @RequestBody final DTOModificarEmpleado request
    ) {
        final DTOModificarEmpleadoResponse response = service.modificarEmpleado(id, request);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // LISTAR TODOS LOS EMPLEADOS
    // ============================================================
    @GetMapping("/listar")
    public ResponseEntity<List<DTOEmpleadoListado>> listarTodosLosEmpleados() {
        final List<DTOEmpleadoListado> empleados = service.listarTodosLosEmpleados();
        return ResponseEntity.ok(empleados);
    }

    // ============================================================
    // LISTAR UN UNICO EMPLEADO POR ID
    // ============================================================
    @GetMapping("/listar/{id}")
    public ResponseEntity<DTOEmpleadoListado> listarEmpleadoPorId(
            @PathVariable("id") final Long id
    ) {
        final DTOEmpleadoListado empleado = service.listarEmpleadoPorId(id);
        return ResponseEntity.ok(empleado);
    }
}