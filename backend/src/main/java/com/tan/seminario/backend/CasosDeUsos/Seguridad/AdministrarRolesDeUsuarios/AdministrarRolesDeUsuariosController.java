package com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios.DTOAdministrarRolesDeUsuarios.DTORolesAsignados;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios.DTOAdministrarRolesDeUsuarios.DTORolesDelEmpleado;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios.DTOAdministrarRolesDeUsuarios.DTORolesParaAsignar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/administrador")
public class AdministrarRolesDeUsuariosController {

    @Autowired
    private ExpertoAdministrarRolesDeUsuarios experto;


    @GetMapping("/empleado/{codEmpleado}")
    public ResponseEntity<List<DTORolesDelEmpleado>> obtenerRolesEmpleado(@PathVariable String codEmpleado) {
        try {
            List<DTORolesDelEmpleado> roles = experto.obtenerRolesEmpleado(codEmpleado);
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(List.of());
        }
    }

    @GetMapping("/administrar-roles")
    public ResponseEntity<List<DTORolesParaAsignar>> rolesDisponiblesParaAsignar() {
        try {
            List<DTORolesParaAsignar> rolesParaAsignar = experto.rolesDisponiblesParaAsignar();
            return ResponseEntity.ok(rolesParaAsignar);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(List.of());
        }
    }

    @PostMapping("/asignar")
    public ResponseEntity<String> asignarRol(@RequestBody List<DTORolesAsignados> rolesAsignados) {
        try {
            experto.asignarRol(rolesAsignados);
            return ResponseEntity.ok("Roles asignados correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/desasignar")
    // Uso el mismo DTO que asignar ya que tiene los mismos datos, basicamente el front entrega el mismo DTO
    public ResponseEntity<String> desasignarRol(@RequestBody List<DTORolesAsignados> rolesDesasignados) {
        try {
            experto.desasignarRol(rolesDesasignados);
            return ResponseEntity.ok("Roles desasignados correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}