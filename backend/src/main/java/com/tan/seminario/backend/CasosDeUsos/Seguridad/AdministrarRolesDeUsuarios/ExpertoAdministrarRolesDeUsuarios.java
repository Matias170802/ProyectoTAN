package com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios.DTOAdministrarRolesDeUsuarios.DTOEmpleadoRoles;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.AdministrarRolesDeUsuarios.DTOAdministrarRolesDeUsuarios.DTORolesParaAsignar;
import com.tan.seminario.backend.Entity.Empleado;
import com.tan.seminario.backend.Entity.EmpleadoRol;
import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Repository.EmpleadoRepository;
import com.tan.seminario.backend.Repository.EmpleadoRolRepository;
import com.tan.seminario.backend.Repository.RolRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExpertoAdministrarRolesDeUsuarios {


    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private EmpleadoRolRepository empleadoRolRepository;

    @Autowired
    private RolRepository rolRepository;

    public List<DTOEmpleadoRoles> obtenerEmpleadoRoles() throws Exception {
        // Buscar empleados activos
        List<Empleado> empleados = empleadoRepository.findByFechaHoraBajaEmpleadoIsNull();
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
                    .distinct()
                    .toList();

            List<String> codRoles = roles.stream().map(Rol::getCodRol).toList();
            List<String> nombreRoles = roles.stream().map(Rol::getNombreRol).toList();

            DTOEmpleadoRoles dto = new DTOEmpleadoRoles(
                empleado.getCodEmpleado(),
                empleado.getNombreEmpleado(),
                codRoles,
                nombreRoles
            );
            listaDTO.add(dto);
        }

        //Ordenamos listaDTO alfabeticamente por nombre del empleado
        listaDTO.sort((a, b) -> a.getNombreEmpleado().compareToIgnoreCase(b.getNombreEmpleado()));

        return listaDTO;
    }

    public List<DTORolesParaAsignar> rolesDisponiblesParaAsignar (String codEmpleado) throws Exception {
        //Buscamos todos los roles posibles para asignarle al empleado, Tienen que ser los roles disponibles que no tenga asignados
        // Buscamos al empleado del codEmpleado
        List<Empleado> empleado = empleadoRepository.findByCodEmpleado(codEmpleado);
        if (empleado.get(0).getFechaHoraBajaEmpleado() != null) {
            throw new Exception("El empleado esta dado de baja");
        }

        List<EmpleadoRol> rolesDelEmpleado = empleado.get(0).getEmpleadosRoles();


        //Tengo que Buscar todos lso roles existentes con fecha horaBaja =! de vacio
        List<Rol> rolesDisponibles = rolRepository.findAll();

        rolesDisponibles.removeIf(rol -> rol.getFechaHoraBajaRol() != null);

        // Eliminar roles que ya tiene el empleado
        for (Rol rol : rolesDisponibles) {
            for (EmpleadoRol empleadoRol : rolesDelEmpleado) {
                if (rol.getCodRol().equals(empleadoRol.getRol().getCodRol())) {
                    rolesDisponibles.remove(rol);
                    break;
                }
            }
        }

        List<DTORolesParaAsignar> dtoRolesParaAsignar = new ArrayList<>();
        for (Rol rolDisponible : rolesDisponibles) {
            DTORolesParaAsignar dtoRolAsignar = new DTORolesParaAsignar(rolDisponible.getCodRol(), rolDisponible.getNombreRol());
            dtoRolesParaAsignar.add(dtoRolAsignar);
        }

        return dtoRolesParaAsignar;
    }

    public List<DTORolesParaAsignar> rolesAsignados (String codEmpleado) throws Exception {

        // Buscamos al empleado del codEmpleado
        List<Empleado> empleado = empleadoRepository.findByCodEmpleado(codEmpleado);
        if (empleado.get(0).getFechaHoraBajaEmpleado() != null) {
            throw new Exception("El empleado esta dado de baja");
        }
        List<EmpleadoRol> rolesDelEmpleado = empleado.get(0).getEmpleadosRoles();

        List<DTORolesParaAsignar> dtoRolesParaAsignar = new ArrayList<>();
        for (EmpleadoRol empleadoRol : rolesDelEmpleado) {
            DTORolesParaAsignar dtoRolAsignar = new DTORolesParaAsignar(empleadoRol.getRol().getCodRol(), empleadoRol.getRol().getNombreRol());
            dtoRolesParaAsignar.add(dtoRolAsignar);
        }

        return dtoRolesParaAsignar;
    }

    @Transactional
    public void asignarRol(List<DTOEmpleadoRoles> rolesAsignados) throws Exception {
        if (rolesAsignados == null || rolesAsignados.isEmpty()) {
            throw new Exception("La lista de roles a asignar no puede estar vacía");
        }
        //obtener el Empleado
        String codEmpleado = rolesAsignados.get(0).getCodEmpleado();
        List<Empleado> empleado = empleadoRepository.findByCodEmpleado(codEmpleado);

        for (DTOEmpleadoRoles dtoEmpleadoRoles : rolesAsignados) {
            List<String> codigosRoles = dtoEmpleadoRoles.getCodRol();
            for (String codRol : codigosRoles) {
                Rol rol = rolRepository.findByCodRol(codRol);
                EmpleadoRol empleadoRol = new EmpleadoRol();
                empleadoRol.setRol(rol);
                empleadoRol.setEmpleado(empleado.get(0));
                empleadoRol.setFechaHoraAltaEmpleadoRol(LocalDateTime.now());
                empleadoRol.setFechaHoraBajaEmpleadoRol(null);
                empleadoRolRepository.save(empleadoRol);
            }
        }
    }

    @Transactional
    public void desasignarRol(List<DTOEmpleadoRoles> rolesDesasignados) throws Exception {
        if (rolesDesasignados == null || rolesDesasignados.isEmpty()) {
        throw new Exception("La lista de roles a desasignar no puede estar vacía");
    }

        // Obtenemos el empleado
        List<Empleado> empleado = empleadoRepository.findByCodEmpleado(rolesDesasignados.get(0).getCodEmpleado());
        List<EmpleadoRol> empleadoRol = empleado.get(0).getEmpleadosRoles();
        empleadoRol.removeIf(empleadoRolValido -> empleadoRolValido.getFechaHoraBajaEmpleadoRol() != null);

        List<String> codigosRolEmpleado = new ArrayList<>();
        for (EmpleadoRol empleadoRolValido : empleadoRol) {
            String codRolEmpleado = empleadoRolValido.getRol().getCodRol();
            codigosRolEmpleado.add(codRolEmpleado);
        }


        // Procesamos cada rol a desasignar
        List<String> codigosRolesDTO = new ArrayList<>();
        for (DTOEmpleadoRoles dtoEmpleadoRoles : rolesDesasignados) {
            List<String> codigosRoles = dtoEmpleadoRoles.getCodRol();
            for (String codRol : codigosRoles) {
                codigosRolesDTO.add(codRol);
            }

        }

        for (EmpleadoRol er : empleadoRol) {
            String codRolEmpleado = er.getRol().getCodRol();
            if (codigosRolEmpleado.contains(codRolEmpleado)){
                er.setFechaHoraBajaEmpleadoRol(LocalDateTime.now());
                empleadoRolRepository.save(er);
            }
        }
    }
}
