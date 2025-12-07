package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs.DTORolResponse;
import com.tan.seminario.backend.Entity.Rol;
import com.tan.seminario.backend.Repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RolService {

    @Autowired
    private RolRepository rolRepository;

    //Obtiene todos los roles disponibles
    public List<DTORolResponse> obtenerTodosLosRolesActivos() {
        List<Rol> roles = rolRepository.findByFechaHoraBajaRolIsNull();
        return roles.stream() //Un Stream permite aplicar operaciones funcionales (como map, filter, etc.) sobre la colección
                .map(this::convertirADTO)
                .collect(Collectors.toList()); //Convierte Stream<DTORolResponse> → List<DTORolResponse>
    }

    // ========== MÉTODOS PRIVADOS ==========

    //Convierte entidad Rol a DTO
    private DTORolResponse convertirADTO(Rol rol) {
        return DTORolResponse.builder()
                .id(rol.getId())
                .codigo(rol.getCodRol())
                .nombre(rol.getNombreRol())
                .build();
    }
}
