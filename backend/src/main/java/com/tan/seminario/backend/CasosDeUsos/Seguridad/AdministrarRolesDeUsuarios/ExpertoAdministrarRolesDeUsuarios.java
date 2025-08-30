package com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios.DTOAdministrarRolesDeUsuarios.DTORolesAsignados;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import java.util.stream.Collectors;

@Service
@Scope("request") // Esto es para que se cree una sola memoria para todos los usuarios, no haya problemas de concurrencia ni nada por el estilo
public class ExpertoAdministrarRolesDeUsuarios {

    MemoriaAdministrarRolesDeUsuario memoria = new MemoriaAdministrarRolesDeUsuario();

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private EmpleadoRolRepository empleadoRolRepository;

    @Autowired
    private RolRepository rolRepository;

    public List<DTOEmpleadoRoles> obtenerEmpleadoRoles() throws Exception {
        // Buscar empleados activos
        List<Empleado> empleados = empleadoRepository.filter(empleado -> empleado.getFechaHoraBajaEmpleado() == null);
        List<DTOEmpleadoRoles> listaDTO = new ArrayList<>();

        if (empleados.isEmpty()) {
            throw new Exception("No hay empleados activos");
        }

        for (Empleado empleado : empleados) {
            List<EmpleadoRol> empleadoRol = empleado.getEmpleadosRoles();
            empleadoRol.removeIf(empleadoRolValido -> empleadoRolValido.getFechaHoraBajaEmpleadoRol() != null);

            List<Rol> roles = empleadoRol.stream()
                    .map(EmpleadoRol::getRol)
                    .filter(rol -> rol.getFechaHoraBajaRol() == null)
                    .collect(Collectors.toList());

            List<String> codRoles = roles.stream().map(Rol::getCodRol).collect(Collectors.toList());
            List<String> nombreRoles = roles.stream().map(Rol::getNombreRol).collect(Collectors.toList());

            DTOEmpleadoRoles dto = new DTOEmpleadoRoles(
                empleado.getCodEmpleado(),
                empleado.getNombreEmpleado(),
                codRoles,
                nombreRoles
            );
            listaDTO.add(dto);
        }
        return listaDTO;
    }

//Corregir 
    public List<DTORolesDelEmpleado> obtenerRolesEmpleadoPorNombre(String nombre) throws Exception {
        List<Empleado> empleados = empleadoRepository.findByNombreEmpleadoContainingIgnoreCase(nombre);
        if (empleados.isEmpty()) {
            throw new Exception("Empleado no encontrado con nombre: " + nombre);
        }

        List<EmpleadoRol> empleadoRol = empleados.get(0).getEmpleadosRoles();
        empleadoRol.removeIf(empleadoRolValido -> empleadoRolValido.getFechaHoraBajaEmpleadoRol() != null);

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
    public void asignarRol(List<DTORolesAsignados> rolesAsignados) throws Exception {
        if (rolesAsignados == null || rolesAsignados.isEmpty()) {
            throw new Exception("La lista de roles a asignar no puede estar vacía");
        }

        // Obtenemos el empleado
        Empleado empleado = memoria.getEmpleado();

        // Procesamos cada rol a asignar
        for (DTORolesAsignados rolAsignado : rolesAsignados) {
            // Verificamos que el rol exista
            List<Rol> roles = rolRepository.findAll().stream()
                    .filter(rol -> rol.getCodRol().equals(rolAsignado.getCodRol()))
                    .toList();
            if (roles.isEmpty()) {
                throw new Exception("Rol no encontrado con código: " + rolAsignado.getCodRol());
            }

            Rol rol = roles.get(0);

            if (rol.getFechaHoraBajaRol() != null) {
                throw new Exception("El rol " + rol.getCodRol() + " está dado de baja");
            }



            // Creamos la nueva asignación
            EmpleadoRol empleadoRol = new EmpleadoRol();
            empleadoRol.setEmpleado(empleado);
            empleadoRol.setRol(rol);
            empleadoRol.setFechaHoraAltaEmpleadoRol(LocalDateTime.now());

            empleadoRolRepository.save(empleadoRol);
        }
    }

    public void desasignarRol(List<DTORolesAsignados> rolesDesasignados) throws Exception {
    if (rolesDesasignados == null || rolesDesasignados.isEmpty()) {
        throw new Exception("La lista de roles a desasignar no puede estar vacía");
    }

    // Obtenemos el empleado
    Empleado empleado = memoria.getEmpleado();

    // Procesamos cada rol a desasignar
    for (DTORolesAsignados rolDesasignado : rolesDesasignados) {
        // Buscamos el EmpleadoRol activo que corresponde
        List<EmpleadoRol> empleadosRoles = empleado.getEmpleadosRoles().stream()
                .filter(er -> er.getRol().getCodRol().equals(rolDesasignado.getCodRol())
                        && er.getFechaHoraBajaEmpleadoRol() == null)
                .toList();

        if (empleadosRoles.isEmpty()) {
            throw new Exception("No se encontró una asignación activa del rol: " + rolDesasignado.getCodRol());
        }

        // Establecemos la fecha de baja
        EmpleadoRol empleadoRol = empleadosRoles.get(0);
        empleadoRol.setFechaHoraBajaEmpleadoRol(LocalDateTime.now());

        empleadoRolRepository.save(empleadoRol);
    }
}
}