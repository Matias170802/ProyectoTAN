package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DTOModificarRolRequest {
    private Long idRol;
    private String nombreRol;
}
