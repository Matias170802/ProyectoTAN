package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMInmueble.DTOs.AltaInmueble;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class DTOAltaInmuebleResponse {
    private String mensaje;
    private boolean exito;
    private String codInmueble;
    private String nombreInmueble;
    private String codCliente;
    private String nombreCliente;
}