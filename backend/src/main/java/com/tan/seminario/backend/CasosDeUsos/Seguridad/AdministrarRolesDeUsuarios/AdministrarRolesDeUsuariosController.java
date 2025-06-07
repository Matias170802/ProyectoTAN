package com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios.dto.AsignarRolRequest;
import com.tan.seminario.backend.Entity.EmpleadoRol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/administrar-roles-de-usuarios")
public class AdministrarRolesDeUsuariosController {

    @Autowired
    private ExpertoAdministrarRolesDeUsuarios experto;

    @PostMapping("/asignar")
    public ResponseEntity<EmpleadoRol> asignarRol(@RequestBody AsignarRolRequest request) {
        return ResponseEntity.ok(experto.asignarRol(request.getIdEmpleado(), request.getIdRol()));
    }

    @GetMapping("/empleado/{idEmpleado}")
    public ResponseEntity<List<EmpleadoRol>> obtenerRolesPorEmpleado(@PathVariable Long idEmpleado) {
        return ResponseEntity.ok(experto.obtenerRolesPorEmpleado(idEmpleado));
    }

    @DeleteMapping("/desasignar/{idEmpleadoRol}")
    public ResponseEntity<Void> desasignarRol(@PathVariable Long idEmpleadoRol) {
        experto.desasignarRol(idEmpleadoRol);
        return ResponseEntity.ok().build();
    }
}