package com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios.DTOAdministrarRolesDeUsuarios.DTORolesDelEmpleado;
import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.EmpleadoRol;
import com.tan.seminario.backend.Repository.EmpleadoRepository;
import com.tan.seminario.backend.Repository.EmpleadoRolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpertoAdministrarRolesDeUsuarios {
    
    @Autowired
    private EmpleadoRepository empleadoRepository;
    
    @Autowired
    private EmpleadoRolRepository empleadoRolRepository;

    public List<DTORolesDelEmpleado> obtenerRolesDelEmpleado(String codEmpleado) throws Exception {
        // Primero verificamos si existe el empleado
        List<Empleado> empleados = empleadoRepository.findByCodEmpleado(codEmpleado);
        if (empleados.isEmpty()) {
            throw new Exception("Empleado no encontrado con código: " + codEmpleado);
        }
        
        // Buscamos los roles activos
        List<EmpleadoRol> roles = empleadoRolRepository.findByFechaHoraBajaEmpleadoRolNull(codEmpleado);
        if (roles.isEmpty()) {
            return Collections.emptyList();
        }

        return roles.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private DTORolesDelEmpleado convertirADTO(EmpleadoRol empleadoRol) {
        return new DTORolesDelEmpleado(
                empleadoRol.getRol().getNombreRol(),
                empleadoRol.getRol().getCodRol());
    }
}