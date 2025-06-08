package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs.DTOCrearRolRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs.DTOModificarRolRequest;
import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Repository.RolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ExpertoABMRol {

    private final RolRepository rolRepository;

    public ExpertoABMRol(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    // Crear Rol
    @Transactional
    public Rol crearRol(DTOCrearRolRequest request) {
        // Verificar que no exista un Rol igual
        // Pueden existir roles con el mismo nombre pero dados de Baja Logica
        List<Rol> roles = rolRepository.findByNombreRolIgnoreCase(request.getNombreRol());
        for (Rol rol : roles) {
            // Verifico si existe un rol con el mismo nombre y que no esté dado de baja
            if (rol.getFechaHoraBajaRol() == null) {
                throw new IllegalArgumentException("El rol ya existe y está activo.");
            }
        }
        // Creo un nuevo rol
        Rol rol = new Rol();
        rol.setNombreRol(request.getNombreRol());
        rol.setCodRol(request.getCodRol());
        rol.setFechaHoraAltaRol(LocalDateTime.now());
        rol.setFechaHoraBajaRol(null); // por claridad, aunque suele ser null por defecto
        // Retorno al Controlador
        return rolRepository.save(rol);
    }

    // Dar de Baja un Rol
    @Transactional
    // Debe enviar el ID o el CodRol ????
    public void bajaRol(Long id) {
        // Verificar que el Rol exista
        Optional<Rol> rolFetched = rolRepository.findById(id);
        if (rolFetched.isEmpty()) {
            throw new IllegalArgumentException("El rol no existe");
        }
        // Verificar que el Rol no este dado de baja
        if (rolFetched.get().getFechaHoraBajaRol() != null) {
            throw new IllegalArgumentException("El rol ya está dado de baja");
        }
        // Dar de Baja el Rol
        Rol rol = rolFetched.get();
        //Seteo la hora de baja y guarda el cambio
        rol.setFechaHoraBajaRol(LocalDateTime.now());
        rolRepository.save(rol);
    }

    // Modificar un Rol
    // DEBE ENVIAR EL ID y el Nuevo NombreRol
    @Transactional
    public void modificarRol(DTOModificarRolRequest request){
        // Solo puedo modificar NombreRol
        // Verificar que no exista un Rol con el mismo nombre
        // Y si existe, que esté dado de baja
        List<Rol> rolesEncontrados  = rolRepository.findByNombreRolIgnoreCase(request.getNombreRol());
        // Verificar que encontro un Rol por el Nombre
        if (!rolesEncontrados . isEmpty()) {
            for (Rol rol : rolesEncontrados ) {
                // Si alguno NO esta dado de baja, el rol ya existe
                if (rol.getFechaHoraBajaRol() == null) {
                    throw new IllegalArgumentException("El rol ya existe y está activo.");
                }
            }
        }
        //Setear el nombre y guardar cambios
        // Traerme el Rol Existente y modificarlo
        Optional<Rol> rolToModify = rolRepository.findById(request.getIdRol());
        if (rolToModify.isEmpty()) {
            throw new IllegalArgumentException("El rol no existe");
        }
        if (rolToModify.get().getFechaHoraBajaRol() != null) {
            throw new IllegalArgumentException("El rol está dado de baja");
        }
        Rol rol = rolToModify.get();
        rol.setNombreRol(request.getNombreRol());
        rolRepository.save(rol);
    }

    // Listar Roles Activos
    @Transactional (readOnly = true)
    public List<Rol> listarRolesActivos() {
        return rolRepository.findByFechaHoraBajaRolIsNull();
    }
}
