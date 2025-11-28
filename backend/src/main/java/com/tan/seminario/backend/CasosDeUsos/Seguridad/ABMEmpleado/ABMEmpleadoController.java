package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoResponse;
import com.tan.seminario.backend.config.security.RequireRoles;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/empleado")
@RequireRoles("ROL002")
@RequiredArgsConstructor
public class ABMEmpleadoController {

    @Autowired
    private final ExpertoABMEmpleado service;

    // ALTA EMPLEADO
    @PostMapping("/alta")
    public ResponseEntity<AltaEmpleadoResponse> altaEmpleado(@Valid @RequestBody final AltaEmpleadoRequest request) {
        final AltaEmpleadoResponse empleadoResponse = service.altaEmpleado(request);
        return ResponseEntity.ok(empleadoResponse);
    }

    // BAJA EMPLEADO

    // MODIFICACION EMPLEADO

    // LISTAR TODOS LOS EMPLEADOS

    // LISTAR UN UNICO EMPLEADO POR ID
}