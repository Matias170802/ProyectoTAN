package com.tan.seminario.backend.ServicesImpl;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs.CrearRolRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs.ModificarRolRequest;
import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Repository.RolRepository;
import com.tan.seminario.backend.Services.RolService;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class RolServiceImpl implements RolService {

    //Repositorio del Rol
    private final RolRepository rolRepository;

    //Constructor
    public RolServiceImpl (RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    //ALTA
    @Transactional
    public void crearRol (CrearRolRequest request){
        List<Rol> roles = rolRepository.findByNombre(request.getNombreRol());
        // Verificar que no exista un Rol igual
        for (Rol rol : roles) {
            // Si alguno NO esta dado de baja, el rol ya existe
            if (rol.getFechaHoraBajaRol() == null) {
                throw new IllegalArgumentException("El rol ya existe y está activo.");
            }
        }
        // Crear nuevo rol
        Rol nuevoRol = new Rol();
        nuevoRol.setNombreRol(request.getNombreRol());
        nuevoRol.setFechaHoraAltaRol(LocalDateTime.now());
        nuevoRol.setFechaHoraBajaRol(null); // por claridad, aunque suele ser null por defecto

        // Metodo que guarda el Rol en BD
        rolRepository.save(nuevoRol);
    }

    //BAJA
    @Transactional
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

    //MODIFICACION
    @Transactional
    public void modificarRol(ModificarRolRequest request){
        //Solo puedo modificar el nombre del Rol
        // Verificar que no exista un Rol con el mismo nombre
        List<Rol> rolsFetched = rolRepository.findByNombre(request.getNombreRol());
        if (!rolsFetched. isEmpty()) {
            for (Rol rol : rolsFetched) {
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

    // LISTAR TODOS LOS ROLES (Para el CU: Asignar Roles)
    @Transactional ()
    public List<Rol> listarRoles(){
        return rolRepository.findAll();
    }
}
