package com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios.DTOAdministrarRolesDeUsuarios.DTORolesDelEmpleado;
import com.tan.seminario.backend.Entity.EmpleadoRol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seguridad")
public class AdministrarRolesDeUsuariosController {

    @Autowired
    private ExpertoAdministrarRolesDeUsuarios experto;


    @GetMapping("/empleado/{codEmpleado}")
    public ResponseEntity<List<DTORolesDelEmpleado>> obtenerRolesDelEmpleado(@PathVariable String codEmpleado) {
        try {
            List<DTORolesDelEmpleado> roles = experto.obtenerRolesDelEmpleado(codEmpleado);
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(List.of());
        }
    }
}