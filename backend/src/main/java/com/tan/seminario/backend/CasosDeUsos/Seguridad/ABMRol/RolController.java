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

    // ALTA ROL - Envio el Nombre y el codigo en DTOCrearRolRequest
    @PostMapping
    public ResponseEntity<Void> crearRol(@RequestBody DTOCrearRolRequest dto) {
        Rol rolCreado = experto.crearRol(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build(); // Status 201 es Created
    }

    // MODIFICAR ROL
    @PutMapping
    public ResponseEntity<Void> modificarRol(@RequestBody DTOModificarRolRequest request) {
        experto.modificarRol(request);
        return ResponseEntity.ok().build(); // Devuelve 200 OK sin cuerpo
    }

    // LISTAR ROLES
    @GetMapping
    public ResponseEntity<List<Rol>> listarRoles() {
        List<Rol> rolesActivos = experto.listarRolesActivos();
        return ResponseEntity.ok(rolesActivos); // Devuelve 200 OK con la lista de roles
    }

    // BAJA ROL - Envio el codRol
    @PutMapping("/{codRol}")
    public ResponseEntity<Void> bajaRol(@PathVariable String codRol) {
        experto.bajaRol(codRol);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}