package com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios.DTOAdministrarRolesDeUsuarios.DTOEmpleadoRoles;
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

    @GetMapping("/empleados")
    public ResponseEntity<List<DTOEmpleadoRoles>> obtenerEmpleadoRoles() {
        try {
            List<DTOEmpleadoRoles> empleadoRoles = experto.obtenerEmpleadoRoles();
            return ResponseEntity.ok(empleadoRoles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(List.of());
        }
    }


    @GetMapping("/roles-a-asignar-empleado/{codEmpleado}")
    public ResponseEntity<List<DTORolesParaAsignar>> rolesDisponiblesParaAsignar(@PathVariable("codEmpleado") String codEmpleado) {
        try {
            List<DTORolesParaAsignar> rolesParaAsignar = experto.rolesDisponiblesParaAsignar(codEmpleado);
            return ResponseEntity.ok(rolesParaAsignar);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(List.of());
        }
    }

    @GetMapping("/roles-asignados-empleado/{codEmpleado}")
    public ResponseEntity<List<DTORolesParaAsignar>> rolesAsignados(@PathVariable("codEmpleado") String codEmpleado) {
        try {
            List<DTORolesParaAsignar> rolesAsignadosdelEmpleado = experto.rolesAsignados(codEmpleado);
            return ResponseEntity.ok(rolesAsignadosdelEmpleado);
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(List.of());
        }
    }

    @PostMapping("/asignar")
    public ResponseEntity<String> asignarRol(@RequestBody List<DTOEmpleadoRoles> rolesAsignados) {
        try {
            experto.asignarRol(rolesAsignados);
            return ResponseEntity.ok("Roles asignados correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PatchMapping("/desasignar") // Hacemos un Update
    // Uso el mismo DTO que asignar ya que tiene los mismos datos, basicamente el front entrega el mismo DTO
    public ResponseEntity<String> desasignarRol(@RequestBody List<DTOEmpleadoRoles> rolesDesasignados) {
        try {
            experto.desasignarRol(rolesDesasignados);
            return ResponseEntity.ok("Roles desasignados correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}