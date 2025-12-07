package com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMRol.DTOs;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DTORolResponse {
    private Long id;
    private String codigo;
    private String nombre;
}
