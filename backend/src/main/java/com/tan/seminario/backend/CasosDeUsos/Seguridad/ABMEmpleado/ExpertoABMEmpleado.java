package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMEmpleado.DTOs.AltaEmpleado.AltaEmpleadoResponse;
import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.EmpleadoRol;
import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Repository.EmpleadoRepository;
import com.tan.seminario.backend.Repository.RolRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExpertoABMEmpleado {

    private final EmpleadoRepository empleadoRepository;
    private final RolRepository rolRepository;

    // ALTA EMPLEADO
    @Transactional
    public AltaEmpleadoResponse altaEmpleado(AltaEmpleadoRequest request) {
        // 1. Generar código automáticamente
        String codigoEmpleado = generarCodigoEmpleado();

        // 2. Validar DNI no repetido
        if (empleadoRepository.existsByDniEmpleadoAndFechaHoraBajaEmpleadoIsNull(request.getDniEmpleado())) {
            throw new IllegalArgumentException("Ya existe un empleado activo con ese DNI");
        }

        // 3. Obtener Roles y validar su actividad.
        List<Rol> rolesValidos = new ArrayList<>();
        for (String codRol : request.getCodRoles()) {
            Optional<Rol> rol = rolRepository.findByCodRolAndFechaHoraBajaRolIsNull(codRol);
            if (rol.isEmpty()) {
                throw new IllegalArgumentException("Al menos uno de los roles ingresados es inválido.");
            }
            rolesValidos.add(rol.get());
        }

        // 4. Crear entidad Empleado (sin roles todavía)
        Empleado empleado = Empleado.builder()
                .dniEmpleado(request.getDniEmpleado())
                .codEmpleado(codigoEmpleado)
                .nombreEmpleado(request.getNombreEmpleado())
                .nroTelefonoEmpleado(request.getNroTelefonoEmpleado())
                .salarioEmpleado(request.getSalarioEmpleado())
                .fechaHoraBajaEmpleado(null)
                .fechaHoraAltaEmpleado(LocalDateTime.now())
                .fechaUltimoCobroSalario(null)
                .empleadosRoles(new ArrayList<>())
                .build();

        // 5. Guardar Empleado en BD primero (para que tenga ID)
        empleado = empleadoRepository.save(empleado);

        // 6. Crear y asociar EmpleadoRol para cada Rol válido
        for (Rol rol : rolesValidos) {
            EmpleadoRol empleadoRol = new EmpleadoRol();
            empleadoRol.setFechaHoraAltaEmpleadoRol(LocalDateTime.now());
            empleadoRol.setFechaHoraBajaEmpleadoRol(null);
            empleadoRol.setEmpleado(empleado);
            empleadoRol.setRol(rol);

            // Agregar a la lista del empleado
            empleado.getEmpleadosRoles().add(empleadoRol);
        }

        // 7. Guardar nuevamente el empleado (esto guardará las relaciones por cascade)
        empleado = empleadoRepository.save(empleado);

        // 8. TODO: IR A CREAR EL USUARIO CON EL CODIGO EMPLEADO desde el servicio


        // 9. TODO: Crear EmpleadoCaja

        // Construir el RESPONSE
        return construirResponse(empleado);
    }

    // BAJA EMPLEADO

    // MODIFICAR EMPLEADO

    // LISTAR EMPLEADOS


    // -----------------------------------

    // METODOS PRIVADOS AUXILIARES
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

    private AltaEmpleadoResponse construirResponse(Empleado empleado) {

        return AltaEmpleadoResponse.builder()
                .build();
    }

}

// ABM EMPLEADO LO REALIZA LA GERENCIA -> Un empleado con el rol de gerente.
//Si se da de baja a un empleado: codEmpleado
