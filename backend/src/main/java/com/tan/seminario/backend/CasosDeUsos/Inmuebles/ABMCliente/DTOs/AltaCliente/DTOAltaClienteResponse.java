package com.tan.seminario.backend.CasosDeUsos.Inmuebles.ABMCliente.DTOs.AltaCliente;

import com.tan.seminario.backend.CasosDeUsos.Seguridad.ABMUsuarios.DTOs.TokenResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DTOAltaClienteResponse {
    private String nombreCliente;
    private String codCliente;
    private TokenResponse tokenResponse;
    private String mensaje;
    private String email;
    private String password;
}