package com.tan.seminario.backend.Services;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs.CrearRolRequest;
import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs.ModificarRolRequest;
import com.tan.seminario.backend.Entity.Rol;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RolService /* extends BaseService<Rol,Long> */ {
    //ALTA
    void crearRol (CrearRolRequest request);

    //BAJA
    void bajaRol(Long id);

    //MODIFICACION
    void modificarRol(ModificarRolRequest request);

    // LISTAR TODOS LOS ROLES (Para el CU: Asignar Roles)
    List<Rol> listarRoles();
}