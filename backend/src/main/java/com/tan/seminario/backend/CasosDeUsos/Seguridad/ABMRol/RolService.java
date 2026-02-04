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

    //Obtiene todos los roles disponibles (excluyendo ROL000 que es solo para clientes)
    public List<DTORolResponse> obtenerTodosLosRolesActivos() {
        List<Rol> roles = rolRepository.findByFechaHoraBajaRolIsNull();
        return roles.stream()
                // Filtrar el rol Cliente (ROL000) - solo para clientes
                .filter(rol -> !"ROL000".equals(rol.getCodRol()))
                .map(this::convertirADTO)
                .collect(Collectors.toList());
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
