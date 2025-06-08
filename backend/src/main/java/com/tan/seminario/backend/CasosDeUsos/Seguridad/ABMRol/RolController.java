package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs.DTOCrearRolRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs.DTOModificarRolRequest;
import com.tan.seminario.backend.Entity.Rol;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    private final ExpertoABMRol experto;

    public RolController(ExpertoABMRol experto) {
        this.experto = experto;
    }

    // METODOS DEL CONTROLADOR
    // ALTA ROL
    @PostMapping
    public ResponseEntity<Rol> crearRol(@RequestBody DTOCrearRolRequest dto) {
        Rol rol = experto.crearRol(dto);
        return new ResponseEntity<>(rol, HttpStatus.CREATED); // Status 201 es Created
    }

    // BAJA ROL
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> bajaRol(@PathVariable Long id) {
        experto.bajaRol(id);
        return ResponseEntity.noContent().build();
    }

    // MODIFICAR ROL
    @PutMapping
    public ResponseEntity<Void> modificarRol(@RequestBody DTOModificarRolRequest request) {
        experto.modificarRol(request);
        return ResponseEntity.ok().build(); // Devuelve 200 OK sin cuerpo
    }
    // DUDA => Deberia devolver Void o Debe Devolver la lista con los Roles? Lo mismo para la Alta


    // LISTAR ROLES
    @GetMapping
    public ResponseEntity<List<Rol>> listarRoles() {
        List<Rol> rolesActivos = experto.listarRolesActivos();
        return ResponseEntity.ok(rolesActivos);
    }
}