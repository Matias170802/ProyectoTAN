package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMCliente;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMCliente.DTOs.DTOAltaClienteRequest;
import com.tan.seminario.backend.Entity.Cliente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cliente")
public class ABMClienteController {

    @Autowired
    private final ExpertoABMCliente experto;

    public ABMClienteController(ExpertoABMCliente experto) {
        this.experto = experto;
    }

    // ALTA CLIENTE
    @PostMapping
    public ResponseEntity<?> crearCliente (@RequestBody DTOAltaClienteRequest dtoAltaClienteRequest) {
        try {
            experto.altaCliente(dtoAltaClienteRequest);


        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }


    // BAJA CLIENTE


    // MODIFICAR CLIENTE


    // LISTAR CLIENTES
    @GetMapping
    public ResponseEntity<List<Cliente>> listarRoles() {
        List<Cliente> clientesActivos = experto.listarClientesActivos();
        // Devuelve 200 OK con la lista de Clientes
        return ResponseEntity.ok(clientesActivos);
    }
}
