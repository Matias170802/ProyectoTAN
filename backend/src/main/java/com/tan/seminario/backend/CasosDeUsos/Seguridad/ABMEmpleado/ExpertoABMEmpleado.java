package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoResponse;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.AuthService;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.RegisterRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.TokenResponse;
import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.EmpleadoRol;
import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Repository.EmpleadoRepository;
import com.tan.seminario.backend.Repository.RolRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpertoABMEmpleado {

    private final EmpleadoRepository empleadoRepository;
    private final RolRepository rolRepository;
    private final AuthService authService;

    @Transactional
    public AltaEmpleadoResponse altaEmpleado(AltaEmpleadoRequest request) {
        validarRequest(request);

        String codigoEmpleado = generarCodigoEmpleado();
        validarDniUnico(request.getDniEmpleado());
        List<Rol> rolesValidos = validarYObtenerRoles(request.getCodRoles());

        Empleado empleado = crearEmpleado(request, codigoEmpleado);
        asociarRolesAEmpleado(empleado, rolesValidos);

        empleado = empleadoRepository.save(empleado);

        // Crear usuario
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .cod(codigoEmpleado)
                .tipoUsuario(RegisterRequest.TipoUsuario.EMPLEADO)
                .build();

        TokenResponse tokenResponse = authService.register(registerRequest);



        //  TODO: Crear caja

        // TODO: Asignar tokens al response
        return construirResponse(empleado);
    }



    // BAJA EMPLEADO

    // MODIFICAR EMPLEADO

    // LISTAR EMPLEADOS


    // -----------------------------------

    // METODOS PRIVADOS AUXILIARES
    private void validarRequest(AltaEmpleadoRequest request) {
        if (request.getCodRoles() == null || request.getCodRoles().isEmpty()) {
            throw new IllegalArgumentException("Debe asignar al menos un rol");
        }
    }

    private String generarCodigoEmpleado() {
        // Obtener el último código
        String ultimoCodigo = empleadoRepository.findTopByOrderByCodEmpleadoDesc()
                .map(Empleado::getCodEmpleado)
                .orElse("EMPL-000");

        // Extraer el número y incrementar
        int numero = Integer.parseInt(ultimoCodigo.split("-")[1]);
        numero++;

        // Formatear con ceros a la izquierda
        return String.format("EMPL-%03d", numero);
    }

    private void validarDniUnico(String dni) {
        if (empleadoRepository.existsByDniEmpleadoAndFechaHoraBajaEmpleadoIsNull(dni)) {
            throw new IllegalArgumentException("Ya existe un empleado activo con ese DNI");
        }
    }

    private List<Rol> validarYObtenerRoles(List<String> codRoles) {
        List<Rol> roles = rolRepository
                .findAllByCodRolInAndFechaHoraBajaRolIsNull(codRoles);

        if (roles.size() != codRoles.size()) {
            throw new IllegalArgumentException("Algunos roles son inválidos o están inactivos");
        }

        return roles;
    }

    private Empleado crearEmpleado(AltaEmpleadoRequest request, String codigoEmpleado) {
        return Empleado.builder()
                .dniEmpleado(request.getDniEmpleado())
                .codEmpleado(codigoEmpleado)
                .nombreEmpleado(request.getNombreEmpleado())
                .nroTelefonoEmpleado(request.getNroTelefonoEmpleado())
                .salarioEmpleado(request.getSalarioEmpleado())
                .fechaHoraAltaEmpleado(LocalDateTime.now())
                .fechaHoraBajaEmpleado(null)
                .fechaUltimoCobroSalario(null)
                .empleadosRoles(new ArrayList<>())
                .build();
    }

    private void asociarRolesAEmpleado(Empleado empleado, List<Rol> roles) {
        LocalDateTime ahora = LocalDateTime.now();

        for (Rol rol : roles) {
            EmpleadoRol empleadoRol = EmpleadoRol.builder()
                    .fechaHoraAltaEmpleadoRol(ahora)
                    .fechaHoraBajaEmpleadoRol(null)
                    .empleado(empleado)
                    .rol(rol)
                    .build();

            empleado.getEmpleadosRoles().add(empleadoRol);
        }
    }

    private AltaEmpleadoResponse construirResponse(Empleado empleado) {

        return AltaEmpleadoResponse.builder()
                .build();
    }
}

// ABM EMPLEADO LO REALIZA LA GERENCIA -> Un empleado con el rol de gerente.
//Si se da de baja a un empleado: codEmpleado
