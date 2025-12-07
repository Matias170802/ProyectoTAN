package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente;

import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.AltaCliente.DTOAltaClienteRequest;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.AltaCliente.DTOAltaClienteResponse;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.BajaCliente.DTOBajaClienteResponse;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.Listados.DTOClienteListado;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.ModificarCliente.DTOModificarClienteRequest;
import com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.ModificarCliente.DTOModificarClienteResponse;
import com.tan.seminario.backend.config.security.RequireRoles;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequireRoles("ROL002") // Solo Gerencia puede gestionar clientes
@RequiredArgsConstructor
public class ABMClienteController {

    private final ExpertoABMCliente expertoABMCliente;

    // ============================================================
    // ALTA CLIENTE
    // ============================================================
    @PostMapping("/alta")
    public ResponseEntity<DTOAltaClienteResponse> altaCliente(
            @Valid @RequestBody DTOAltaClienteRequest request
    ) {
        DTOAltaClienteResponse clienteResponse = expertoABMCliente.altaCliente(request);
        return ResponseEntity.ok(clienteResponse);
    }

    // ============================================================
    // BAJA CLIENTE
    // ============================================================
    @DeleteMapping("/baja/{id}")
    public ResponseEntity<DTOBajaClienteResponse> bajaCliente(
            @PathVariable("id") Long id
    ) {
        DTOBajaClienteResponse response = expertoABMCliente.bajaCliente(id);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // MODIFICAR CLIENTE
    // ============================================================
    @PatchMapping("/modificar/{id}")
    public ResponseEntity<DTOModificarClienteResponse> modificarCliente(
            @PathVariable("id") Long id,
            @Valid @RequestBody DTOModificarClienteRequest request
    ) {
        DTOModificarClienteResponse response = expertoABMCliente.modificarCliente(id, request);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // LISTAR TODOS LOS CLIENTES
    // ============================================================
    @GetMapping("/listar")
    public ResponseEntity<List<DTOClienteListado>> listarTodosLosClientes() {
        List<DTOClienteListado> clientes = expertoABMCliente.listarTodosLosClientes();
        return ResponseEntity.ok(clientes);
    }

    // ============================================================
    // LISTAR UN ÚNICO CLIENTE POR ID
    // ============================================================
    @GetMapping("/listar/{id}")
    public ResponseEntity<DTOClienteListado> listarClientePorId(
            @PathVariable("id") Long id
    ) {
        DTOClienteListado cliente = expertoABMCliente.listarClientePorId(id);
        return ResponseEntity.ok(cliente);
    }
}
