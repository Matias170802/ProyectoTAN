package com.tan.seminario.backend.CasosDeUsos.Seguridad.CambioCredenciales.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class DTOResponseGenerico {
    private String mensaje;
    private boolean exito;
}