package com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios.DTOAdministrarRolesDeUsuarios.DTORolesDelEmpleado;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios.DTOAdministrarRolesDeUsuarios.DTORolesParaAsignar;
import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.EmpleadoRol;
import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Repository.EmpleadoRepository;
import com.tan.seminario.backend.Repository.EmpleadoRolRepository;
import com.tan.seminario.backend.Repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Scope("request") // Esto es para que se cree una sola memoria para todos los usuarios, no haya problemas de concurrencia ni nada por el estilo
public class ExpertoAdministrarRolesDeUsuarios {

    MemoriaAdministrarRolesDeUsuario memoria = new MemoriaAdministrarRolesDeUsuario();

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private RolRepository rolRepository;

    public List<DTORolesDelEmpleado> obtenerRolesDelEmpleado(String codEmpleado) throws Exception {
        // Primero verificamos si existe el empleado
        List<Empleado> empleados = empleadoRepository.findByCodEmpleado(codEmpleado);
        if (empleados.isEmpty()) {
            throw new Exception("Empleado no encontrado con código: " + codEmpleado);
        }
        //Revisamos que no tenga fechaHoraBajaEmpleado distinto de vació
        Empleado empleado = empleados.get(0);
        //Recordamos al Empleado

        if (empleado.getFechaHoraBajaEmpleado() != null) {
            throw new Exception("El empleado esta dado de baja");
        }

        // Buscamos EmpleadoRol activos
        List<EmpleadoRol> empleadoRol = empleado.getEmpleadosRoles();

        empleadoRol.removeIf(empleadoRolValido -> empleadoRolValido.getFechaHoraBajaEmpleadoRol() != null);

        // Buscamos el nombre y codigo del Rol y lo agregamos al DTO
        List<DTORolesDelEmpleado> dtoRolesDelEmpleados = new ArrayList<>();
        for (EmpleadoRol a : empleadoRol) {
            Rol rol = a.getRol();
            DTORolesDelEmpleado dtoRol = new DTORolesDelEmpleado(rol.getNombreRol(), rol.getCodRol());
            dtoRolesDelEmpleados.add(dtoRol);
            memoria.agregarRol(rol);

        }
            if (dtoRolesDelEmpleados.isEmpty()) {
                throw new Exception("El empleado no tiene roles activos");
            }

        return dtoRolesDelEmpleados;

    }
    public List<DTORolesParaAsignar> rolesDisponiblesParaAsignar () {
        //Buscamos todos los roles posibles para asignarle al empleado, Tienen que ser los roles disponibles que no tenga asignados
        //Me traigo los roles que tiene asignados el empleado para filtrar y que no los pueda asignar
        List<Rol> rolesDelEmpleado = memoria.getRolesDelEmpleado();

        //Tengo que Buscar todos lso roles existentes con fecha horaBaja =! de vacio
        List<Rol> rolesDisponibles = rolRepository.findAll();

        rolesDisponibles.removeIf(rol -> rol.getFechaHoraBajaRol() != null);

        // Eliminar roles que ya tiene el empleado
        rolesDisponibles.removeIf(rolDisponible ->
                rolesDelEmpleado.stream()
                        .anyMatch(rolEmpleado ->
                                rolEmpleado.getCodRol().equals(rolDisponible.getCodRol())
                        )
        );

        List<DTORolesParaAsignar> dtoRolesParaAsignar = new ArrayList<>();
        for (Rol rolDisponible : rolesDisponibles) {
            DTORolesParaAsignar dtoRolAsignar = new DTORolesParaAsignar(rolDisponible.getCodRol(), rolDisponible.getNombreRol());
            dtoRolesParaAsignar.add(dtoRolAsignar);
        }

        return dtoRolesParaAsignar;
    }
}