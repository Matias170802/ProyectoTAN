package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs.CrearRolRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs.ModificarRolRequest;
import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Repository.RolRepository;
import com.tan.seminario.backend.ServicesImpl.RolServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ABMRol  {

    private final RolServiceImpl rolServiceImpl;

    // Inyección de dependencia de RolServiceImpl (interfaz RolService)
    public ABMRol (RolServiceImpl rolServiceImpl) {
        this.rolServiceImpl = rolServiceImpl;
    }
    // ALTA ROL
    @Transactional
    public void crearRol(CrearRolRequest request) {
        // Delego al servicio base
        rolServiceImpl.crearRol(request);
    }

    // MODIFICAR ROL
    @Transactional
    public void modificarRol(ModificarRolRequest request) {
        rolServiceImpl.modificarRol(request);
    }

    // BAJA ROL
    @Transactional
    public void bajaRol(Long id) {
        rolServiceImpl.bajaRol(id);
    }
}